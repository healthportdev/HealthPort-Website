/**
 * Build-time feature flags for content the client has asked us to hide
 * temporarily. Kept as plain booleans (not env vars) so the switch is
 * visible in source; flip and redeploy to bring a section back.
 */

// Standards / licences block on the About page. Hidden per stakeholder
// review until compliance guidelines are formalised. Flip to `true` once
// the updated cert list lands.
export const SHOW_STANDARDS = false;

// Impact Report — public Canva link (per Sage, 2026-09-28). Set to the
// Canva view URL to expose the "View impact report" button on the
// For Partners page. `null` hides the button entirely. The button
// opens in a new tab (target="_blank").
export const IMPACT_REPORT_URL: string | null = null;
