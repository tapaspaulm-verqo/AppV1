using Verqo.Domain.Enums;

namespace Verqo.Application.Common;

/// <summary>
/// Verqo business rules, encoded as configuration rather than scattered
/// literals — ported 1:1 from the original packages/shared/business-rules.ts
/// so the fee math and milestone state machine keep the exact same
/// behaviour across the rebuild. All figures are the founder's planning
/// assumptions pending CA/legal sign-off; keep swappable without a redeploy
/// (config/admin), not hardcoded, once this leaves the MVP stage.
/// </summary>
public static class BusinessRules
{
    /// <summary>Freelancer fee is fixed regardless of client plan.</summary>
    public const double FreelancerFeeRate = 0.05;

    public const double ClientFeeRateStandard = 0.10;
    public const double ClientFeeRateBusinessPlusFloor = 0.05;

    public const int DefaultReviewWindowDays = 5;
    public const int DefaultRevisionsAllowed = 2;
    public const int NonCircumventionMonths = 12;
    public const int BankDetailChangeCoolingOffHours = 48;
    public const int DisputeEvidenceWindowDays = 5;
    public const int DisputeDecisionWindowDays = 10;

    public static double ResolveClientFeeRate(ClientPlan plan, double? negotiatedRate)
    {
        if (plan == ClientPlan.Standard) return ClientFeeRateStandard;

        if (negotiatedRate is { } rate)
        {
            if (rate < ClientFeeRateBusinessPlusFloor || rate > ClientFeeRateStandard)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(negotiatedRate),
                    $"Business Plus rate must be between {ClientFeeRateBusinessPlusFloor} and {ClientFeeRateStandard}");
            }
            return rate;
        }

        return ClientFeeRateBusinessPlusFloor;
    }

    /// <summary>
    /// Single source of truth for fee calculation. Every money-touching code
    /// path (funding, invoicing, payout preview, reconciliation) must call
    /// this rather than recompute fees inline. All amounts are integer minor
    /// units (paise) to avoid floating-point error.
    /// </summary>
    public static FeeBreakdown CalculateFees(int contractValueMinor, ClientPlan clientPlan, double? negotiatedClientRate = null)
    {
        if (contractValueMinor <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(contractValueMinor), "contractValueMinor must be a positive integer (paise)");
        }

        var clientFeeRate = ResolveClientFeeRate(clientPlan, negotiatedClientRate);
        const double freelancerFeeRate = FreelancerFeeRate;

        var clientFeeMinor = (int)Math.Round(contractValueMinor * clientFeeRate, MidpointRounding.AwayFromZero);
        var freelancerFeeMinor = (int)Math.Round(contractValueMinor * freelancerFeeRate, MidpointRounding.AwayFromZero);

        return new FeeBreakdown(
            ContractValueMinor: contractValueMinor,
            ClientFeeMinor: clientFeeMinor,
            FreelancerFeeMinor: freelancerFeeMinor,
            ClientPaysTotalMinor: contractValueMinor + clientFeeMinor,
            FreelancerReceivesMinor: contractValueMinor - freelancerFeeMinor,
            VerqoGrossFeeMinor: clientFeeMinor + freelancerFeeMinor,
            ClientFeeRate: clientFeeRate,
            FreelancerFeeRate: freelancerFeeRate);
    }

    /// <summary>Milestone state machine. Never write Milestone.State without going through <see cref="AssertValidTransition"/>.</summary>
    private static readonly Dictionary<MilestoneState, MilestoneState[]> ValidTransitions = new()
    {
        [MilestoneState.Unfunded] = [MilestoneState.Funded],
        [MilestoneState.Funded] = [MilestoneState.InProgress, MilestoneState.Disputed, MilestoneState.RefundedCancelled],
        [MilestoneState.InProgress] = [MilestoneState.Submitted, MilestoneState.Disputed],
        [MilestoneState.Submitted] = [MilestoneState.ApprovedReleased, MilestoneState.Disputed, MilestoneState.InProgress],
        [MilestoneState.Disputed] = [MilestoneState.ApprovedReleased, MilestoneState.RefundedCancelled],
        [MilestoneState.ApprovedReleased] = [],
        [MilestoneState.RefundedCancelled] = [],
    };

    public static bool CanTransition(MilestoneState from, MilestoneState to) =>
        ValidTransitions[from].Contains(to);

    public static void AssertValidTransition(MilestoneState from, MilestoneState to)
    {
        if (!CanTransition(from, to))
        {
            throw new InvalidOperationException($"Invalid milestone transition: {from} -> {to}");
        }
    }
}

public record FeeBreakdown(
    int ContractValueMinor,
    int ClientFeeMinor,
    int FreelancerFeeMinor,
    int ClientPaysTotalMinor,
    int FreelancerReceivesMinor,
    int VerqoGrossFeeMinor,
    double ClientFeeRate,
    double FreelancerFeeRate);
