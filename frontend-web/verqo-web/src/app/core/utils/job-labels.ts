/**
 * The Jobs API currently serializes enum fields (Channel, Status) as raw
 * integers — Verqo.Api.Controllers.JobsController doesn't call .ToString()
 * on them the way FreelancersController does for verification statuses. We
 * accept either a number or a string here so the UI reads correctly today
 * and keeps working if the backend later adds a string enum converter.
 */
const CHANNEL_LABELS: Record<string, string> = {
  '0': 'B2B',
  '1': 'B2C',
  B2B: 'B2B',
  B2C: 'B2C',
};

const JOB_STATUS_LABELS: Record<string, string> = {
  '0': 'Open',
  '1': 'Shortlisting',
  '2': 'Hired',
  '3': 'Closed',
  Open: 'Open',
  Shortlisting: 'Shortlisting',
  Hired: 'Hired',
  Closed: 'Closed',
};

export function channelLabel(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '';
  return CHANNEL_LABELS[String(value)] ?? String(value);
}

export function jobStatusLabel(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '';
  return JOB_STATUS_LABELS[String(value)] ?? String(value);
}

/** Budget fields are minor units (paise). Formats a whole-rupee INR range. */
export function formatBudgetRange(
  minMinor?: number | null,
  maxMinor?: number | null,
): string | null {
  const fmt = (minor: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(minor / 100);

  if (minMinor != null && maxMinor != null && minMinor !== maxMinor) {
    return `${fmt(minMinor)} – ${fmt(maxMinor)}`;
  }
  if (minMinor != null) return fmt(minMinor);
  if (maxMinor != null) return fmt(maxMinor);
  return null;
}
