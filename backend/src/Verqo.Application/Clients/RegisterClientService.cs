using Verqo.Application.Freelancers;
using Verqo.Application.Kyc;
using Verqo.Domain.Entities;
using Verqo.Domain.Enums;

namespace Verqo.Application.Clients;

public record RegisterClientRequest(
    string Email,
    string PasswordHash, // caller hashes before calling in — see RegisterFreelancerRequest's remarks
    string CompanyName,
    string? Gstin);

public class ClientRegistrationValidationException(IReadOnlyList<FieldError> errors) : Exception("Client registration failed validation.")
{
    public IReadOnlyList<FieldError> Errors { get; } = errors;
}

public record RegisterClientResult(User User, ClientProfile Profile);

/// <summary>
/// Orchestrates Client registration. Deliberately lighter than
/// <see cref="RegisterFreelancerService"/>: a Client only needs a company
/// name and (optionally) a GSTIN to self-serve register and start posting
/// jobs. Full business verification — incorporation, PAN, GST, authorised
/// signatory, bank account (draft Client Agreement Clause 3.1 / Annex D) —
/// happens later, before a Client can fund a Milestone into escrow, not as
/// a registration gate. Every Client starts on the Standard plan; Business
/// Plus is volume-negotiated (draft Client Agreement Clause 4.3) and isn't
/// something this self-serve flow can grant — see the Enterprise page.
///
/// Free of any persistence/EF Core dependency for the same reason as
/// RegisterFreelancerService: it builds the domain objects and leaves
/// saving them to the caller.
/// </summary>
public class RegisterClientService
{
    public Task<RegisterClientResult> RegisterAsync(RegisterClientRequest request, CancellationToken ct = default)
    {
        var errors = new List<FieldError>();

        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains('@'))
        {
            errors.Add(new FieldError("email", "A valid email is required."));
        }

        if (string.IsNullOrWhiteSpace(request.CompanyName))
        {
            errors.Add(new FieldError("companyName", "Company name is required."));
        }

        string? normalizedGstin = null;
        if (!string.IsNullOrWhiteSpace(request.Gstin))
        {
            var gstinOutcome = GstinValidator.Validate(request.Gstin);
            if (!gstinOutcome.IsValid)
            {
                errors.Add(new FieldError("gstin", gstinOutcome.Reason!));
            }
            else
            {
                normalizedGstin = GstinValidator.Normalize(request.Gstin);
            }
        }

        if (errors.Count > 0)
        {
            throw new ClientRegistrationValidationException(errors);
        }

        var user = new User
        {
            Email = request.Email.Trim().ToLowerInvariant(),
            PasswordHash = request.PasswordHash,
            Role = UserRole.Client,
        };

        var profile = new ClientProfile
        {
            UserId = user.Id,
            CompanyName = request.CompanyName.Trim(),
            Gstin = normalizedGstin,
            Plan = ClientPlan.Standard,
        };

        return Task.FromResult(new RegisterClientResult(user, profile));
    }
}
