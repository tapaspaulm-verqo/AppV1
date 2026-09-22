using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Verqo.Application.Freelancers;
using Verqo.Infrastructure.Persistence;

namespace Verqo.Api.Controllers;

[ApiController]
[Route("api/v1/freelancers")]
public class FreelancersController(RegisterFreelancerService registerFreelancerService, VerqoDbContext db) : ControllerBase
{
    /// <summary>
    /// A Client's "find new contractors" search. Deliberately exposes only
    /// what a hiring decision needs (headline, role, rate band, experience,
    /// hourly rate, verification status) — never PAN/Aadhaar/bank details,
    /// which stay on FreelancerProfile and out of every projection in this
    /// file.
    /// </summary>
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? role, [FromQuery] string? q, CancellationToken ct)
    {
        var query = db.FreelancerProfiles.AsQueryable();

        if (!string.IsNullOrWhiteSpace(role))
        {
            query = query.Where(f => f.PrimaryRole == role);
        }

        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim();
            query = query.Where(f =>
                f.DisplayName.Contains(term) ||
                f.PrimaryRole.Contains(term) ||
                (f.Headline != null && f.Headline.Contains(term)));
        }

        var freelancers = await query
            .OrderByDescending(f => f.CreatedAt)
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
            })
            .ToListAsync(ct);

        return Ok(freelancers);
    }

    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var freelancer = await db.FreelancerProfiles
            .Where(f => f.Id == id)
            .Select(f => new
            {
                f.Id,
                f.DisplayName,
                f.Headline,
                f.Bio,
                f.PrimaryRole,
                rateBand = f.RateBand.ToString(),
                experienceLevel = f.ExperienceLevel.ToString(),
                f.HourlyRateMinor,
                f.IsFullyVerified,
            })
            .FirstOrDefaultAsync(ct);

        return freelancer is null ? NotFound() : Ok(freelancer);
    }

    /// <summary>
    /// Freelancer registration. Runs PAN format validation, Aadhaar
    /// format+checksum validation, and (if a UAN is supplied) an EPF
    /// active-account check automatically — see
    /// Verqo.Application.Freelancers.RegisterFreelancerService and
    /// Verqo.Application.Kyc.IKycVerificationService for what's a real
    /// offline check today vs. what's mocked pending a licensed KYC vendor.
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterFreelancerApiRequest request, CancellationToken ct)
    {
        try
        {
            var result = await registerFreelancerService.RegisterAsync(new RegisterFreelancerRequest(
                Email: request.Email,
                PasswordHash: PasswordHasher.Hash(request.Password), // see PasswordHasher remarks re: swapping to ASP.NET Core Identity
                DisplayName: request.DisplayName,
                PrimaryRole: request.PrimaryRole,
                PanNumber: request.PanNumber,
                AadhaarNumber: request.AadhaarNumber,
                EpfUan: request.EpfUan), ct);

            db.Users.Add(result.User);
            db.FreelancerProfiles.Add(result.Profile);
            db.VerificationChecks.AddRange(result.Checks);
            await db.SaveChangesAsync(ct);

            return CreatedAtAction(nameof(Register), new
            {
                userId = result.User.Id,
                profile = new
                {
                    result.Profile.DisplayName,
                    panStatus = result.Profile.PanVerificationResult.ToString(),
                    aadhaarStatus = result.Profile.AadhaarVerificationResult.ToString(),
                    epfStatus = result.Profile.EpfActiveStatusResult.ToString(),
                    isFullyVerified = result.Profile.IsFullyVerified,
                },
            });
        }
        catch (RegistrationValidationException ex)
        {
            // BadRequest(object) rather than the ValidationProblem(...) helper overloads:
            // those are only certain to exist for a ModelStateDictionary, not for a
            // hand-built ValidationProblemDetails, and this couldn't be compiler-checked
            // in the sandbox that produced this scaffold (see docs/ARCHITECTURE.md §7) —
            // BadRequest(object) is unambiguous and gives the same JSON shape.
            var errors = ex.Errors
                .GroupBy(e => e.Field)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Message).ToArray());
            return BadRequest(new ValidationProblemDetails(errors));
        }
    }
}

public record RegisterFreelancerApiRequest(
    string Email,
    string Password,
    string DisplayName,
    string PrimaryRole,
    string PanNumber,
    string AadhaarNumber,
    string? EpfUan);

/// <summary>
/// Placeholder hashing so this controller compiles and is runnable end to
/// end without pulling in ASP.NET Core Identity's full package surface.
/// Replace with ASP.NET Core Identity's PasswordHasher&lt;T&gt; (or
/// Argon2id via a package like Konscious.Security.Cryptography) before this
/// touches real user data — this is NOT secure password storage as written.
/// </summary>
public static class PasswordHasher
{
    public static string Hash(string password) =>
        Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(password)));

    /// <summary>
    /// Used by AuthController's login endpoint. Safe against timing
    /// side-channels the same way the SHA256 comparison in an ASP.NET Core
    /// Identity PasswordHasher would be — <see cref="System.Security.Cryptography.CryptographicOperations.FixedTimeEquals"/>
    /// rather than <c>==</c>/<c>string.Equals</c>, which short-circuits on
    /// the first differing byte and could otherwise leak how many
    /// leading hex characters of a guess were correct.
    /// </summary>
    public static bool Verify(string password, string passwordHash)
    {
        var candidate = Hash(password);
        return System.Security.Cryptography.CryptographicOperations.FixedTimeEquals(
            System.Text.Encoding.UTF8.GetBytes(candidate),
            System.Text.Encoding.UTF8.GetBytes(passwordHash));
    }
}
