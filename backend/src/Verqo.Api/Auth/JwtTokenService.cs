using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Verqo.Domain.Entities;

namespace Verqo.Api.Auth;

/// <summary>
/// Issues the JWTs that Program.cs's AddJwtBearer call validates — same
/// three config values (Jwt:Issuer / Jwt:Audience / Jwt:SigningKey),
/// passed in via constructor rather than re-read from IConfiguration so
/// this stays a small, directly-testable class.
///
/// Lives in Verqo.Api, not Verqo.Application: it depends on
/// System.IdentityModel.Tokens.Jwt / Microsoft.IdentityModel.Tokens, which
/// only arrive here as a transitive dependency of the
/// Microsoft.AspNetCore.Authentication.JwtBearer package Verqo.Api already
/// references. Verqo.Application and Verqo.Domain deliberately reference
/// zero external NuGet packages (see docs/ARCHITECTURE.md §7 and the
/// OfflineSmokeTests project) — that's what lets them actually build and
/// run inside a sandbox with no NuGet access. Adding a JWT dependency there
/// would break that property for no benefit, since token issuance is an
/// API-hosting concern, not a domain one.
/// </summary>
public class JwtTokenService(string issuer, string audience, string signingKey)
{
    /// <summary>
    /// 12 hours: long enough that a freelancer or client checking their
    /// dashboard a few times a day isn't re-prompted to log in, short
    /// enough that a stolen token has a bounded blast radius pending a
    /// real refresh-token flow (out of scope for this pass — see
    /// AuthController remarks).
    /// </summary>
    private static readonly TimeSpan TokenLifetime = TimeSpan.FromHours(12);

    public JwtIssueResult GenerateToken(User user)
    {
        var expiresAt = DateTime.UtcNow.Add(TokenLifetime);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            // ClaimTypes.Role is the default RoleClaimType ASP.NET Core's
            // authorization middleware reads, so plain [Authorize(Roles =
            // "Client")] attributes work on controllers/actions with no
            // extra wiring in Program.cs.
            new(ClaimTypes.Role, user.Role.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        // Convenience claims so a controller (or the calling client app)
        // can read the profile id straight off the token instead of a
        // second round trip — both are optional; a brand-new User between
        // registration and profile creation would have neither.
        if (user.FreelancerProfile is { } freelancerProfile)
        {
            claims.Add(new Claim("freelancer_profile_id", freelancerProfile.Id.ToString()));
        }

        if (user.ClientProfile is { } clientProfile)
        {
            claims.Add(new Claim("client_profile_id", clientProfile.Id.ToString()));
        }

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: signingCredentials);

        return new JwtIssueResult(new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}

public record JwtIssueResult(string Token, DateTime ExpiresAtUtc);
