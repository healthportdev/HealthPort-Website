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
};

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

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
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

  const routeTo = routeMap[type];
  const label = typeLabels[type] ?? "General";

  const bcc =
    process.env.CONTACT_BCC?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const subject = `[HealthPort · ${label}] ${name}`;

  // Plain-text alternative for clients that don't render HTML.
  const textLines = [
    `Inquiry type: ${label}`,
    `Name:         ${name}`,
    `Email:        ${email}`,
    organisation ? `Organisation: ${organisation}` : null,
    phone ? `Phone:        ${phone}` : null,
    "",
    "Message:",
    message,
  ];
  const text = textLines.filter((l) => l !== null).join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #001316; line-height: 1.5;">
      <p style="margin: 0 0 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; font-size: 12px; color: #801078;">
        ${esc(label)}
      </p>
      <table style="border-collapse: collapse; margin: 0 0 20px;">
        <tbody>
          <tr>
            <td style="padding: 4px 16px 4px 0; color: #6b7472; font-size: 13px;">Name</td>
            <td style="padding: 4px 0; font-size: 14px;">${esc(name)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 16px 4px 0; color: #6b7472; font-size: 13px;">Email</td>
            <td style="padding: 4px 0; font-size: 14px;"><a href="mailto:${esc(email)}" style="color: #155362;">${esc(email)}</a></td>
          </tr>
          ${
            organisation
              ? `<tr><td style="padding: 4px 16px 4px 0; color: #6b7472; font-size: 13px;">Organisation</td><td style="padding: 4px 0; font-size: 14px;">${esc(organisation)}</td></tr>`
              : ""
          }
          ${
            phone
              ? `<tr><td style="padding: 4px 16px 4px 0; color: #6b7472; font-size: 13px;">Phone</td><td style="padding: 4px 0; font-size: 14px;">${esc(phone)}</td></tr>`
              : ""
          }
        </tbody>
      </table>
      <div style="padding: 16px; background: #F2EFEA; border-radius: 8px; white-space: pre-wrap; font-size: 14px;">
${esc(message)}
      </div>
      <p style="margin: 20px 0 0; font-size: 12px; color: #6b7472;">
        Sent from the HealthPort contact form.
      </p>
    </div>
  `;

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
