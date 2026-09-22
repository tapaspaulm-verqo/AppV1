using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Verqo.Api.Auth;
using Verqo.Domain.Entities;
using Verqo.Domain.Enums;
using Verqo.Infrastructure.Persistence;

namespace Verqo.Api.Controllers;

[ApiController]
[Route("api/v1/proposals")]
[Authorize]
public class ProposalsController(VerqoDbContext db) : ControllerBase
{
    /// <summary>A Freelancer's own proposals and their status, for the dashboard's "applications" view.</summary>
    [Authorize(Roles = "Freelancer")]
    [HttpGet("mine")]
    public async Task<IActionResult> Mine(CancellationToken ct)
    {
        var freelancerProfileId = User.GetFreelancerProfileId();

        var proposals = await db.Proposals
            .Where(p => p.FreelancerId == freelancerProfileId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Id,
                jobId = p.JobId,
                jobTitle = p.Job!.Title,
                clientName = p.Job.Client!.CompanyName,
                p.ProposedRateMinor,
                status = p.Status.ToString(),
                p.CreatedAt,
            })
            .ToListAsync(ct);

        return Ok(proposals);
    }

    /// <summary>
    /// A Client accepting a proposal is what actually creates the
    /// Contract — this is the one place in the API that does. The other
    /// still-open proposals on the same Job are rejected in the same
    /// transaction, since one Job only ever leads to one Contract in this
    /// model.
    /// </summary>
    [Authorize(Roles = "Client")]
    [HttpPost("{id:guid}/accept")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Accept(Guid id, [FromBody] AcceptProposalApiRequest request, CancellationToken ct)
    {
        var proposal = await db.Proposals
            .Include(p => p.Job)
            .FirstOrDefaultAsync(p => p.Id == id, ct);

        if (proposal?.Job is null)
        {
            return NotFound();
        }

        var clientProfileId = User.GetClientProfileId();
        if (clientProfileId != proposal.Job.ClientId)
        {
            return Forbid();
        }

        if (proposal.Status is not (ProposalStatus.Submitted or ProposalStatus.Shortlisted))
        {
            return Conflict(new { error = $"Proposal is already {proposal.Status}." });
        }

        proposal.Status = ProposalStatus.Accepted;
        proposal.Job.Status = JobStatus.Hired;
        proposal.Job.UpdatedAt = DateTime.UtcNow;

        var contract = new Contract
        {
            JobId = proposal.JobId,
            ClientId = proposal.Job.ClientId,
            FreelancerId = proposal.FreelancerId,
            Channel = proposal.Job.Channel,
            ScopeSummary = string.IsNullOrWhiteSpace(request.ScopeSummary) ? proposal.Job.Title : request.ScopeSummary,
        };
        db.Contracts.Add(contract);

        var otherOpenProposals = await db.Proposals
            .Where(p => p.JobId == proposal.JobId && p.Id != proposal.Id &&
                (p.Status == ProposalStatus.Submitted || p.Status == ProposalStatus.Shortlisted))
            .ToListAsync(ct);
        foreach (var other in otherOpenProposals)
        {
            other.Status = ProposalStatus.Rejected;
        }

        await db.SaveChangesAsync(ct);

        return Ok(new { contractId = contract.Id });
    }

    [Authorize(Roles = "Client")]
    [HttpPost("{id:guid}/shortlist")]
    public async Task<IActionResult> Shortlist(Guid id, CancellationToken ct)
    {
        var proposal = await db.Proposals.Include(p => p.Job).FirstOrDefaultAsync(p => p.Id == id, ct);
        if (proposal?.Job is null)
        {
            return NotFound();
        }

        if (User.GetClientProfileId() != proposal.Job.ClientId)
        {
            return Forbid();
        }

        if (proposal.Status != ProposalStatus.Submitted)
        {
            return Conflict(new { error = $"Proposal is already {proposal.Status}." });
        }

        proposal.Status = ProposalStatus.Shortlisted;
        await db.SaveChangesAsync(ct);

        return Ok(new { proposal.Id, status = proposal.Status.ToString() });
    }

    [Authorize(Roles = "Client")]
    [HttpPost("{id:guid}/reject")]
    public async Task<IActionResult> Reject(Guid id, CancellationToken ct)
    {
        var proposal = await db.Proposals.Include(p => p.Job).FirstOrDefaultAsync(p => p.Id == id, ct);
        if (proposal?.Job is null)
        {
            return NotFound();
        }

        if (User.GetClientProfileId() != proposal.Job.ClientId)
        {
            return Forbid();
        }

        proposal.Status = ProposalStatus.Rejected;
        await db.SaveChangesAsync(ct);

        return Ok(new { proposal.Id, status = proposal.Status.ToString() });
    }
}

public record AcceptProposalApiRequest(string? ScopeSummary);
