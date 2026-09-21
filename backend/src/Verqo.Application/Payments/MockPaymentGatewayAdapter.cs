using Verqo.Domain.Enums;

namespace Verqo.Application.Payments;

/// <summary>
/// Version 2a scope, per this rebuild's brief: dummy payment gateway and
/// escrow account integration only. Always "succeeds" so the escrow state
/// machine and ledger correctness can be exercised without real gateway
/// credentials. Not a substitute for a real gateway pilot before launch.
/// </summary>
public class MockPaymentGatewayAdapter : IPaymentGatewayAdapter
{
    public Task<GatewayResult> CollectIntoEscrowAsync(string milestoneId, int amountMinor, string idempotencyKey, CancellationToken ct = default) =>
        Task.FromResult(new GatewayResult($"mock_collect_{Guid.NewGuid():N}"));

    public Task<GatewayReleaseResult> ReleaseFromEscrowAsync(
        string milestoneId, int freelancerPayoutMinor, int verqoFeeMinor, PayoutRail preferredRail, string idempotencyKey, CancellationToken ct = default) =>
        Task.FromResult(new GatewayReleaseResult($"mock_release_{Guid.NewGuid():N}", preferredRail));

    public Task<GatewayResult> RefundFromEscrowAsync(string milestoneId, int amountMinor, string idempotencyKey, CancellationToken ct = default) =>
        Task.FromResult(new GatewayResult($"mock_refund_{Guid.NewGuid():N}"));
}
