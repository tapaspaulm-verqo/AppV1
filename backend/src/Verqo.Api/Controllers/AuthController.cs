using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Verqo.Api.Auth;
using Verqo.Infrastructure.Persistence;

namespace Verqo.Api.Controllers;

/// <summary>
/// Login for both personas (Freelancer and Client) — registration stays on
/// ClientsController/FreelancersController, this is the sign-in side.
///
/// No refresh-token flow yet: the token is a 12-hour bearer JWT
/// (JwtTokenService) and a client re-authenticates by logging in again
/// once it expires. That's an acceptable v1 trade-off given there's no
/// user base yet; add a refresh-token table (and a /refresh endpoint)
/// before this has real users who'd be annoyed by a 12-hour cap.
/// </summary>
[ApiController]
[Route("api/v1/auth")]
public class AuthController(VerqoDbContext db, JwtTokenService jwtTokenService) : ControllerBase
{
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginApiRequest request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await db.Users
            .Include(u => u.FreelancerProfile)
            .Include(u => u.ClientProfile)
            .FirstOrDefaultAsync(u => u.Email == email, ct);

        // Same response whether the email doesn't exist or the password is
        // wrong — never let a login endpoint confirm which emails are
        // registered (standard account-enumeration guard).
        if (user is null || !PasswordHasher.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { error = "Invalid email or password." });
        }

        var issued = jwtTokenService.GenerateToken(user);

        return Ok(new
        {
            token = issued.Token,
            expiresAt = issued.ExpiresAtUtc,
            user = BuildUserPayload(user),
        });
    }

    /// <summary>
    /// Lets a client app (Angular's app init, Flutter's splash screen)
    /// check whether a stored token is still good and re-fetch the current
    /// user without re-sending a password.
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var userId = User.GetUserId();
        var user = await db.Users
            .Include(u => u.FreelancerProfile)
            .Include(u => u.ClientProfile)
            .FirstOrDefaultAsync(u => u.Id == userId, ct);

        return user is null ? Unauthorized() : Ok(BuildUserPayload(user));
    }

    private static object BuildUserPayload(Domain.Entities.User user) => new
    {
        id = user.Id,
        email = user.Email,
        role = user.Role.ToString(),
        displayName = user.FreelancerProfile?.DisplayName ?? user.ClientProfile?.CompanyName ?? user.Email,
        freelancerProfileId = user.FreelancerProfile?.Id,
        clientProfileId = user.ClientProfile?.Id,
        isFullyVerified = user.FreelancerProfile?.IsFullyVerified,
    };
}

public record LoginApiRequest(string Email, string Password);
