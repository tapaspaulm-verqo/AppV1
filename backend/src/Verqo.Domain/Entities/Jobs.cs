using Verqo.Domain.Enums;

namespace Verqo.Domain.Entities;

public class Job
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ClientId { get; set; }
    public ClientProfile? Client { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public EngagementChannel Channel { get; set; } = EngagementChannel.B2C;
    public required string RoleCategory { get; set; }
    public int? BudgetMinorMin { get; set; }
    public int? BudgetMinorMax { get; set; }
    public JobStatus Status { get; set; } = JobStatus.Open;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<Proposal> Proposals { get; set; } = new();
    public List<Contract> Contracts { get; set; } = new();
}

public class Proposal
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid JobId { get; set; }
    public Job? Job { get; set; }
    public Guid FreelancerId { get; set; }
    public FreelancerProfile? Freelancer { get; set; }
    public required string CoverNote { get; set; }
    public int ProposedRateMinor { get; set; }
    public ProposalStatus Status { get; set; } = ProposalStatus.Submitted;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
