/**
 * POST /api/contact
 *
 * Receives JSON from the InquiryForm on /contact, then hands off to
 * Resend which delivers the email to whichever mailbox matches the
 * inquiry type (Sage's routing spec, Sept 2026):
 *
 *   partner   → aishat.adeniji@healthportafrica.com
 *   hospital  → careteam@healthportafrica.com
 *   careers   → careteam@healthportafrica.com
 *   media     → healthportcomms@gmail.com
 *   general   → healthportcomms@gmail.com
 *
 * The client stamps `routeTo` on the payload, but the server ALSO
 * derives it from `type` here so a malformed / spoofed `routeTo`
 * can't redirect messages to arbitrary addresses.
 *
 * Environment (server-side, never NEXT_PUBLIC):
 *   RESEND_API_KEY      — Resend project key (required)
 *   CONTACT_FROM_EMAIL  — verified "from" address (required)
 *                          e.g. "HealthPort <noreply@healthportafrica.com>"
 *   CONTACT_BCC         — optional comma-separated bcc list
 *                          e.g. audit@healthportafrica.com
 *
 * The route is deliberately explicit about failure states so it's
 * debuggable in the Netlify build/function logs.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Force dynamic — this route needs runtime env access on every call.
export const dynamic = "force-dynamic";

// Server-side canonical routing table. Anything not in this map
// falls back to `general`.
const routeMap: Record<string, string> = {
  hospital: "careteam@healthportafrica.com",
  careers: "careteam@healthportafrica.com",
  partner: "aishat.adeniji@healthportafrica.com",
  media: "healthportcomms@gmail.com",
  general: "healthportcomms@gmail.com",
};

const typeLabels: Record<string, string> = {
  hospital: "Hospital Inquiry",
  partner: "Partner Inquiry",
  media: "Media & Press",
  careers: "Careers",
  general: "General",
};

type Payload = {
  type?: string;
  name?: string;
  email?: string;
  organisation?: string;
  phone?: string;
  message?: string;
  // Honeypot — a hidden field on the client form. Real users leave
  // it blank; bots that fill every input trip it and get rejected.
  website?: string;
};

// ── Rate limit ──────────────────────────────────────────────────────────
// Very light in-memory rate limit — 5 submissions per IP per 10 minutes.
// On Netlify/Vercel serverless this Map is per-instance (not shared),
// which is fine for a marketing form: worst case a determined attacker
// hits multiple instances but total volume stays bounded by Netlify's
// concurrent-invocation limits. For higher assurance move to Upstash /
// Redis; deliberately kept dependency-free here.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateStore = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const history = (rateStore.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (history.length >= RATE_LIMIT_MAX) {
    rateStore.set(ip, history);
    return true;
  }
  history.push(now);
  rateStore.set(ip, history);
  return false;
}

function clientIp(request: Request): string {
  // Trust common reverse-proxy headers set by Netlify / Vercel / etc.
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

// Very light sanitiser — strips ASCII control chars (0x00-0x1F and
// 0x7F DEL) plus trims and caps length. Not a full XSS defence
// (that's what `esc()` does for the HTML body); this just keeps the
// output clean and predictable in the recipient's inbox.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\x00-\x1F\x7F]/g;
const clean = (v: unknown, maxLen = 5000) =>
  typeof v === "string"
    ? v.replace(CONTROL_CHARS, "").trim().slice(0, maxLen)
    : "";

// Minimal HTML escape for the fields we interpolate into the HTML
// email body. Prevents a submitted "<script>" from being rendered
// as HTML on the recipient's side.
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function isEmail(v: string) {
  // Deliberately permissive — matches "something@something.something".
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Brand tokens hard-coded for the email renderer. Emails don't have
// access to CSS custom properties, and inlining these keeps the
// palette consistent with the site.
const EMAIL_INK = "#001316";
const EMAIL_PARCHMENT = "#F2EFEA";
const EMAIL_VIOLET = "#801078";
const EMAIL_MUTED = "#5b6567";
const EMAIL_KEYLINE = "#E1DDD6";
const EMAIL_TEAL = "#155362";

/**
 * HealthPort horizontal wordmark, read from disk once at module
 * load and base64-embedded so it renders in every email client
 * without needing the domain to be live. SVG is 8.4KB, base64
 * inflates it by ~33% to ~11KB — negligible for transactional
 * email volume. Modern clients (Gmail, Apple Mail, iOS/Android
 * Mail, Outlook.com web) all render SVG; the alt text carries the
 * brand name for the small % that don't.
 */
const LOGO_DATA_URI = (() => {
  try {
    const svgPath = join(
      process.cwd(),
      "public",
      "brand",
      "logo-horizontal-primary.svg"
    );
    const svg = readFileSync(svgPath, "utf8");
    const base64 = Buffer.from(svg, "utf8").toString("base64");
    return `data:image/svg+xml;base64,${base64}`;
  } catch (err) {
    console.warn(
      "[/api/contact] Could not read logo SVG; email will fall back to text wordmark.",
      err
    );
    return null;
  }
})();

/**
 * Renders the transactional email body. Structure:
 *
 *   1. Header — Violet H icon + HealthPort wordmark
 *   2. Inquiry label eyebrow
 *   3. Big heading ("New inquiry from Ace Test")
 *   4. Details table (name / email / organisation / phone)
 *   5. Message block (Parchment surface with the submitted text)
 *   6. Footer — timestamp + source
 *
 * All layout via <table>, all styles inline. Reads correctly in
 * Gmail, Apple Mail, Outlook, Superhuman, and mobile clients.
 */
function renderEmailHtml(v: {
  label: string;
  name: string;
  email: string;
  organisation: string;
  phone: string;
  message: string;
  timestamp: string;
}): string {
  const detailRow = (labelText: string, value: string, isLink = false) => `
    <tr>
      <td style="padding: 10px 24px 10px 0; color: ${EMAIL_MUTED}; font-size: 13px; vertical-align: top; width: 130px;">${esc(labelText)}</td>
      <td style="padding: 10px 0; font-size: 15px; color: ${EMAIL_INK}; word-break: break-word;">${
        isLink
          ? `<a href="mailto:${esc(value)}" style="color: ${EMAIL_TEAL}; text-decoration: none; border-bottom: 1px solid ${EMAIL_KEYLINE};">${esc(value)}</a>`
          : esc(value)
      }</td>
    </tr>`;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(v.label)} — ${esc(v.name)}</title>
  </head>
  <body style="margin: 0; padding: 0; background: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: ${EMAIL_INK}; line-height: 1.5;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff;">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 620px;">

            <!-- Header — HealthPort wordmark. Base64-embedded SVG so
                 it renders in every email client without depending
                 on the domain being live. If the client refuses to
                 render SVG (rare — mostly older Outlook desktop),
                 the alt text carries the brand name. -->
            <tr>
              <td style="padding: 0 0 28px;">
                ${
                  LOGO_DATA_URI
                    ? `<img src="${LOGO_DATA_URI}" alt="HealthPort" width="160" height="34" style="display: block; border: 0; outline: none; text-decoration: none; height: 34px; width: 160px;" />`
                    : `<div style="font-size: 22px; font-weight: 700; letter-spacing: -0.5px; color: ${EMAIL_INK};">HealthPort</div>`
                }
              </td>
            </tr>

            <!-- Inquiry label -->
            <tr>
              <td style="padding: 0 0 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: ${EMAIL_VIOLET};">
                ${esc(v.label)}
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td style="padding: 0 0 28px; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.25; color: ${EMAIL_INK};">
                New inquiry from ${esc(v.name)}.
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0 0 20px;">
                <div style="height: 1px; background: ${EMAIL_KEYLINE}; line-height: 1px; font-size: 0;">&nbsp;</div>
              </td>
            </tr>

            <!-- Details table -->
            <tr>
              <td style="padding: 0 0 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  ${detailRow("Name", v.name)}
                  ${detailRow("Email", v.email, true)}
                  ${v.organisation ? detailRow("Organisation", v.organisation) : ""}
                  ${v.phone ? detailRow("Phone", v.phone) : ""}
                </table>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0 0 20px;">
                <div style="height: 1px; background: ${EMAIL_KEYLINE}; line-height: 1px; font-size: 0;">&nbsp;</div>
              </td>
            </tr>

            <!-- Message label -->
            <tr>
              <td style="padding: 0 0 10px; font-size: 13px; color: ${EMAIL_MUTED};">
                Message
              </td>
            </tr>

            <!-- Message block -->
            <tr>
              <td style="padding: 0 0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: ${EMAIL_PARCHMENT}; border-radius: 10px;">
                  <tr>
                    <td style="padding: 20px 22px; font-size: 15px; line-height: 1.55; color: ${EMAIL_INK}; white-space: pre-wrap;">${esc(v.message)}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0 0 20px;">
                <div style="height: 1px; background: ${EMAIL_KEYLINE}; line-height: 1px; font-size: 0;">&nbsp;</div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 0; font-size: 12px; color: ${EMAIL_MUTED}; line-height: 1.6;">
                Sent ${esc(v.timestamp)} WAT<br />
                Source: <a href="https://healthportafrica.com/contact" style="color: ${EMAIL_MUTED}; text-decoration: none; border-bottom: 1px solid ${EMAIL_KEYLINE};">healthportafrica.com/contact</a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    return NextResponse.json(
      {
        error:
          "Contact endpoint not configured on the server. Set RESEND_API_KEY and CONTACT_FROM_EMAIL.",
      },
      { status: 500 }
    );
  }

  // Rate limit — before we do any parsing work.
  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // Honeypot — bots fill every input; humans never see this field.
  // Silently return 200 so bots can't tell they're being blocked.
  if (body.website && body.website.trim().length > 0) {
    console.warn(
      `[/api/contact] Honeypot triggered from ${ip} — silently dropping.`
    );
    return NextResponse.json({ ok: true });
  }

  const type = clean(body.type, 32);
  const name = clean(body.name, 200);
  const email = clean(body.email, 200);
  const organisation = clean(body.organisation, 200);
  const phone = clean(body.phone, 60);
  const message = clean(body.message, 5000);

  // Server-side validation — mirrors the client requirements, plus
  // the mandatory inquiry-type gate.
  if (!type || !(type in routeMap)) {
    return NextResponse.json(
      { error: "Please choose an inquiry type." },
      { status: 400 }
    );
  }
  if (!name) {
    return NextResponse.json(
      { error: "Full name is required." },
      { status: 400 }
    );
  }
  if (!email || !isEmail(email)) {
    return NextResponse.json(
      { error: "A valid work email is required." },
      { status: 400 }
    );
  }
  if (!message) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 }
    );
  }

  // Test override — when CONTACT_TEST_OVERRIDE_EMAIL is set, every
  // inquiry type routes there instead of the real inbox. Lets us
  // exercise the form end-to-end without spamming client mailboxes.
  // Unset (or leave blank) in production; the real routing resumes.
  const testOverride = process.env.CONTACT_TEST_OVERRIDE_EMAIL?.trim();
  const routeTo = testOverride || routeMap[type];
  const label = typeLabels[type] ?? "General";

  const bcc =
    process.env.CONTACT_BCC?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const subject = `HealthPort · ${label} from ${name}`;

  // Timestamp — West Africa Time, matches where the mailboxes live.
  const timestamp = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date());

  // Plain-text version — for the small number of clients that don't
  // render HTML, plus the accessibility layer many screen-reader
  // configurations prefer.
  const textLines = [
    `HealthPort — new inquiry`,
    ``,
    `Inquiry type:  ${label}`,
    ``,
    `From:          ${name}`,
    `Email:         ${email}`,
    organisation ? `Organisation:  ${organisation}` : null,
    phone ? `Phone:         ${phone}` : null,
    ``,
    `Message:`,
    `----------------------------------------`,
    message,
    `----------------------------------------`,
    ``,
    `Sent ${timestamp} WAT`,
    `Source: healthportafrica.com/contact`,
  ];
  const text = textLines.filter((l) => l !== null).join("\n");

  // HTML email — table-based layout for maximum email-client
  // compatibility. Inline styles only (email clients strip <style>
  // blocks aggressively). Brand tokens hard-coded because the CSS
  // custom properties aren't available in email renderers.
  const html = renderEmailHtml({
    label,
    name,
    email,
    organisation,
    phone,
    message,
    timestamp,
  });

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: [routeTo],
      bcc: bcc.length ? bcc : undefined,
      // replyTo → so a click-to-reply lands in the reader's inbox.
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[/api/contact] Resend error:", error);
      return NextResponse.json(
        { error: "Email delivery failed. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, routedTo: routeTo });
  } catch (err) {
    console.error("[/api/contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
