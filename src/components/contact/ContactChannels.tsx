/**
 * Contact — right column channel cards. Matches the Figma stack:
 *   1. WhatsApp card (light Tea Green tint, Teal CTA)
 *   2. Email + Phone card (grouped)
 *   3. Location card + a satellite map thumbnail
 *
 * All values are placeholders per the current design brief — swap
 * for real numbers/addresses when ready.
 */

export function ContactChannels() {
  return (
    <div className="flex flex-col gap-5">
      <WhatsAppCard />
      <EmailPhoneCard />
      <LocationCard />
    </div>
  );
}

/* --------------------------- WhatsApp ---------------------------- */

function WhatsAppCard() {
  return (
    <div
      className="w-full"
      style={{
        background:
          "color-mix(in srgb, var(--color-teagreen) 30%, var(--color-white))",
        border: "1px solid var(--color-keyline)",
        borderRadius: "clamp(16px, 1.6vw, 20px)",
        padding: "clamp(1.25rem, 1.6vw, 1.6rem)",
      }}
    >
      <div className="flex items-start gap-3 mb-4">
        {/* WhatsApp glyph — stroke phone in a filled disc */}
        <span
          aria-hidden
          className="inline-flex items-center justify-center flex-shrink-0"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "var(--color-teal)",
            color: "var(--color-parchment)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.4 8.4 0 0 1-1.2 4.3l1 4.2-4.3-1a8.5 8.5 0 1 1 4.5-7.5z" />
            <path d="M8.6 8.8c0-.5.3-.8.8-.9h.7c.2 0 .4.2.5.4l.7 1.6c.1.2 0 .5-.2.6l-.5.5c.6 1 1.3 1.7 2.3 2.3l.5-.5c.1-.2.4-.3.6-.2l1.6.7c.2.1.4.3.4.5v.7c-.1.5-.4.8-.9.8a7 7 0 0 1-6.5-6.5z" />
          </svg>
        </span>

        <div className="flex flex-col flex-1">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(15px, 1.15vw, 17px)",
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: "-0.005em",
              color: "var(--color-heading)",
              margin: 0,
              marginBottom: "2px",
            }}
          >
            WhatsApp
          </p>
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.4,
              color: "var(--color-muted)",
              margin: 0,
            }}
          >
            Quick questions, fast replies.
          </p>
        </div>
      </div>

      <a
        href="https://wa.me/2348035904073"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center w-full"
        style={{
          background: "var(--color-teal)",
          color: "var(--color-parchment)",
          fontFamily: "var(--font-display)",
          fontSize: "14.5px",
          fontWeight: 700,
          letterSpacing: "-0.005em",
          padding: "0.85rem 1rem",
          borderRadius: "8px",
        }}
      >
        Chat on WhatsApp
      </a>
      <p
        style={{
          fontSize: "12px",
          color: "var(--color-muted)",
          margin: 0,
          marginTop: "0.75rem",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        +234 803 590 4073
      </p>
    </div>
  );
}

/* --------------------------- Email + Phone ---------------------------- */

function EmailPhoneCard() {
  return (
    <div
      className="w-full"
      style={{
        background: "var(--color-white)",
        border: "1px solid var(--color-keyline)",
        borderRadius: "clamp(16px, 1.6vw, 20px)",
        padding: "clamp(1.25rem, 1.6vw, 1.6rem)",
      }}
    >
      <ChannelRow
        icon={<EnvelopeIcon />}
        label="Email"
        value="hello@healthportafrica.com"
        href="mailto:hello@healthportafrica.com"
      />

      <div
        aria-hidden
        style={{
          height: "1px",
          background: "var(--color-keyline)",
          marginBlock: "1rem",
        }}
      />

      <ChannelRow
        icon={<PhoneIcon />}
        label="Phone"
        value="+234 806 412 4356"
        href="tel:+2348064124356"
      />
    </div>
  );
}

function ChannelRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className="inline-flex items-center justify-center flex-shrink-0"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background:
            "color-mix(in srgb, var(--color-teagreen) 30%, var(--color-parchment))",
          color: "var(--color-teal)",
        }}
      >
        {icon}
      </span>
      <div className="flex flex-col flex-1 min-w-0">
        <p
          className="eyebrow"
          style={{
            fontSize: "10px",
            color: "var(--color-teal)",
            letterSpacing: "0.14em",
            marginBottom: "3px",
          }}
        >
          {label}
        </p>
        <a
          href={href}
          className="link-quiet truncate"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--color-heading)",
          }}
        >
          {value}
        </a>
      </div>
    </div>
  );
}

/* --------------------------- Location ---------------------------- */

function LocationCard() {
  return (
    <div
      className="w-full"
      style={{
        background: "var(--color-white)",
        border: "1px solid var(--color-keyline)",
        borderRadius: "clamp(16px, 1.6vw, 20px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{ padding: "clamp(1.25rem, 1.6vw, 1.6rem)" }}
        className="flex items-start gap-3"
      >
        <span
          aria-hidden
          className="inline-flex items-center justify-center flex-shrink-0"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background:
              "color-mix(in srgb, var(--color-teagreen) 30%, var(--color-parchment))",
            color: "var(--color-teal)",
          }}
        >
          <PinIcon />
        </span>
        <div className="flex flex-col flex-1">
          <p
            className="eyebrow"
            style={{
              fontSize: "10px",
              color: "var(--color-teal)",
              letterSpacing: "0.14em",
              marginBottom: "3px",
            }}
          >
            Location
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              lineHeight: 1.4,
              color: "var(--color-heading)",
              margin: 0,
            }}
          >
            The Phillipi Centre, Plot A,
            <br />
            Awolowo Way, Ikeja, Lagos.
          </p>
        </div>
      </div>

      {/* Satellite/map placeholder — soft green/brown grid pattern
          styled to read as an aerial thumbnail. Swap for a real
          static map export when the client picks a provider. */}
      <div
        aria-hidden
        style={{
          height: "clamp(160px, 18vw, 220px)",
          backgroundColor: "#7a8b6a",
          backgroundImage: `
            linear-gradient(120deg, rgba(255,255,255,0.06) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.06) 75%, transparent 75%),
            linear-gradient(60deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.08) 75%, transparent 75%),
            radial-gradient(circle at 60% 40%, rgba(255,255,255,0.14) 0%, transparent 40%)
          `,
          backgroundSize: "40px 40px, 60px 60px, 100% 100%",
        }}
      />
    </div>
  );
}

/* --------------------------- Icons ---------------------------- */

function EnvelopeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
