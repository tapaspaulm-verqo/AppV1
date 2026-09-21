using Verqo.Domain.Enums;

namespace Verqo.Domain.Entities;

/// <summary>
/// Append-only, double-entry ledger. NEVER update or delete a row from this
/// table at the application layer — a correction is always a new Reversal
/// entry referencing the entry it offsets. <see cref="IdempotencyKey"/>
/// prevents a retried instruction from double-paying. The real gateway
/// behind this (Razorpay/Cashfree or similar) is deferred to v2a — see
/// Verqo.Application.Payments.MockPaymentGatewayAdapter.
/// </summary>
public class LedgerEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MilestoneId { get; set; }
    public Milestone? Milestone { get; set; }
    public LedgerEntryType Type { get; set; }
    public int AmountMinor { get; set; } // always positive; direction implied by Type
    public string Currency { get; set; } = "INR";
    public required string IdempotencyKey { get; set; }
    public Guid? ReversesEntryId { get; set; }
    public string? GatewayReference { get; set; } // UTR / gateway txn id once wired to a real gateway (v2a)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Payout
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MilestoneId { get; set; }
    public PayoutRail Rail { get; set; }
    public PayoutStatus Status { get; set; } = PayoutStatus.Initiated;
    public int AmountMinor { get; set; }
    public string? Utr { get; set; }
    public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SettledAt { get; set; }
}

public class Invoice
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MilestoneId { get; set; }
    public Milestone? Milestone { get; set; }
    public required string InvoiceNumber { get; set; }
    public int GstAmountMinor { get; set; }
    public int TotalMinor { get; set; }
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
}
