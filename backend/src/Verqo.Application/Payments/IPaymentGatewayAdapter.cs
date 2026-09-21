using Verqo.Domain.Enums;

namespace Verqo.Application.Payments;

/// <summary>
/// Gateway abstraction layer. Application code should only ever talk to
/// THIS interface, never a specific provider's SDK directly — keeps
/// "Razorpay vs. Cashfree" (still an open decision) swappable.
///
/// Escrow + payment gateway integration is explicitly deferred to v2a per
/// this rebuild's scope — <see cref="MockPaymentGatewayAdapter"/> is the
/// only implementation wired in for v2 / this rebuild.
/// </summary>
public interface IPaymentGatewayAdapter
{
    Task<GatewayResult> CollectIntoEscrowAsync(string milestoneId, int amountMinor, string idempotencyKey, CancellationToken ct = default);

    Task<GatewayReleaseResult> ReleaseFromEscrowAsync(
        string milestoneId, int freelancerPayoutMinor, int verqoFeeMinor, PayoutRail preferredRail, string idempotencyKey, CancellationToken ct = default);

    Task<GatewayResult> RefundFromEscrowAsync(string milestoneId, int amountMinor, string idempotencyKey, CancellationToken ct = default);
}

public record GatewayResult(string GatewayReference);
public record GatewayReleaseResult(string GatewayReference, PayoutRail Rail);
