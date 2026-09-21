namespace Verqo.Domain.Enums;

public enum UserRole
{
    Freelancer,
    Client,
    Admin
}

/// <summary>
/// One verification stage per user. Staged deliberately (cheap checks
/// first). IdentityKyc now covers PAN + Aadhaar (format + checksum, then a
/// licensed KYC vendor call once one is contracted — see
/// IKycVerificationService). EmploymentStatus is the EPFO "active member"
/// check requested for this rebuild.
/// </summary>
public enum VerificationStage
{
    IdentityKycPan,
    IdentityKycAadhaar,
    BankAccount,
    ProfileSkills,
    EmploymentStatusEpf
}

public enum VerificationResult
{
    Pending,
    Eligible,
    Ineligible,
    NeedsReview
}

public enum RateBand
{
    Band1Premium,
    Band2Core,
    Band3Standard
}

public enum ExperienceLevel
{
    Junior,
    Mid,
    Senior,
    Expert
}

public enum ClientPlan
{
    Standard,
    BusinessPlus
}

public enum EngagementChannel
{
    B2B,
    B2C
}

public enum JobStatus
{
    Open,
    Shortlisting,
    Hired,
    Closed
}

public enum ProposalStatus
{
    Submitted,
    Shortlisted,
    Accepted,
    Rejected,
    Withdrawn
}

public enum ContractStatus
{
    Active,
    Completed,
    Ended
}

/// <summary>
/// See Verqo.Application.Payments.MilestoneStateMachine for the transition
/// rules — never write to Milestone.State without going through it.
/// </summary>
public enum MilestoneState
{
    Unfunded,
    Funded,
    InProgress,
    Submitted,
    ApprovedReleased,
    Disputed,
    RefundedCancelled
}

/// <summary>
/// Payments/escrow entities and adapter stay in the domain/application model
/// now, but the real gateway integration is out of scope until v2a — see
/// Verqo.Application.Payments.IPaymentGatewayAdapter and
/// MockPaymentGatewayAdapter.
/// </summary>
public enum LedgerEntryType
{
    EscrowFund,
    EscrowHold,
    FreelancerPayout,
    ClientFee,
    FreelancerFee,
    Refund,
    Reversal
}

public enum PayoutRail
{
    Upi,
    Imps,
    Neft
}

public enum PayoutStatus
{
    Initiated,
    Processing,
    Success,
    Failed,
    Returned
}

public enum DisputeOutcome
{
    ReleaseFull,
    ReleasePartial,
    RefundFull,
    RevisionRequired
}
