// Privacy-light funnel events (PIPELINE.md §10). Fire-and-forget beacons that
// tell us whether a delivered plan is actually being worked: opened, which tabs,
// CSV uploaded, CV issues fixed, templates copied, statuses set. NO names, NO
// contact data, NO CV content; only the slug, the event name, and tiny metadata.
// Events land as one-line JSON in the server logs (see /api/track).

export type TrackEvent =
  | 'plan_opened'
  | 'tab_visited'
  | 'csv_uploaded'
  | 'cv_issue_fixed'
  | 'cert_toggled'
  | 'outreach_status'
  | 'template_copied';

export function track(slug: string, event: TrackEvent, meta?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;
  try {
    const body = JSON.stringify({ slug, event, ...(meta ?? {}) });
    // sendBeacon survives tab closes; keepalive fetch is the fallback.
    if (navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }))) return;
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
  } catch {
    /* analytics must never break the product */
  }
}
