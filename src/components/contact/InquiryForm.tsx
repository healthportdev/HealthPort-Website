/**
 * Contact form — Figma layout: card panel with a pill selector for
 * inquiry type across the top, then a stack of form fields, and a
 * Violet "Request an Assessment" button at the bottom.
 *
 * Routing per client direction (Sept 2026):
 *   partner   → aishat.adeniji@healthportafrica.com
 *   hospital  → careteam@healthportafrica.com
 *   careers   → careteam@healthportafrica.com
 *   media     → healthportcomms@gmail.com
 *   general   → healthportcomms@gmail.com
 *
 * The chosen inquiry type is stamped as `routeTo` on the submitted
 * payload so the receiving endpoint (Resend function, Formspree,
 * custom API route) knows which mailbox to forward to.
 */
"use client";

import { useState } from "react";

type InquiryType = {
  value: string;
  label: string;
  hint: string;
  icon: React.ComponentType;
  // Per-inquiry-type adaptive copy. Only these three pieces change
  // when the reader picks a different type — the rest of the form
  // structure stays constant so nothing reflows.
  orgLabel: string;
  orgRequired: boolean;
  messageLabel: string;
  submitLabel: string;
};

const inquiryTypes: InquiryType[] = [
  {
    value: "hospital",
    label: "Hospital Inquiry",
    hint: "Book an assessment or ask about OaaS",
    icon: HospitalIcon,
    orgLabel: "Hospital",
    orgRequired: true,
    messageLabel:
      "Tell us about your current oxygen challenges",
    submitLabel: "Request For an Assessment",
  },
  {
    value: "partner",
    label: "Partner Inquiry",
    hint: "Governments, NGOs, development orgs",
    icon: HandshakeIcon,
    orgLabel: "Organisation",
    orgRequired: true,
    messageLabel: "Tell us about your partnership interest",
    submitLabel: "Send message",
  },
  {
    value: "media",
    label: "Media & Press",
    hint: "Press requests and media enquiries",
    icon: NewsIcon,
    orgLabel: "Publication",
    orgRequired: true,
    messageLabel: "Tell us about your press enquiry",
    submitLabel: "Send message",
  },
  {
    value: "careers",
    label: "Careers",
    hint: "Join the HealthPort team",
    icon: BriefcaseIcon,
    orgLabel: "Current employer",
    orgRequired: false,
    messageLabel: "Which role interests you, and why HealthPort?",
    submitLabel: "Send message",
  },
  {
    value: "general",
    label: "General",
    hint: "Anything else",
    icon: ChatIcon,
    orgLabel: "Organisation (optional)",
    orgRequired: false,
    messageLabel: "How can we help?",
    submitLabel: "Send message",
  },
];

// Fallback copy shown before the reader has picked an inquiry type.
// Keeps labels generic so the form still reads clearly at first
// glance without pre-committing to a domain.
const fallbackCopy = {
  orgLabel: "Organisation",
  messageLabel: "Message",
  submitLabel: "Send message",
};

const routeMap: Record<string, string> = {
  hospital: "careteam@healthportafrica.com",
  careers: "careteam@healthportafrica.com",
  partner: "aishat.adeniji@healthportafrica.com",
  media: "healthportcomms@gmail.com",
  general: "healthportcomms@gmail.com",
};

type Status = "idle" | "sending" | "sent" | "error";

export function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Start with NO type selected so the reader has to actively pick.
  // Empty string here becomes the trigger for the "please choose"
  // validation below.
  const [selectedType, setSelectedType] = useState<string>("");
  const [typeError, setTypeError] = useState(false);

  // Adaptive copy for the current selection. Falls back to generic
  // labels before a type is picked so the form still renders
  // meaningfully.
  const selectedConfig = inquiryTypes.find(
    (t) => t.value === selectedType
  );
  const orgLabel = selectedConfig?.orgLabel ?? fallbackCopy.orgLabel;
  const orgRequired = selectedConfig?.orgRequired ?? false;
  const messageLabel =
    selectedConfig?.messageLabel ?? fallbackCopy.messageLabel;
  const submitLabel =
    selectedConfig?.submitLabel ?? fallbackCopy.submitLabel;

  // Default to the built-in Next.js API route at /api/contact.
  // `NEXT_PUBLIC_CONTACT_ENDPOINT` remains an escape hatch for
  // pointing the form at an external service (Formspree, custom
  // webhook, etc.) without redeploying the API route.
  const endpoint =
    process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "/api/contact";

  const onSelectType = (value: string) => {
    setSelectedType(value);
    if (typeError) setTypeError(false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    // Enforce inquiry type selection before doing anything else.
    if (!selectedType) {
      setTypeError(true);
      return;
    }

    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("type", selectedType);
    data.set("routeTo", routeMap[selectedType] ?? routeMap.general);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      // Surface the server's error message (from /api/contact) so
      // the reader sees a real reason if delivery fails, not just
      // "Server responded 500".
      if (!res.ok) {
        let serverMsg: string | null = null;
        try {
          const json = (await res.json()) as { error?: string };
          serverMsg = json?.error ?? null;
        } catch {
          /* body wasn't JSON — swallow */
        }
        throw new Error(serverMsg ?? `Server responded ${res.status}`);
      }
      setStatus("sent");
      form.reset();
      setSelectedType("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Unknown submission error"
      );
    }
  };

  if (status === "sent") {
    return (
      <div
        className="p-8 md:p-10"
        style={{
          border: "1px solid var(--color-keyline)",
          borderRadius: "clamp(16px, 1.6vw, 20px)",
          background: "var(--color-parchment)",
        }}
      >
        <p
          className="eyebrow mb-4"
          style={{ color: "var(--color-teal)" }}
        >
          Message sent
        </p>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(20px, 1.6vw, 24px)",
            fontWeight: 600,
            lineHeight: 1.3,
            color: "var(--color-heading)",
            margin: 0,
          }}
        >
          Thanks. We&rsquo;ve got your message and will be in touch
          shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col w-full"
    >
      {/* Section heading — sits on the page bg, no card wrapper */}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(22px, 1.8vw, 26px)",
          fontWeight: 700,
          lineHeight: 1.25,
          letterSpacing: "-0.015em",
          color: "var(--color-heading)",
          margin: 0,
          marginBottom: "0.35rem",
        }}
      >
        What can we help you with?
      </h2>

      {/* Required-choice indicator — makes it obvious the reader
          needs to pick before anything else. Turns Coral if they
          try to submit without a selection. */}
      <p
        style={{
          fontSize: "12.5px",
          color: typeError
            ? "var(--color-coral)"
            : "var(--color-muted)",
          margin: 0,
          marginBottom: "1.25rem",
          fontFamily: "var(--font-body)",
          transition: "color 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        role={typeError ? "alert" : undefined}
      >
        {typeError
          ? "Please choose an inquiry type to continue."
          : "Choose an inquiry type to get started."}{" "}
        <span
          aria-hidden
          style={{
            color: "var(--color-violet)",
            fontWeight: 700,
          }}
        >
          *
        </span>
      </p>

      {/* Inquiry type pills — modern compact tiles. Icon left,
          two-line copy right. Selected state: 2px Violet border
          (no rail, no background fill) + Violet icon tile + Violet
          label + a small check indicator in the top-right corner.
          Nothing else changes, so the row reads clean and modern. */}
      <fieldset
        className="grid gap-2.5 mb-8"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(clamp(180px, 17vw, 240px), 1fr))",
          border: 0,
          padding: 0,
          margin: 0,
        }}
      >
        <legend className="sr-only">Inquiry type</legend>
        {inquiryTypes.map((t) => {
          const active = selectedType === t.value;
          const Icon = t.icon;
          return (
            <label
              key={t.value}
              className="cursor-pointer relative"
              style={{
                // Border switches thickness on active. Padding is
                // reduced by 1px on active so the tile's inner
                // content doesn't reflow when the border grows.
                padding: active
                  ? "calc(0.95rem - 1px) calc(1rem - 1px)"
                  : "0.95rem 1rem",
                borderRadius: "12px",
                border: `${active ? "2px" : "1px"} solid ${
                  active ? "var(--color-violet)" : "var(--color-keyline)"
                }`,
                background: "var(--color-white)",
                transition:
                  "border-color 180ms cubic-bezier(0.22, 1, 0.36, 1), padding 180ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <input
                type="radio"
                name="type-input"
                value={t.value}
                checked={active}
                onChange={() => onSelectType(t.value)}
                className="sr-only"
              />

              {/* Check indicator — top-right corner, only visible on
                  active. Small filled Violet disc with a Parchment
                  tick. */}
              <span
                aria-hidden
                className="absolute inline-flex items-center justify-center"
                style={{
                  top: "10px",
                  right: "10px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "var(--color-violet)",
                  color: "var(--color-parchment)",
                  opacity: active ? 1 : 0,
                  transform: active ? "scale(1)" : "scale(0.6)",
                  transition:
                    "opacity 180ms cubic-bezier(0.22, 1, 0.36, 1), transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <svg
                  width="9"
                  height="7"
                  viewBox="0 0 9 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 3.5 L 3.5 6 L 8 1" />
                </svg>
              </span>

              <div className="flex items-start gap-3 pr-5">
                {/* Icon tile */}
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center flex-shrink-0"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9px",
                    background: active
                      ? "color-mix(in srgb, var(--color-violet) 10%, var(--color-parchment))"
                      : "var(--color-parchment)",
                    color: active
                      ? "var(--color-violet)"
                      : "var(--color-muted)",
                    transition:
                      "background 180ms cubic-bezier(0.22, 1, 0.36, 1), color 180ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <Icon />
                </span>

                <div className="flex flex-col min-w-0">
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--color-heading)",
                      letterSpacing: "-0.005em",
                      lineHeight: 1.25,
                      marginBottom: "0.2rem",
                    }}
                  >
                    {t.label}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.4,
                      color: "var(--color-muted)",
                    }}
                  >
                    {t.hint}
                  </span>
                </div>
              </div>
            </label>
          );
        })}
      </fieldset>

      {/* Fields */}
      <div className="flex flex-col gap-5">
        <Field label="Full name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="field-input"
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Work email" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="field-input"
            />
          </Field>
          <Field label={orgLabel} htmlFor="organisation">
            <input
              id="organisation"
              name="organisation"
              type="text"
              required={orgRequired}
              autoComplete="organization"
              className="field-input"
            />
          </Field>
        </div>

        <Field label="Phone number" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="field-input"
          />
        </Field>

        <Field label={messageLabel} htmlFor="message">
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="field-input"
          />
        </Field>
      </div>

      {/* Submit row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
        <p
          style={{
            fontSize: "12.5px",
            lineHeight: 1.5,
            color: "var(--color-muted)",
            margin: 0,
            maxWidth: "38ch",
          }}
        >
          We respond to all inquiries within 24 hours.
        </p>
        <button
          type="submit"
          className="btn-primary"
          disabled={status === "sending"}
          style={
            status === "sending"
              ? { opacity: 0.7, cursor: "wait" }
              : undefined
          }
        >
          {status === "sending" ? "Sending…" : submitLabel}
          {status !== "sending" && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {status === "error" && errorMsg && (
        <p
          role="alert"
          className="text-[13px] mt-4"
          style={{ color: "var(--color-coral)" }}
        >
          {errorMsg}
        </p>
      )}

      <style jsx>{`
        .field-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: var(--color-white);
          color: var(--color-fg);
          border: 1px solid var(--color-keyline);
          border-radius: 10px;
          font-family: var(--font-body);
          font-size: 14.5px;
          line-height: 1.5;
          transition: border-color 180ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .field-input::placeholder {
          color: color-mix(
            in srgb,
            var(--color-muted) 78%,
            transparent
          );
        }
        .field-input:focus {
          outline: none;
          border-color: var(--color-violet);
          box-shadow: 0 0 0 3px
            color-mix(in srgb, var(--color-violet) 15%, transparent);
        }
        textarea.field-input {
          resize: vertical;
          min-height: 7rem;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-2">
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.02em",
          color: "var(--color-heading)",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

/* --------------------------- Icons ---------------------------- */
/* Stroke-only, currentColor. Used inside the inquiry-type pills. */

function iconProps() {
  return {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

/** Hospital cross emblem */
function HospitalIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 21V8l8-4 8 4v13" />
      <path d="M9 21v-6h6v6" />
      <path d="M12 9v4M10 11h4" />
    </svg>
  );
}

/** Two hands meeting */
function HandshakeIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M2 13l4-4 3 3-4 4z" />
      <path d="M22 13l-4-4-3 3 4 4z" />
      <path d="M9 12l3 3 3-3" />
      <path d="M12 15v3" />
    </svg>
  );
}

/** Newspaper / press */
function NewsIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h6M7 13h6M7 17h4" />
      <path d="M15 9h2v4h-2z" />
    </svg>
  );
}

/** Briefcase / careers */
function BriefcaseIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

/** Speech bubble / general */
function ChatIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-4 3.5V17H6a2 2 0 0 1-2-2z" />
    </svg>
  );
}
