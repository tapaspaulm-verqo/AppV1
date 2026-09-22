using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Verqo.Api.Auth;
using Verqo.Domain.Entities;
using Verqo.Domain.Enums;
using Verqo.Infrastructure.Persistence;

namespace Verqo.Api.Controllers;

[ApiController]
[Route("api/v1/jobs")]
public class JobsController(VerqoDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List(CancellationToken ct)
    {
        var jobs = await db.Jobs
            .Where(j => j.Status == JobStatus.Open)
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => new
            {
                j.Id,
                j.Title,
                j.RoleCategory,
                j.BudgetMinorMin,
                j.BudgetMinorMax,
                // .ToString() deliberately, not the raw enum: no
                // JsonStringEnumConverter is registered for this API, so
                // System.Text.Json's default is to serialize an unconverted
                // enum as its integer value, not "B2B"/"B2C" — which would
                // silently break every client (Angular's `channel: string`,
                // and Flutter's `JobSummary.channel` in api_client.dart)
                // expecting a string. FreelancersController and
                // ClientsController already convert their enum-backed
                // status/plan fields the same way; this brings Jobs in line.
                Channel = j.Channel.ToString(),
                j.CreatedAt,
            })
            .ToListAsync(ct);

        return Ok(jobs);
    }

    /// <summary>
    /// A Freelancer's personalised "new project search" view: open jobs
    /// ranked with a same-RoleCategory match first, so the dashboard's job
    /// search naturally surfaces the most relevant postings without a
    /// separate recommendation service.
    /// </summary>
    [Authorize(Roles = "Freelancer")]
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string? role, [FromQuery] string? q, CancellationToken ct)
    {
        var query = db.Jobs.Where(j => j.Status == JobStatus.Open);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim();
            query = query.Where(j => j.Title.Contains(term) || j.Description.Contains(term) || j.RoleCategory.Contains(term));
        }

        var jobs = await query
            .OrderByDescending(j => j.RoleCategory == role)
            .ThenByDescending(j => j.CreatedAt)
            .Select(j => new
            {
                j.Id,
                j.Title,
                j.RoleCategory,
                j.BudgetMinorMin,
                j.BudgetMinorMax,
                Channel = j.Channel.ToString(),
                clientName = j.Client!.CompanyName,
                proposalCount = j.Proposals.Count,
                j.CreatedAt,
            })
            .ToListAsync(ct);

        return Ok(jobs);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var job = await db.Jobs.FirstOrDefaultAsync(j => j.Id == id, ct);
        return job is null ? NotFound() : Ok(job);
    }

    /// <summary>"Create new project" from the Client dashboard.</summary>
    [Authorize(Roles = "Client")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateJobApiRequest request, CancellationToken ct)
    {
        var clientProfileId = User.GetClientProfileId();
        if (clientProfileId is null)
        {
            return BadRequest(new { error = "Only a Client profile can post a job." });
        }

        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Description) ||
            string.IsNullOrWhiteSpace(request.RoleCategory))
        {
            return BadRequest(new { error = "Title, description and roleCategory are required." });
        }

        var channel = Enum.TryParse<EngagementChannel>(request.Channel, ignoreCase: true, out var parsedChannel)
            ? parsedChannel
            : EngagementChannel.B2C;

        var job = new Job
        {
            ClientId = clientProfileId.Value,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Channel = channel,
            RoleCategory = request.RoleCategory.Trim(),
            BudgetMinorMin = request.BudgetMinorMin,
            BudgetMinorMax = request.BudgetMinorMax,
        };

        db.Jobs.Add(job);
        await db.SaveChangesAsync(ct);

        return CreatedAtAction(nameof(GetById), new { id = job.Id }, new
        {
            job.Id,
            job.Title,
            status = job.Status.ToString(),
        });
    }

    /// <summary>A Client's own posted jobs, for the "manage my postings" part of their dashboard.</summary>
    [Authorize(Roles = "Client")]
    [HttpGet("mine")]
    public async Task<IActionResult> Mine(CancellationToken ct)
    {
        var clientProfileId = User.GetClientProfileId();

        var jobs = await db.Jobs
            .Where(j => j.ClientId == clientProfileId)
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => new
            {
                j.Id,
                j.Title,
                j.RoleCategory,
                status = j.Status.ToString(),
                proposalCount = j.Proposals.Count,
                j.CreatedAt,
            })
            .ToListAsync(ct);

        return Ok(jobs);
    }

    /// <summary>A Freelancer applies to an open job.</summary>
    [Authorize(Roles = "Freelancer")]
    [HttpPost("{id:guid}/proposals")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> SubmitProposal(Guid id, [FromBody] SubmitProposalApiRequest request, CancellationToken ct)
    {
        var freelancerProfileId = User.GetFreelancerProfileId();
        if (freelancerProfileId is null)
        {
            return BadRequest(new { error = "Only a Freelancer profile can submit a proposal." });
        }

        var job = await db.Jobs.FirstOrDefaultAsync(j => j.Id == id, ct);
        if (job is null)
        {
            return NotFound();
        }

        if (job.Status != JobStatus.Open)
        {
            return Conflict(new { error = "This job is no longer accepting proposals." });
        }

        var alreadyApplied = await db.Proposals.AnyAsync(p => p.JobId == id && p.FreelancerId == freelancerProfileId, ct);
        if (alreadyApplied)
        {
            return Conflict(new { error = "You have already applied to this job." });
        }

        var proposal = new Proposal
        {
            JobId = id,
            FreelancerId = freelancerProfileId.Value,
            CoverNote = request.CoverNote,
            ProposedRateMinor = request.ProposedRateMinor,
        };

        db.Proposals.Add(proposal);
        await db.SaveChangesAsync(ct);

        return CreatedAtAction(nameof(GetById), new { id = job.Id }, new
        {
            proposal.Id,
            status = proposal.Status.ToString(),
        });
    }
}

public record CreateJobApiRequest(
    string Title,
    string Description,
    string RoleCategory,
    string? Channel,
    int? BudgetMinorMin,
    int? BudgetMinorMax);

public record SubmitProposalApiRequest(string CoverNote, int ProposedRateMinor);
