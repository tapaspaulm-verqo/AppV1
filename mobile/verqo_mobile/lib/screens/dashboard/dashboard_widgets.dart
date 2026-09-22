import 'package:flutter/material.dart';
import '../../services/api_client.dart';
import '../../theme/verqo_theme.dart';
import '../../utils/money.dart';

/// Shared building blocks for FreelancerDashboardScreen and
/// ClientDashboardScreen — the two screens show almost entirely different
/// data (see DashboardController's doc comment for why they're separate
/// endpoints/screens rather than one generic dashboard), but the visual
/// vocabulary — stat cards, a contract's milestone list, state pills — is
/// identical, just recolored per persona (accent green vs client plum),
/// mirroring the Angular web app's shared `.stat-card`/`.milestone-row`
/// CSS classes.
class StatCard extends StatelessWidget {
  final String label;
  final String value;
  final Color accent;
  const StatCard({super.key, required this.label, required this.value, required this.accent});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: VerqoColors.surface200,
        borderRadius: BorderRadius.circular(VerqoRadius.lg),
        border: Border(left: BorderSide(color: accent, width: 3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(label.toUpperCase(),
              style: const TextStyle(fontSize: 11, letterSpacing: 0.4, color: VerqoColors.inkSecondary, fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(value, style: const TextStyle(fontFamily: 'monospace', fontSize: 20, fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }
}

class StatusBadge extends StatelessWidget {
  final String label;
  const StatusBadge({super.key, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: VerqoColors.surface100, borderRadius: BorderRadius.circular(VerqoRadius.full)),
      child: Text(label, style: const TextStyle(fontSize: 11, color: VerqoColors.inkSecondary)),
    );
  }
}

/// One milestone row inside a ContractCard. Which action button (if any)
/// shows is driven entirely by `milestone.state` — Freelancer screens pass
/// [onStart]/[onSubmit], Client screens pass [onFund]; a null callback for
/// a state that would otherwise show a button just shows no button, so one
/// widget serves both personas without a persona flag.
class MilestoneRow extends StatelessWidget {
  final MilestoneSummary milestone;
  final String? acting;
  final ValueChanged<String>? onStart;
  final ValueChanged<String>? onSubmit;
  final ValueChanged<String>? onFund;
  final Color actionAccent;

  const MilestoneRow({
    super.key,
    required this.milestone,
    required this.acting,
    required this.actionAccent,
    this.onStart,
    this.onSubmit,
    this.onFund,
  });

  @override
  Widget build(BuildContext context) {
    final style = MilestoneStateStyle.of(milestone.state);
    final isActing = acting == milestone.id;
    final buttonStyle = ElevatedButton.styleFrom(backgroundColor: actionAccent, foregroundColor: Colors.white);

    Widget? action;
    if (milestone.state == 'Funded' && onStart != null) {
      action = ElevatedButton(
        style: buttonStyle,
        onPressed: isActing ? null : () => onStart!(milestone.id),
        child: Text(isActing ? 'Starting…' : 'Start work'),
      );
    } else if (milestone.state == 'InProgress' && onSubmit != null) {
      action = ElevatedButton(
        style: buttonStyle,
        onPressed: isActing ? null : () => onSubmit!(milestone.id),
        child: Text(isActing ? 'Submitting…' : 'Submit for review'),
      );
    } else if (milestone.state == 'Unfunded' && onFund != null) {
      action = ElevatedButton(
        style: buttonStyle,
        onPressed: isActing ? null : () => onFund!(milestone.id),
        child: Text(isActing ? 'Funding…' : 'Fund escrow'),
      );
    } else if (milestone.state == 'Submitted' && milestone.reviewDeadlineAt != null) {
      action = Text('Review by ${formatShortDate(milestone.reviewDeadlineAt)}',
          style: const TextStyle(color: VerqoColors.inkSecondary, fontSize: 12));
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(milestone.title, style: const TextStyle(fontWeight: FontWeight.w600)),
                    Text(Money.formatMinor(milestone.contractValueMinor),
                        style: const TextStyle(fontFamily: 'monospace', fontSize: 13)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(color: style.background, borderRadius: BorderRadius.circular(VerqoRadius.full)),
                child: Text(style.label, style: TextStyle(color: style.foreground, fontSize: 11, fontWeight: FontWeight.w600)),
              ),
            ],
          ),
          if (action != null) ...[
            const SizedBox(height: 8),
            Align(alignment: Alignment.centerRight, child: action),
          ],
        ],
      ),
    );
  }
}

class ContractCard extends StatelessWidget {
  final ContractSummary contract;
  final Color accent;
  final String? acting;
  final ValueChanged<String>? onStart;
  final ValueChanged<String>? onSubmit;
  final ValueChanged<String>? onFund;

  const ContractCard({
    super.key,
    required this.contract,
    required this.accent,
    required this.acting,
    this.onStart,
    this.onSubmit,
    this.onFund,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: VerqoColors.surface200,
        borderRadius: BorderRadius.circular(VerqoRadius.lg),
        border: Border(left: BorderSide(color: accent, width: 3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(contract.jobTitle ?? contract.scopeSummary, style: Theme.of(context).textTheme.titleLarge),
                    Text(contract.counterpartyName, style: const TextStyle(color: VerqoColors.inkSecondary)),
                  ],
                ),
              ),
              StatusBadge(label: contract.status),
            ],
          ),
          const Divider(height: 24),
          for (final m in contract.milestones)
            MilestoneRow(milestone: m, acting: acting, actionAccent: accent, onStart: onStart, onSubmit: onSubmit, onFund: onFund),
        ],
      ),
    );
  }
}

/// Fixed literal tint, not a runtime `.withOpacity()`/`.withValues()` call
/// — see MilestoneStateStyle's doc comment in utils/money.dart for why.
class VerifiedPill extends StatelessWidget {
  final bool verified;
  const VerifiedPill({super.key, required this.verified});

  @override
  Widget build(BuildContext context) {
    final foreground = verified ? VerqoColors.accent : VerqoColors.warning;
    final background = verified ? const Color(0xFFE3EEE8) : const Color(0xFFF7EBD3);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(VerqoRadius.full)),
      child: Text(
        verified ? 'Verified' : 'Verification pending',
        style: TextStyle(color: foreground, fontSize: 12, fontWeight: FontWeight.w600),
      ),
    );
  }
}
