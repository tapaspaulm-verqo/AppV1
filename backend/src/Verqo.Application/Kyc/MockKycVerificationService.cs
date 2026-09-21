namespace Verqo.Application.Kyc;

/// <summary>
/// MVP stand-in for <see cref="IKycVerificationService"/> — runs the real
/// offline checks (format + checksum) and then simulates a vendor response.
/// Deterministic and side-effect-free so it's safe in tests and demos. Swap
/// for a real adapter once a KYC vendor is contracted (see interface docs);
/// no caller changes required, same as the payment gateway pattern.
/// </summary>
public class MockKycVerificationService : IKycVerificationService
{
    public Task<KycCheckOutcome> VerifyPanAsync(string panNumber, string fullNameOnFile, CancellationToken ct = default)
    {
        var format = PanValidator.Validate(panNumber);
        if (!format.IsValid)
        {
            return Task.FromResult(new KycCheckOutcome(false, false, null, format.Reason));
        }

        return Task.FromResult(new KycCheckOutcome(
            Eligible: true,
            RequiresHumanReview: false,
            PartnerReference: $"mock_pan_{Guid.NewGuid():N}",
            Reason: "Format and holder-type code valid (mock vendor response — no live Income Tax Dept. check performed)."));
    }

    public Task<KycCheckOutcome> VerifyAadhaarAsync(string aadhaarNumber, string fullNameOnFile, CancellationToken ct = default)
    {
        var format = AadhaarValidator.Validate(aadhaarNumber);
        if (!format.IsValid)
        {
            return Task.FromResult(new KycCheckOutcome(false, false, null, format.Reason));
        }

        return Task.FromResult(new KycCheckOutcome(
            Eligible: true,
            RequiresHumanReview: false,
            PartnerReference: $"mock_aadhaar_{Guid.NewGuid():N}",
            Reason: "Format and Verhoeff checksum valid (mock vendor response — no live UIDAI e-KYC performed)."));
    }

    public Task<KycCheckOutcome> CheckEpfActiveStatusAsync(string uan, CancellationToken ct = default)
    {
        var digitsOnly = uan.Trim();
        if (digitsOnly.Length != 12 || !digitsOnly.All(char.IsDigit))
        {
            return Task.FromResult(new KycCheckOutcome(false, false, null, "UAN must be exactly 12 digits."));
        }

        // No public EPFO "is this UAN active" API exists — see interface docs.
        // Mock always returns NeedsReview so a human checks the freelancer's
        // own EPFO passbook screenshot/UAN card until a real partner is wired in.
        return Task.FromResult(new KycCheckOutcome(
            Eligible: false,
            RequiresHumanReview: true,
            PartnerReference: $"mock_epf_{Guid.NewGuid():N}",
            Reason: "EPFO has no public active-member API; routed for manual review (mock vendor response)."));
    }
}
