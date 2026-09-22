import 'package:flutter/material.dart';
import '../theme/verqo_theme.dart';

/// Money and milestone-state formatting shared across the Jobs list and the
/// Freelancer/Client dashboards. Kept dependency-free (no `intl`) — same
/// choice already made in jobs_screen.dart, just hoisted here so it isn't
/// duplicated per-screen. Mirrors the Angular web app's
/// `core/utils/money.ts` (same rupee grouping, same milestone-state labels).
class Money {
  /// Amounts everywhere in the API are minor units (paise) — see
  /// Verqo.Application.Common.BusinessRules. Deliberately plain Western
  /// thousands grouping, not lakh/crore grouping — an honest approximation
  /// rather than a half-right locale-specific one (same note as
  /// jobs_screen.dart's original `_formatRupees`).
  static String formatMinor(int minor) {
    final rupees = (minor / 100).round();
    final negative = rupees < 0;
    final digits = rupees.abs().toString();
    final buffer = StringBuffer();
    for (var i = 0; i < digits.length; i++) {
      final remaining = digits.length - i;
      buffer.write(digits[i]);
      if (remaining > 1 && (remaining - 1) % 3 == 0) buffer.write(',');
    }
    return '${negative ? '-' : ''}₹$buffer';
  }
}

/// `MilestoneState` (Verqo.Domain.Enums), as it arrives serialized to a
/// string on every contracts/dashboard payload — see
/// Verqo.Application.Common.BusinessRules.AssertValidTransition for the
/// transitions these labels/colors describe.
///
/// `background` is a fixed pale-tint literal rather than a runtime
/// `foreground.withOpacity()`/`.withValues()` call — both APIs have moved
/// under Flutter over the last few releases and neither could be checked
/// against a real SDK in this sandbox (see mobile/verqo_mobile/README.md
/// and the same choice already made in client_signup_screen.dart's
/// `_KycRow`), so a plain literal color per state sidesteps the question.
class MilestoneStateStyle {
  final String label;
  final Color foreground;
  final Color background;
  const MilestoneStateStyle(this.label, this.foreground, this.background);

  static MilestoneStateStyle of(String state) {
    switch (state) {
      case 'Unfunded':
        return const MilestoneStateStyle('Awaiting funding', VerqoColors.inkSecondary, Color(0xFFEDEBE6));
      case 'Funded':
        return const MilestoneStateStyle('Funded', VerqoColors.accent, Color(0xFFE3EEE8));
      case 'InProgress':
        return const MilestoneStateStyle('In progress', VerqoColors.warning, Color(0xFFF7EBD3));
      case 'Submitted':
        return const MilestoneStateStyle('Submitted for review', VerqoColors.warning, Color(0xFFF7EBD3));
      case 'ApprovedReleased':
        return const MilestoneStateStyle('Released', VerqoColors.accent, Color(0xFFE3EEE8));
      case 'Disputed':
        return const MilestoneStateStyle('Disputed', VerqoColors.danger, Color(0xFFF6E1DE));
      case 'RefundedCancelled':
        return const MilestoneStateStyle('Refunded / cancelled', VerqoColors.danger, Color(0xFFF6E1DE));
      default:
        return MilestoneStateStyle(state, VerqoColors.inkSecondary, const Color(0xFFEDEBE6));
    }
  }
}

/// Short, human date for review deadlines etc. — "25 Sept 2026". No `intl`
/// dependency, same rationale as Money.formatMinor above.
String formatShortDate(String? isoDate) {
  if (isoDate == null) return '';
  final date = DateTime.tryParse(isoDate);
  if (date == null) return '';
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return '${date.day} ${months[date.month - 1]} ${date.year}';
}
