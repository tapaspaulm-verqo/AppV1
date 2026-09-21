using Microsoft.AspNetCore.Mvc;
using Verqo.Application.Clients;
using Verqo.Infrastructure.Persistence;

namespace Verqo.Api.Controllers;

[ApiController]
[Route("api/v1/clients")]
public class ClientsController(RegisterClientService registerClientService, VerqoDbContext db) : ControllerBase
{
    /// <summary>
    /// Client registration. Every self-serve Client starts on the Standard
    /// plan (see Verqo.Application.Clients.RegisterClientService for why
    /// Business Plus isn't grantable here). GSTIN is optional and, if
    /// given, is structurally validated but not confirmed against GSTN —
    /// see Verqo.Application.Kyc.GstinValidator for what's checked today
    /// vs. what needs a real verification integration.
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterClientApiRequest request, CancellationToken ct)
    {
        try
        {
            var result = await registerClientService.RegisterAsync(new RegisterClientRequest(
                Email: request.Email,
                PasswordHash: PasswordHasher.Hash(request.Password), // see PasswordHasher remarks re: swapping to ASP.NET Core Identity
                CompanyName: request.CompanyName,
                Gstin: request.Gstin), ct);

            db.Users.Add(result.User);
            db.ClientProfiles.Add(result.Profile);
            await db.SaveChangesAsync(ct);

            return CreatedAtAction(nameof(Register), new
            {
                userId = result.User.Id,
                profile = new
                {
                    result.Profile.CompanyName,
                    result.Profile.Gstin,
                    plan = result.Profile.Plan.ToString(),
                },
            });
        }
        catch (ClientRegistrationValidationException ex)
        {
            // Same BadRequest(object) rationale as FreelancersController.Register —
            // see its remarks.
            var errors = ex.Errors
                .GroupBy(e => e.Field)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Message).ToArray());
            return BadRequest(new ValidationProblemDetails(errors));
        }
    }
}

public record RegisterClientApiRequest(
    string Email,
    string Password,
    string CompanyName,
    string? Gstin);
