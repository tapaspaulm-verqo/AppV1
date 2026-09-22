using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Verqo.Api.Auth;
using Verqo.Domain.Enums;
using Verqo.Infrastructure.Persistence;

namespace Verqo.Api.Controllers;

/// <summary>
/// One call per persona that returns everything their personalised
/// post-login view needs, so the web and mobile dashboards don't have to
/// stitch together five separate requests on every load. Deliberately two
/// separate, differently-shaped endpoints rather than one "generic"
/// dashboard — a Freelancer and a Client are looking at almost entirely
/// different data (their own earnings/taxes vs. their escrow balance and
/// approval queue), and forcing one shape onto both would just mean each
/// client app picks apart a payload half of which is null for them.
/// </summary>
[ApiController]
[Route("api/v1/dashboard")]
[Authorize]
public class DashboardController(VerqoDbContext db) : ControllerBase
{
    /// <summary>
    /// The escrow-payment TDS threshold under Income Tax Act Section
    /// 194-O — 0.1% withheld once a Freelancer's cumulative payments
    /// through Verqo in the financial year cross ₹5,00,000. See Verqo's
    /// GST/tax compliance notes, "Income-tax TDS under Section 194-O"
    /// (§20.5), for the full rule this approximates.
    /// </summary>
    private const int Section194OThresholdMinor = 500_000 * 100;
    private const double Section194OTdsRate = 0.001;

    [Authorize(Roles = "Freelancer")]
    [HttpGet("freelancer")]
    public async Task<IActionResult> Freelancer(CancellationToken ct)
    {
        var freelancerProfileId = User.GetFreelancerProfileId();
        if (freelancerProfileId is null)
        {
            return BadRequest(new { error = "No Freelancer profile on this account." });
        }

        var profile = await db.FreelancerProfiles
            .Where(f => f.Id == freelancerProfileId)
            .Select(f => new
            {
                f.Id,
                f.DisplayName,
                f.Headline,
                f.PrimaryRole,
                rateBand = f.RateBand.ToString(),
                experienceLevel = f.ExperienceLevel.ToString(),
                f.HourlyRateMinor,
                f.IsFullyVerified,
                panStatus = f.PanVerificationResult.ToString(),
                aadhaarStatus = f.AadhaarVerificationResult.ToString(),
            })
            .FirstOrDefaultAsync(ct);

        if (profile is null)
        {
            return NotFound();
        }

        var contracts = await db.Contracts
            .Where(c => c.FreelancerId == freelancerProfileId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.ScopeSummary,
                status = c.Status.ToString(),
                clientName = c.Client!.CompanyName,
                jobTitle = c.Job != null ? c.Job.Title : null,
                c.CreatedAt,
                milestones = c.Milestones.OrderBy(m => m.CreatedAt).Select(m => new
                {
                    m.Id,
                    m.Title,
                    m.ContractValueMinor,
                    state = m.State.ToString(),
                    m.SubmittedAt,
                    m.ReviewDeadlineAt,
                    m.ReleasedAt,
                }),
            })
            .ToListAsync(ct);

        // Every ledger entry across every milestone of every contract this
        // Freelancer is party to — pulled once, aggregated in memory below,
        // rather than five separate SUM() queries.
        var ledgerEntries = await db.LedgerEntries
            .Where(l => l.Milestone!.Contract!.FreelancerId == freelancerProfileId)
            .Select(l => new { l.Type, l.AmountMinor, l.CreatedAt })
            .ToListAsync(ct);

        var totalEarnedMinor = ledgerEntries.Where(l => l.Type == LedgerEntryType.FreelancerPayout).Sum(l => l.AmountMinor);

        var pendingInEscrowMinor = contracts
            .SelectMany(c => c.milestones)
            .Where(m => m.state is nameof(MilestoneState.Funded) or nameof(MilestoneState.InProgress) or nameof(MilestoneState.Submitted))
            .Sum(m => m.ContractValueMinor);

        var openProposalsCount = await db.Proposals
            .CountAsync(p => p.FreelancerId == freelancerProfileId &&
                (p.Status == ProposalStatus.Submitted || p.Status == ProposalStatus.Shortlisted), ct);

        // Financial-year-to-date payout total, for the 194-O estimate below.
        var now = DateTime.UtcNow;
        var fyStart = now.Month >= 4 ? new DateTime(now.Year, 4, 1) : new DateTime(now.Year - 1, 4, 1);
        var fyToDateEarnedMinor = ledgerEntries
            .Where(l => l.Type == LedgerEntryType.FreelancerPayout && l.CreatedAt >= fyStart)
            .Sum(l => l.AmountMinor);
        var taxableForTdsMinor = Math.Max(0, fyToDateEarnedMinor - Section194OThresholdMinor);
        var estimatedTdsMinor = (int)Math.Round(taxableForTdsMinor * Section194OTdsRate, MidpointRounding.AwayFromZero);

        var totalGstCollectedMinor = await db.Invoices
            .Where(i => i.Milestone!.Contract!.FreelancerId == freelancerProfileId)
            .SumAsync(i => i.GstAmountMinor, ct);

        var recommendedJobs = await db.Jobs
            .Where(j => j.Status == JobStatus.Open)
            .OrderByDescending(j => j.RoleCategory == profile.PrimaryRole)
            .ThenByDescending(j => j.CreatedAt)
            .Take(5)
            .Select(j => new
            {
                j.Id,
                j.Title,
                j.RoleCategory,
                j.BudgetMinorMin,
                j.BudgetMinorMax,
                clientName = j.Client!.CompanyName,
            })
            .ToListAsync(ct);

        return Ok(new
        {
            profile,
            summary = new
            {
                activeContracts = contracts.Count(c => c.status == nameof(ContractStatus.Active)),
                totalEarnedMinor,
                pendingInEscrowMinor,
                openProposalsCount,
            },
            contracts,
            taxSummary = new
            {
                financialYearStart = fyStart,
                fyToDateEarnedMinor,
                totalGstCollectedMinor,
                estimatedTdsMinor,
                note = "Estimated for planning only, not a filed tax record. TDS estimate follows Income Tax Act Section 194-O " +
                       "(0.1% on cumulative payments once they cross ₹5,00,000 in the financial year). GST shown is what's on " +
                       "file for this milestone's invoice; most freelancers under the ₹20L GST turnover threshold won't have a GST line yet.",
            },
            recommendedJobs,
        });
    }

    [Authorize(Roles = "Client")]
    [HttpGet("client")]
    public async Task<IActionResult> Client(CancellationToken ct)
    {
        var clientProfileId = User.GetClientProfileId();
        if (clientProfileId is null)
        {
            return BadRequest(new { error = "No Client profile on this account." });
        }

        var profile = await db.ClientProfiles
            .Where(c => c.Id == clientProfileId)
            .Select(c => new { c.Id, c.CompanyName, c.Gstin, plan = c.Plan.ToString(), c.NegotiatedFeeRate })
            .FirstOrDefaultAsync(ct);

        if (profile is null)
        {
            return NotFound();
        }

        var contracts = await db.Contracts
            .Where(c => c.ClientId == clientProfileId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.ScopeSummary,
                status = c.Status.ToString(),
                freelancerName = c.Freelancer!.DisplayName,
                freelancerRole = c.Freelancer.PrimaryRole,
                jobTitle = c.Job != null ? c.Job.Title : null,
                c.CreatedAt,
                milestones = c.Milestones.OrderBy(m => m.CreatedAt).Select(m => new
                {
                    m.Id,
                    m.Title,
                    m.ContractValueMinor,
                    state = m.State.ToString(),
                    m.SubmittedAt,
                    m.ReviewDeadlineAt,
                    m.ReleasedAt,
                }),
            })
            .ToListAsync(ct);

        // Escrow balance: everything funded into a still-open milestone for
        // this Client's contracts, minus whatever's already been released
        // out of it. A milestone that's ApprovedReleased/RefundedCancelled
        // has matching debit ledger entries already, so this naturally
        // nets to zero for those without needing to filter them out here.
        var ledgerEntries = await db.LedgerEntries
            .Where(l => l.Milestone!.Contract!.ClientId == clientProfileId)
            .Select(l => new { l.Type, l.AmountMinor })
            .ToListAsync(ct);

        var escrowBalanceMinor =
            ledgerEntries.Where(l => l.Type == LedgerEntryType.EscrowFund).Sum(l => l.AmountMinor) -
            ledgerEntries.Where(l => l.Type is LedgerEntryType.FreelancerPayout or LedgerEntryType.ClientFee
                or LedgerEntryType.FreelancerFee or LedgerEntryType.Refund).Sum(l => l.AmountMinor);

        // "Pending tasks of approving payment release" — every Submitted
        // Milestone across this Client's contracts, oldest review deadline
        // first so the most time-sensitive approval surfaces on top.
        var pendingApprovals = await db.Milestones
            .Where(m => m.Contract!.ClientId == clientProfileId && m.State == MilestoneState.Submitted)
            .OrderBy(m => m.ReviewDeadlineAt)
            .Select(m => new
            {
                m.Id,
                contractId = m.ContractId,
                m.Title,
                m.ContractValueMinor,
                freelancerName = m.Contract!.Freelancer!.DisplayName,
                m.SubmittedAt,
                m.ReviewDeadlineAt,
            })
            .ToListAsync(ct);

        var postedJobs = await db.Jobs
            .Where(j => j.ClientId == clientProfileId)
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => new
            {
                j.Id,
                j.Title,
                status = j.Status.ToString(),
                proposalCount = j.Proposals.Count,
                j.CreatedAt,
            })
            .ToListAsync(ct);

        return Ok(new
        {
            profile,
            summary = new
            {
                activeContracts = contracts.Count(c => c.status == nameof(ContractStatus.Active)),
                escrowBalanceMinor,
                pendingApprovalsCount = pendingApprovals.Count,
                openJobsCount = postedJobs.Count(j => j.status == nameof(JobStatus.Open)),
            },
            contracts,
            pendingApprovals,
            postedJobs,
        });
    }
}
