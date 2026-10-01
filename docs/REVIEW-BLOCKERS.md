# Website Review — Open Items for Stakeholder

Compiled from *HealthPort Africa — Website Review & Implementation Spec* (2026-09-26).
Updated 2026-09-29 with Sage's WhatsApp replies (2026-09-28 evening).
Items below block or shape the implementation. Everything else in the spec I can do
with what's in the repo today.

## Resolved since first pass (Sage, 2026-09-28)

- **Impact Report** — Canva link, coming shortly. Button retargeted to open in a new tab (was download). Drop URL into `IMPACT_REPORT_URL` in `src/lib/flags.ts` when link lands.
- **FAQ answers** — Sage is preparing JSON. Placeholder drafts in `src/components/oaas/FAQ.tsx` will be replaced when it arrives.
- **Brand rename** — no rename. Site stays "HealthPort". All "HealthPort Africa" changes reverted.
- **Careers inbox** — `careers@healthportafrica.com` (not `info@`). Client + server route maps updated.
- **Oxygen Access Gap** — reframed as last-mile delivery/access problem (per Sage: drop manifold/cylinder-decay technical framing).
- **Dr Olutekunbi** — title only, no credentials. Aisha to confirm exact wording. No live references in the current codebase.
- **Cargoplug + MIT KSC logos** — Sage shared a Drive folder; files still need to land in `/public/partners/` and the commented-out entries in `PartnerTypes.tsx` uncommented.

## 1. Assets we don't have

| # | Item | Where it lands | Notes |
|---|---|---|---|
| 1 | **Impact Report PDF** | For Partners → Impact section (download button) | Spec references "Reference Document: File" but no file attached. Need the actual PDF (or link) to host. |
| 2 | **On-site plant photography** | OaaS → Step 02 "We Design" card | Need real machinery / skid / facility-installation shots. Per brief, no stock substitute. |
| 3 | **OxyTrack UI dashboard screenshots** | OxyIntel/OxyTrack section | Spec says replace generic hardware graphics with "authentic OxyTrack user-interface dashboards and operational views". Need exports from the actual product. |
| 4 | **Leadership headshots** | About → Leadership | Uniform, high-resolution, professional. Spec names Francis and Dr. Aisha — please send the full list of who should appear plus a shot brief so the crop/lighting matches across cards. |
| 5 | **Cargoplug logo** | Partners section | SVG preferred (or high-res PNG on transparent background). |
| 6 | **MIT KSC logo** | Partners section | Same — SVG or transparent PNG. Also confirm the exact display name (MIT KSC vs. spelled out). |

## 2. Copy we need written

| # | Item | Notes |
|---|---|---|
| 7 | **FAQ answers** | Spec names the four topics: onboarding timelines, billing structures, maintenance SLA, emergency cylinder refills. We need the actual answers. Happy to draft first pass if you want a starting point. |
| 8 | **Telemetry monitoring points** | Spec says clarify whether sensors monitor central reticulation manifolds, storage manifolds, or bedside outlets. What's the accurate answer for public copy? |
| 9 | **Manifold line wear vs. terminal cylinder decay** | For the Oxygen Access Gap section — need one sentence per failure mode that's technically accurate. |
| 10 | **Reticulation / piping clarification line** | Spec supplies *"We can discuss specific piping and reticulation needs."* Where should this land — OaaS Step 02, Hospital Solutions, Contact, or all three? |

## 3. Facts to confirm before publishing

| # | Item | Notes |
|---|---|---|
| 11 | **Metric values are approved for public site** | Hospitals 10+, Litres 2.4M+, Patients 30,000+, Reliability 99%. Just want a "yes, ship these" before they go live. |
| 12 | **Dr. Olutekunbi — canonical spelling** | Spec flags the spelling needs verification. Please confirm the correct spelling and any title/credentials so we can standardize across quotes, advisory notes, and team mentions. |
| 13 | **"HealthPort Africa" as brand name** | The site currently uses "HealthPort". Spec pushes "HealthPort Africa" (PascalCase, cap the P) in headers, body, and footer. Confirm this is a full rename across the site — not just the geographic-scope headline. |

## 4. Access / decisions we need

| # | Item | Notes |
|---|---|---|
| 14 | **Careers inbox** | Phase 1 sends CVs to `info@healthportafrica.com`. Confirm that mailbox exists and is monitored. |
| 15 | **Zoho Mail routing (Phase 2)** | Need full list of hiring stakeholders for aliases/forwarding (spec names Toyeeb — who else?). Also confirm who owns the Zoho admin and will set this up. |
| 16 | **Zoho Recruit / Zoho Form (Phase 3)** | Confirm the product choice (Recruit vs. Form) and whether we get an admin account when it's time to embed. |
| 17 | **Standards section — hard-remove or hide?** | Spec says remove until compliance guidelines are formalized. Preference: keep the code behind a feature flag so it can be flipped back on, vs. delete and rebuild later? Also — rough ETA on the formalized guidelines? |
| 18 | **Hero video re-cut** | Current hero autoplays a testimonial loop. Copy around it is changing to "HealthPort Africa" / sub-Saharan framing. Does the video need a re-edit, or is the existing cut fine? |

## 5. Sanity checks on our end (no action needed from you)

Completed in the 2026-09-28 pass:

- Global geography sweep: "hospitals across Africa" → "sub-Saharan African hospitals" across `layout.tsx`, `opengraph-image.tsx`, `about/page.tsx`, `contact/page.tsx`, `for-partners/page.tsx`, `TrustBar.tsx`.
- Hero subheader rewrite (`src/components/home/Hero.tsx`).
- Oxygen Access Gap: "can't see" → "can't track", "Hours of wait" → "Hours to days of wait", manifold-vs-cylinder framing with `COPY NEEDED` marker.
- Extracted metrics into `data/metrics.json` and wired `ImpactChapter` via `src/lib/metrics.ts`.
- Billing disclaimer available as `BILLING_DISCLAIMER` in `src/lib/metrics.ts`; rendered under `HospitalGetsHealthPortTakes`.
- OaaS ProcessTeaser Steps 01, 02, 04 rewritten. Reticulation clarification landed in Step 02.
- Feature-flagged Standards section (`src/lib/flags.ts` → `SHOW_STANDARDS = false`, currently hidden on About).
- OxyIntel: stripped IoT jargon, rewrote `MLApproach`, removed roadmap (`WhatsComing`) from page routing.
- Partners section header renamed to "Current partners, supporters, and sponsors / funders"; Cargoplug + MIT KSC logo slots commented in `PartnerTypes.tsx` pending files.
- Impact Report download button behind `IMPACT_REPORT_URL` flag (drop PDF at `/public/impact-report.pdf`, set flag → button appears).
- Footer copyright updated to "HealthPort Africa" (PascalCase, cap the P).
- FAQ scaffolded (`src/components/oaas/FAQ.tsx`), rendered on OaaS page with draft answers.
- Careers Phase 1: inquiry form now routes to `info@healthportafrica.com` (client + server route map updated).

Still gated on the items above:

- Assets #1–#6.
- Real FAQ answers (currently draft), telemetry monitoring points, manifold-vs-cylinder failure copy.
- Metric approval, Dr. Olutekunbi spelling, "HealthPort Africa" full-rename decision.
- Careers inbox confirmation, Zoho scoping (Phase 2/3 out of scope for this build).
- Hero video re-cut decision.
