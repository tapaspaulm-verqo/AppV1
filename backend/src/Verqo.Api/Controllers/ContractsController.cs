using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Verqo.Api.Auth;
using Verqo.Application.Common;
using Verqo.Domain.Entities;
using Verqo.Infrastructure.Persistence;

namespace Verqo.Api.Controllers;

/// <summary>
/// A Contract is created by ProposalsController.Accept, never directly here
/// — see its remarks. This controller is read access to "my contracts" plus
/// milestone authoring (a Client adding a Milestone to a Contract they
/// own); the money-moving milestone actions (fund/start/submit/approve)
/// live in MilestonesController.
/// </summary>
[ApiController]
[Route("api/v1/contracts")]
[Authorize]
public class ContractsController(VerqoDbContext db) : ControllerBase
{
    /// <summary>Every Contract the caller is a party to — a Freelancer's or a Client's, whichever profile the token carries.</summary>
    [HttpGet("mine")]
    public async Task<IActionResult> Mine(CancellationToken ct)
    {
        var freelancerProfileId = User.GetFreelancerProfileId();
        var clientProfileId = User.GetClientProfileId();

        var query = db.Contracts.AsQueryable();
        query = freelancerProfileId is { } fpId
            ? query.Where(c => c.FreelancerId == fpId)
            : clientProfileId is { } cpId
                ? query.Where(c => c.ClientId == cpId)
                : query.Where(_ => false);

        var contracts = await query
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.ScopeSummary,
                status = c.Status.ToString(),
                channel = c.Channel.ToString(),
                jobTitle = c.Job != null ? c.Job.Title : null,
                counterpartyName = freelancerProfileId != null ? c.Client!.CompanyName : c.Freelancer!.DisplayName,
                c.CreatedAt,
                contractValueMinor = c.Milestones.Sum(m => m.ContractValueMinor),
                milestones = c.Milestones
                    .OrderBy(m => m.CreatedAt)
                    .Select(m => new
                    {
                        m.Id,
                        m.Title,
                        m.ContractValueMinor,
                        state = m.State.ToString(),
                        m.ReviewWindowDays,
                        m.FundedAt,
                        m.SubmittedAt,
                        m.ReviewDeadlineAt,
                        m.ReleasedAt,
                    }),
            })
            .ToListAsync(ct);

        return Ok(contracts);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var contract = await db.Contracts
            .Include(c => c.Job)
            .Include(c => c.Client)
            .Include(c => c.Freelancer)
            .Include(c => c.Milestones).ThenInclude(m => m.LedgerEntries)
            .Include(c => c.Milestones).ThenInclude(m => m.Invoice)
            .FirstOrDefaultAsync(c => c.Id == id, ct);

        if (contract is null)
        {
            return NotFound();
        }

        var freelancerProfileId = User.GetFreelancerProfileId();
        var clientProfileId = User.GetClientProfileId();
        var isParty = contract.FreelancerId == freelancerProfileId || contract.ClientId == clientProfileId;
        if (!isParty)
        {
            return Forbid();
        }

        return Ok(new
        {
            contract.Id,
            contract.ScopeSummary,
            status = contract.Status.ToString(),
            channel = contract.Channel.ToString(),
            jobTitle = contract.Job?.Title,
            client = new { contract.Client!.Id, contract.Client.CompanyName, plan = contract.Client.Plan.ToString() },
            freelancer = new { contract.Freelancer!.Id, contract.Freelancer.DisplayName, contract.Freelancer.PrimaryRole },
            contract.CreatedAt,
            milestones = contract.Milestones.OrderBy(m => m.CreatedAt).Select(m => new
            {
                m.Id,
                m.Title,
                m.ContractValueMinor,
                state = m.State.ToString(),
                m.ReviewWindowDays,
                m.RevisionsAllowed,
                m.RevisionsUsed,
                m.FundedAt,
                m.SubmittedAt,
                m.ReviewDeadlineAt,
                m.ReleasedAt,
                invoice = m.Invoice == null ? null : new
                {
                    m.Invoice.InvoiceNumber,
                    m.Invoice.GstAmountMinor,
                    m.Invoice.TotalMinor,
                    m.Invoice.IssuedAt,
                },
                ledgerEntries = m.LedgerEntries.OrderBy(l => l.CreatedAt).Select(l => new
                {
                    l.Id,
                    type = l.Type.ToString(),
                    l.AmountMinor,
                    l.CreatedAt,
                }),
            }),
        });
    }

    /// <summary>A Client adds a Milestone (Unfunded by default) to a Contract they own.</summary>
    [Authorize(Roles = "Client")]
    [HttpPost("{id:guid}/milestones")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddMilestone(Guid id, [FromBody] CreateMilestoneApiRequest request, CancellationToken ct)
    {
        var contract = await db.Contracts.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (contract is null)
        {
            return NotFound();
        }

        if (User.GetClientProfileId() != contract.ClientId)
        {
            return Forbid();
        }

        if (string.IsNullOrWhiteSpace(request.Title) || request.ContractValueMinor <= 0)
        {
            return BadRequest(new { error = "Title is required and contractValueMinor must be positive." });
        }

        var milestone = new Milestone
        {
            ContractId = contract.Id,
            Title = request.Title.Trim(),
            ContractValueMinor = request.ContractValueMinor,
            ReviewWindowDays = request.ReviewWindowDays ?? BusinessRules.DefaultReviewWindowDays,
            RevisionsAllowed = request.RevisionsAllowed ?? BusinessRules.DefaultRevisionsAllowed,
        };

        db.Milestones.Add(milestone);
        await db.SaveChangesAsync(ct);

        return CreatedAtAction(nameof(GetById), new { id = contract.Id }, new
        {
            milestone.Id,
            state = milestone.State.ToString(),
        });
    }
}

public record CreateMilestoneApiRequest(
    string Title,
    int ContractValueMinor,
    int? ReviewWindowDays,
    int? RevisionsAllowed);
