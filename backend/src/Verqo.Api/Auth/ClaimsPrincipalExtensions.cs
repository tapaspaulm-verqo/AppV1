using System.Security.Claims;

namespace Verqo.Api.Auth;

/// <summary>
/// Every [Authorize]-gated controller needs "which user is this" and
/// "which Freelancer/Client profile does this token carry" — small
/// extension methods on the ClaimsPrincipal ASP.NET Core hands a
/// controller as `User` (see JwtTokenService for what's actually in the
/// token). Centralised here so every controller reads these claims the
/// same way instead of each hand-rolling its own FindFirstValue calls.
/// </summary>
public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("Token has no NameIdentifier claim.");
        return Guid.Parse(value);
    }

    public static Guid? GetFreelancerProfileId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue("freelancer_profile_id");
        return value is null ? null : Guid.Parse(value);
    }

    public static Guid? GetClientProfileId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue("client_profile_id");
        return value is null ? null : Guid.Parse(value);
    }
}
