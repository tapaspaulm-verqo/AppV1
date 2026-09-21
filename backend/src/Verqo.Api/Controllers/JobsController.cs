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
                j.Channel,
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
