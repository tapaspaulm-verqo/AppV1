using Verqo.Domain.Enums;

namespace Verqo.Domain.Entities;

public class Contract
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? JobId { get; set; }
    public Job? Job { get; set; }
    public Guid ClientId { get; set; }
    public ClientProfile? Client { get; set; }
    public Guid FreelancerId { get; set; }
    public FreelancerProfile? Freelancer { get; set; }
    public EngagementChannel Channel { get; set; } = EngagementChannel.B2C;
    public required string ScopeSummary { get; set; }
    public ContractStatus Status { get; set; } = ContractStatus.Active;
    public DateTime IntroducedAt { get; set; } = DateTime.UtcNow; // starts the 12-month non-circumvention clock
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<Milestone> Milestones { get; set; } = new();
}

/// <summary>
/// See Verqo.Application.Payments.MilestoneStateMachine for the transition
/// rules that govern <see cref="State"/> — never write to it directly.
/// </summary>
public class Milestone
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ContractId { get; set; }
    public Contract? Contract { get; set; }
    public required string Title { get; set; }
    public int ContractValueMinor { get; set; }
    public MilestoneState State { get; set; } = MilestoneState.Unfunded;
    public int ReviewWindowDays { get; set; } = 5;
    public int RevisionsAllowed { get; set; } = 2;
    public int RevisionsUsed { get; set; }
    public DateTime? FundedAt { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public DateTime? ReviewDeadlineAt { get; set; }
    public DateTime? ReleasedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<LedgerEntry> LedgerEntries { get; set; } = new();
    public Dispute? Dispute { get; set; }
    public Invoice? Invoice { get; set; }
}
