using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Verqo.Api.Auth;
using Verqo.Application.Common;
using Verqo.Domain.Entities;
using Verqo.Domain.Enums;
using Verqo.Infrastructure.Persistence;

namespace Verqo.Api.Controllers;

/// <summary>
/// Every money-moving action on a Milestone — the escrow fund → work →
/// submit → approve/release lifecycle from
/// Verqo.Application.Common.BusinessRules's state machine. Every state
/// write here goes through BusinessRules.AssertValidTransition first, and
/// every fee figure through BusinessRules.CalculateFees — never computed
/// inline — per that class's own "single source of truth" remarks.
///
/// The actual money movement (escrow debit/credit, payout rail) is the
/// mock adapter described in Verqo.Application.Payments.MockPaymentGatewayAdapter
/// — a real Razorpay/Cashfree integration is v2a scope, not this pass. The
/// ledger/payout/invoice rows written here are exactly what a real adapter
/// would need to reconcile against once it exists.
/// </summary>
[ApiController]
[Route("api/v1/milestones")]
[Authorize]
public class MilestonesController(VerqoDbContext db) : ControllerBase
{
    /// <summary>Client funds a Milestone into escrow. Unfunded → Funded.</summary>
    [Authorize(Roles = "Client")]
    [HttpPost("{id:guid}/fund")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Fund(Guid id, CancellationToken ct)
    {
        var milestone = await db.Milestones
            .Include(m => m.Contract!).ThenInclude(c => c.Client)
            .FirstOrDefaultAsync(m => m.Id == id, ct);

        if (milestone?.Contract is null)
        {
            return NotFound();
        }

        if (User.GetClientProfileId() != milestone.Contract.ClientId)
        {
            return Forbid();
        }

        if (!TryTransition(milestone, MilestoneState.Funded, out var conflict))
        {
            return conflict!;
        }

        var client = milestone.Contract.Client!;
        var fees = BusinessRules.CalculateFees(milestone.ContractValueMinor, client.Plan, client.NegotiatedFeeRate);

        db.LedgerEntries.Add(new LedgerEntry
        {
            MilestoneId = milestone.Id,
            Type = LedgerEntryType.EscrowFund,
            AmountMinor = fees.ClientPaysTotalMinor,
            IdempotencyKey = $"escrow-fund-{milestone.Id}",
        });

        milestone.State = MilestoneState.Funded;
        milestone.FundedAt = DateTime.UtcNow;
        milestone.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        return Ok(new { milestoneId = milestone.Id, state = milestone.State.ToString(), fees });
    }

    /// <summary>Freelancer starts work once funded. Funded → InProgress.</summary>
    [Authorize(Roles = "Freelancer")]
    [HttpPost("{id:guid}/start")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Start(Guid id, CancellationToken ct)
    {
        var milestone = await db.Milestones.Include(m => m.Contract).FirstOrDefaultAsync(m => m.Id == id, ct);
        if (milestone?.Contract is null)
        {
            return NotFound();
        }

        if (User.GetFreelancerProfileId() != milestone.Contract.FreelancerId)
        {
            return Forbid();
        }

        if (!TryTransition(milestone, MilestoneState.InProgress, out var conflict))
        {
            return conflict!;
        }

        milestone.State = MilestoneState.InProgress;
        milestone.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        return Ok(new { milestoneId = milestone.Id, state = milestone.State.ToString() });
    }

    /// <summary>Freelancer submits delivered work for review. InProgress → Submitted; starts the Client's review-window clock.</summary>
    [Authorize(Roles = "Freelancer")]
    [HttpPost("{id:guid}/submit")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Submit(Guid id, CancellationToken ct)
    {
        var milestone = await db.Milestones.Include(m => m.Contract).FirstOrDefaultAsync(m => m.Id == id, ct);
        if (milestone?.Contract is null)
        {
            return NotFound();
        }

        if (User.GetFreelancerProfileId() != milestone.Contract.FreelancerId)
        {
            return Forbid();
        }

        if (!TryTransition(milestone, MilestoneState.Submitted, out var conflict))
        {
            return conflict!;
        }

        var now = DateTime.UtcNow;
        milestone.State = MilestoneState.Submitted;
        milestone.SubmittedAt = now;
        milestone.ReviewDeadlineAt = now.AddDays(milestone.ReviewWindowDays);
        milestone.UpdatedAt = now;
        await db.SaveChangesAsync(ct);

        return Ok(new { milestoneId = milestone.Id, state = milestone.State.ToString(), milestone.ReviewDeadlineAt });
    }

    /// <summary>
    /// Client approves submitted work and releases escrow. Submitted →
    /// ApprovedReleased. This is the action behind the Client dashboard's
    /// "pending approvals" queue — it's the only place a Freelancer
    /// payout, the Verqo fee ledger entries, and the Milestone's invoice
    /// are created.
    /// </summary>
    [Authorize(Roles = "Client")]
    [HttpPost("{id:guid}/approve")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Approve(Guid id, CancellationToken ct)
    {
        var milestone = await db.Milestones
            .Include(m => m.Contract!).ThenInclude(c => c.Client)
            .FirstOrDefaultAsync(m => m.Id == id, ct);

        if (milestone?.Contract is null)
        {
            return NotFound();
        }

        if (User.GetClientProfileId() != milestone.Contract.ClientId)
        {
            return Forbid();
        }

        if (!TryTransition(milestone, MilestoneState.ApprovedReleased, out var conflict))
        {
            return conflict!;
        }

        var client = milestone.Contract.Client!;
        var fees = BusinessRules.CalculateFees(milestone.ContractValueMinor, client.Plan, client.NegotiatedFeeRate);
        var now = DateTime.UtcNow;

        db.LedgerEntries.AddRange(
            new LedgerEntry
            {
                MilestoneId = milestone.Id,
                Type = LedgerEntryType.FreelancerPayout,
                AmountMinor = fees.FreelancerReceivesMinor,
                IdempotencyKey = $"payout-{milestone.Id}",
            },
            new LedgerEntry
            {
                MilestoneId = milestone.Id,
                Type = LedgerEntryType.ClientFee,
                AmountMinor = fees.ClientFeeMinor,
                IdempotencyKey = $"client-fee-{milestone.Id}",
            },
            new LedgerEntry
            {
                MilestoneId = milestone.Id,
                Type = LedgerEntryType.FreelancerFee,
                AmountMinor = fees.FreelancerFeeMinor,
                IdempotencyKey = $"freelancer-fee-{milestone.Id}",
            });

        db.Payouts.Add(new Payout
        {
            MilestoneId = milestone.Id,
            // UPI default: cheapest/fastest domestic rail and what most
            // freelancer bank details on file would resolve to. No payout
            // rail preference is captured on FreelancerProfile yet — pick
            // it up from there once that field exists.
            Rail = PayoutRail.Upi,
            // MockPaymentGatewayAdapter settles synchronously — a real
            // gateway would leave this Initiated/Processing until its
            // webhook fires.
            Status = PayoutStatus.Success,
            AmountMinor = fees.FreelancerReceivesMinor,
            AttemptedAt = now,
            SettledAt = now,
        });

        db.Invoices.Add(new Invoice
        {
            MilestoneId = milestone.Id,
            InvoiceNumber = $"INV-{now:yyyyMM}-{milestone.Id.ToString()[..8].ToUpperInvariant()}",
            // No GST line: FreelancerProfile doesn't yet capture GST
            // registration status/GSTIN, so this invoices the
            // not-GST-registered case — the common case for early-career
            // freelancers under the ₹20L turnover threshold (Verqo's GST
            // compliance notes, "Freelancer's professional fee" section,
            // §20.3/20.6). Once GSTIN capture exists on FreelancerProfile,
            // switch this to charge 18% and file the freelancer's own tax
            // invoice per that same doc's §20.2/20.7.
            GstAmountMinor = 0,
            TotalMinor = milestone.ContractValueMinor,
        });

        milestone.State = MilestoneState.ApprovedReleased;
        milestone.ReleasedAt = now;
        milestone.UpdatedAt = now;

        await db.SaveChangesAsync(ct);

        return Ok(new { milestoneId = milestone.Id, state = milestone.State.ToString(), fees });
    }

    private static bool TryTransition(Milestone milestone, MilestoneState to, out IActionResult? conflictResult)
    {
        try
        {
            BusinessRules.AssertValidTransition(milestone.State, to);
            conflictResult = null;
            return true;
        }
        catch (InvalidOperationException ex)
        {
            conflictResult = new ConflictObjectResult(new { error = ex.Message });
            return false;
        }
    }
}
