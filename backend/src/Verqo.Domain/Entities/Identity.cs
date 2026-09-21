using Verqo.Domain.Enums;

namespace Verqo.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public FreelancerProfile? FreelancerProfile { get; set; }
    public ClientProfile? ClientProfile { get; set; }
    public List<VerificationCheck> VerificationChecks { get; set; } = new();
}

/// <summary>
/// One row per verification stage per user (PAN, Aadhaar, bank account,
/// profile/skills, EPF employment status). <see cref="PartnerReference"/>
/// holds the licensed KYC vendor's reference id once one is wired in — see
/// Verqo.Application.Kyc.IKycVerificationService. Never stores raw
/// government-ID numbers or PF contribution history here (Verqo's Privacy
/// Policy §4.3 equivalent) — those live, minimised, on FreelancerProfile.
/// </summary>
public class VerificationCheck
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public VerificationStage Stage { get; set; }
    public VerificationResult Result { get; set; } = VerificationResult.Pending;
    public string? PartnerReference { get; set; }
    public DateTime? CheckedAt { get; set; }
    public bool RequiresHumanReview { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
