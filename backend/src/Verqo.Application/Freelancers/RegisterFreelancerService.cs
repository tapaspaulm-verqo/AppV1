using Verqo.Application.Kyc;
using Verqo.Domain.Entities;
using Verqo.Domain.Enums;

namespace Verqo.Application.Freelancers;

public record RegisterFreelancerRequest(
    string Email,
    string PasswordHash, // caller hashes before calling in (keeps this class free of a crypto/Identity dependency)
    string DisplayName,
    string PrimaryRole,
    string PanNumber,
    string AadhaarNumber,
    string? EpfUan);

public record FieldError(string Field, string Message);

public class RegistrationValidationException(IReadOnlyList<FieldError> errors) : Exception("Freelancer registration failed validation.")
{
    public IReadOnlyList<FieldError> Errors { get; } = errors;
}

public record RegisterFreelancerResult(User User, FreelancerProfile Profile, IReadOnlyList<VerificationCheck> Checks);

/// <summary>
/// Orchestrates freelancer registration: PAN + Aadhaar validation (via
/// <see cref="IKycVerificationService"/>, offline format checks today, a
/// licensed vendor call once one is contracted) and an EPF active-account
/// check, per this rebuild's requirement that these run automatically at
/// signup rather than as a manual back-office step. Deliberately free of
/// any persistence/EF Core dependency — it builds the domain objects and
/// leaves saving them to the caller (API layer + Infrastructure), so this
/// class (and its business logic) stays unit-testable with zero external
/// dependencies.
/// </summary>
public class RegisterFreelancerService(IKycVerificationService kyc, string aadhaarHashPepper)
{
    public async Task<RegisterFreelancerResult> RegisterAsync(RegisterFreelancerRequest request, CancellationToken ct = default)
    {
        var errors = new List<FieldError>();

        var panOutcome = PanValidator.Validate(request.PanNumber);
        if (!panOutcome.IsValid) errors.Add(new FieldError("panNumber", panOutcome.Reason!));

        var aadhaarOutcome = AadhaarValidator.Validate(request.AadhaarNumber);
        if (!aadhaarOutcome.IsValid) errors.Add(new FieldError("aadhaarNumber", aadhaarOutcome.Reason!));

        if (string.IsNullOrWhiteSpace(request.DisplayName)) errors.Add(new FieldError("displayName", "Display name is required."));
        if (string.IsNullOrWhiteSpace(request.PrimaryRole)) errors.Add(new FieldError("primaryRole", "Primary role is required."));
        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains('@')) errors.Add(new FieldError("email", "A valid email is required."));

        if (errors.Count > 0)
        {
            throw new RegistrationValidationException(errors);
        }

        var normalizedPan = PanValidator.Normalize(request.PanNumber);
        var normalizedAadhaar = AadhaarValidator.Normalize(request.AadhaarNumber);

        var user = new User
        {
            Email = request.Email.Trim().ToLowerInvariant(),
            PasswordHash = request.PasswordHash,
            Role = UserRole.Freelancer,
        };

        var profile = new FreelancerProfile
        {
            UserId = user.Id,
            DisplayName = request.DisplayName.Trim(),
            PrimaryRole = request.PrimaryRole.Trim(),
            PanNumber = normalizedPan,
            AadhaarLast4 = AadhaarValidator.Last4(normalizedAadhaar),
            AadhaarHash = AadhaarValidator.Hash(normalizedAadhaar, aadhaarHashPepper),
            EpfUanLast4 = string.IsNullOrWhiteSpace(request.EpfUan) ? null : request.EpfUan.Trim()[^4..],
        };

        var checks = new List<VerificationCheck>();

        var panResult = await kyc.VerifyPanAsync(normalizedPan, request.DisplayName, ct);
        profile.PanVerificationResult = ToResult(panResult);
        profile.PanVerifiedAt = DateTime.UtcNow;
        profile.PanVerificationReference = panResult.PartnerReference;
        checks.Add(NewCheck(user.Id, VerificationStage.IdentityKycPan, panResult));

        var aadhaarResult = await kyc.VerifyAadhaarAsync(normalizedAadhaar, request.DisplayName, ct);
        profile.AadhaarVerificationResult = ToResult(aadhaarResult);
        profile.AadhaarVerifiedAt = DateTime.UtcNow;
        profile.AadhaarVerificationReference = aadhaarResult.PartnerReference;
        checks.Add(NewCheck(user.Id, VerificationStage.IdentityKycAadhaar, aadhaarResult));

        if (!string.IsNullOrWhiteSpace(request.EpfUan))
        {
            var epfResult = await kyc.CheckEpfActiveStatusAsync(request.EpfUan.Trim(), ct);
            profile.EpfActiveStatusResult = ToResult(epfResult);
            profile.EpfCheckedAt = DateTime.UtcNow;
            profile.EpfVerificationReference = epfResult.PartnerReference;
            checks.Add(NewCheck(user.Id, VerificationStage.EmploymentStatusEpf, epfResult));
        }

        return new RegisterFreelancerResult(user, profile, checks);
    }

    private static VerificationResult ToResult(KycCheckOutcome outcome) =>
        outcome switch
        {
            { Eligible: true } => VerificationResult.Eligible,
            { RequiresHumanReview: true } => VerificationResult.NeedsReview,
            _ => VerificationResult.Ineligible,
        };

    private static VerificationCheck NewCheck(Guid userId, VerificationStage stage, KycCheckOutcome outcome) => new()
    {
        UserId = userId,
        Stage = stage,
        Result = ToResult(outcome),
        PartnerReference = outcome.PartnerReference,
        CheckedAt = DateTime.UtcNow,
        RequiresHumanReview = outcome.RequiresHumanReview,
    };
}
