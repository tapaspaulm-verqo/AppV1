using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var job = await db.Jobs.FirstOrDefaultAsync(j => j.Id == id, ct);
        return job is null ? NotFound() : Ok(job);
    }
}
