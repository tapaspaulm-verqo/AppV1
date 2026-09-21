using Microsoft.AspNetCore.Mvc;
using Verqo.Application.Freelancers;
using Verqo.Infrastructure.Persistence;

namespace Verqo.Api.Controllers;

[ApiController]
[Route("api/v1/freelancers")]
public class FreelancersController(RegisterFreelancerService registerFreelancerService, VerqoDbContext db) : ControllerBase
{
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
}
