namespace Verqo.Application.Kyc;

/// <summary>
/// Abstraction over the licensed KYC vendor calls Verqo does not (yet) have
/// a contract for. Mirrors the same pattern as
/// Verqo.Application.Payments.IPaymentGatewayAdapter: application code only
/// ever talks to this interface, never a vendor SDK directly, so the vendor
/// decision stays swappable.
///
/// Real integrations this stands in for, and why they're not wired up here:
///  - PAN: the Income Tax Department's "Verify PAN" API, reached via a
///    registered ERI/agency such as Protean (formerly NSDL e-Gov) or the
///    e-Filing portal's API — requires a signed agreement and production
///    credentials Verqo does not hold in this environment.
///  - Aadhaar: UIDAI's Aadhaar Paperless Offline e-KYC or the e-KYC
///    "Yes/No" API, both restricted to authorised AUA/KUA entities (or a
///    licensed aggregator like an authorised e-KYC/KYC-as-a-service
///    provider). Verqo is not an AUA/KUA.
///  - EPF: EPFO does not expose a public "is this UAN active" API; member
///    passbook data is reachable only via the member's own OTP-authenticated
///    session on the EPFO portal, or via an authorised aggregator (e.g.
///    under the RBI Account Aggregator framework, several of which cover
///    EPFO). Either path needs a signed partner agreement.
///
/// Until one is contracted, <see cref="MockKycVerificationService"/> is
/// wired in — it does the real offline checks (PAN format, Aadhaar
/// format+checksum) and then simulates the vendor call. This is an explicit
/// open vendor decision, the same class of decision the payment gateway
/// (v2a) already carries.
/// </summary>
public interface IKycVerificationService
{
    Task<KycCheckOutcome> VerifyPanAsync(string panNumber, string fullNameOnFile, CancellationToken ct = default);

    Task<KycCheckOutcome> VerifyAadhaarAsync(string aadhaarNumber, string fullNameOnFile, CancellationToken ct = default);

    /// <summary>UAN active-member check. <paramref name="uan"/> is the freelancer's Universal Account Number.</summary>
    Task<KycCheckOutcome> CheckEpfActiveStatusAsync(string uan, CancellationToken ct = default);
}

public record KycCheckOutcome(
    bool Eligible,
    bool RequiresHumanReview,
    string? PartnerReference,
    string? Reason);
