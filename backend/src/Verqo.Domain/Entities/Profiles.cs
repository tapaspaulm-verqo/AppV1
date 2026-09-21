using Verqo.Domain.Enums;

namespace Verqo.Domain.Entities;

/// <summary>
/// PAN/Aadhaar/EPF fields added for this rebuild (business requirement:
/// freelancer registration must capture PAN and Aadhaar with automatic
/// validation, plus an active-EPF-account check).
///
/// Storage choices are deliberate, not incidental:
///  - PanNumber is stored as-is: PAN is routinely shown/shared (it's on
///    invoices, Form 16, etc.) and has no special storage restriction.
///  - Aadhaar is NEVER stored in full. The Aadhaar Act, 2016 (s.29) and
///    UIDAI regulations restrict who may store Aadhaar numbers at all —
///    doing so requires UIDAI AUA/KUA authorisation. Verqo is not (yet) an
///    AUA/KUA, so only the last 4 digits (for UI display, matching the
///    masked-Aadhaar convention UIDAI itself uses) and a salted SHA-256
///    hash (for duplicate-account detection) are persisted. The full
///    number is validated in memory at submission time and discarded.
///  - EPF: only the verification *result* and the licensed partner's
///    reference id are stored, never UAN contribution history.
/// </summary>
public class FreelancerProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public required string DisplayName { get; set; }
    public string? Headline { get; set; }
    public string? Bio { get; set; }
    public required string PrimaryRole { get; set; }
    public RateBand? RateBand { get; set; }
    public ExperienceLevel? ExperienceLevel { get; set; }
    public int? HourlyRateMinor { get; set; }

    // --- PAN ---
    public required string PanNumber { get; set; } // format AAAAA9999A, upper-cased
    public VerificationResult PanVerificationResult { get; set; } = VerificationResult.Pending;
    public DateTime? PanVerifiedAt { get; set; }
    public string? PanVerificationReference { get; set; }

    // --- Aadhaar (masked/hashed only — see class remarks) ---
    public required string AadhaarLast4 { get; set; }
    public required string AadhaarHash { get; set; } // salted SHA-256 of the full 12-digit number
    public VerificationResult AadhaarVerificationResult { get; set; } = VerificationResult.Pending;
    public DateTime? AadhaarVerifiedAt { get; set; }
    public string? AadhaarVerificationReference { get; set; }

    // --- EPF (EPFO active-member check) ---
    public string? EpfUanLast4 { get; set; } // optional at signup; UAN is 12 digits, same masking policy as Aadhaar
    public VerificationResult EpfActiveStatusResult { get; set; } = VerificationResult.Pending;
    public DateTime? EpfCheckedAt { get; set; }
    public string? EpfVerificationReference { get; set; }

    public DateTime? BankAccountVerifiedAt { get; set; }
    public DateTime? BankDetailChangedAt { get; set; } // drives the 48h payout cooling-off period

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<Proposal> Proposals { get; set; } = new();
    public List<Contract> Contracts { get; set; } = new();

    /// <summary>True once every stage required before the freelancer can browse/apply has passed.</summary>
    public bool IsFullyVerified =>
        PanVerificationResult == VerificationResult.Eligible &&
        AadhaarVerificationResult == VerificationResult.Eligible;
}

public class ClientProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public required string CompanyName { get; set; }
    public string? Gstin { get; set; }
    public ClientPlan Plan { get; set; } = ClientPlan.Standard;
    public double? NegotiatedFeeRate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<Job> Jobs { get; set; } = new();
    public List<Contract> Contracts { get; set; } = new();
}
