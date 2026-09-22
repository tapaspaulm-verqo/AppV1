/** Every money field in the API is minor units (paise) — this is the one place that formats them for display. */
export function formatMinor(minor: number | null | undefined): string {
  if (minor == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(minor / 100);
}

/**
 * Milestone.State values from Verqo.Domain.Enums.MilestoneState, mapped to
 * the .status-pill modifier classes already defined in styles.css for
 * exactly these meanings (verified/funded/released green,
 * pending/review amber, failed/expired/cancelled red).
 */
const MILESTONE_STATE_PILL: Record<string, string> = {
  Unfunded: 'status-pill--pending',
  Funded: 'status-pill--funded',
  InProgress: 'status-pill--review',
  Submitted: 'status-pill--review',
  ApprovedReleased: 'status-pill--released',
  Disputed: 'status-pill--failed',
  RefundedCancelled: 'status-pill--cancelled',
};

const MILESTONE_STATE_LABEL: Record<string, string> = {
  Unfunded: 'Awaiting funding',
  Funded: 'Funded',
  InProgress: 'In progress',
  Submitted: 'Submitted for review',
  ApprovedReleased: 'Released',
  Disputed: 'Disputed',
  RefundedCancelled: 'Refunded',
};

export function milestoneStatePillClass(state: string): string {
  return MILESTONE_STATE_PILL[state] ?? '';
}

export function milestoneStateLabel(state: string): string {
  return MILESTONE_STATE_LABEL[state] ?? state;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}
