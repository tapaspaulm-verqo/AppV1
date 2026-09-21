using Verqo.Domain.Enums;

namespace Verqo.Domain.Entities;

public class Message
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ContractId { get; set; }
    public Guid SenderId { get; set; }
    public required string Body { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ContractId { get; set; }
    public Guid AuthorId { get; set; }
    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Dispute
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MilestoneId { get; set; }
    public Milestone? Milestone { get; set; }
    public Guid RaisedById { get; set; }
    public required string Reason { get; set; }
    public DateTime EvidenceDeadline { get; set; }
    public DateTime DecisionDeadline { get; set; }
    public DisputeOutcome? Outcome { get; set; }
    public DateTime? DecidedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
