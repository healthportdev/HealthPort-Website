/**
 * OaaS §6 — A clear line between what you get and what we handle.
 *
 * Rebuilt to match the approved Figma AND stay visually consistent with
 * the WhyOaas section further up the page:
 *   - Centered header with Teal/Coral accent rules
 *   - Violet eyebrow + h2 with a Violet punchline
 *   - Two card panels side-by-side (Tea-Green tint on left, Parchment on
 *     right), 4 items each with green checkmarks
 *   - Fade-up motion on scroll — same 90ms per-row stagger as WhyOaas
 *
 * Client component: IntersectionObserver drives the reveal cascade.
 * Respects prefers-reduced-motion.
 */
"use client";

import { useEffect, useRef, useState } from "react";

const hospitalGets = {
  eyebrow: "Your side",
  heading: "The hospital gets",
  body:
    "Predictable oxygen, without the operational headaches. You get to focus entirely on patient care.",
  items: [
    "Guaranteed oxygen availability",
    "Trained staff on safe handling and monitoring",
    "Real-time visibility via OxyIntel",
    "One predictable monthly bill",
  ],
};

const healthPortTakes = {
  eyebrow: "Our side",
  heading: "HealthPort takes on",
  body:
    "The full operational stack — from supply and safety through compliance and reporting.",
  items: [
    "Ownership and maintenance of equipment",
    "Procurement, logistics, replenishment",
    "Monitoring, forecasting, optimisation",
    "Compliance with purity standards",
  ],
};

export function HospitalGetsHealthPortTakes() {
  const rootRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className="w-full"
      aria-label="A clear line between what you get and what we handle"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        {/* Header — left-aligned for readability. The h2 is capped at a
            smaller display scale than the default token so the two
            Violet punchline phrases don't wrap awkwardly across lines. */}
        <div
          className="flex flex-col items-start text-left mb-14 md:mb-20 max-w-3xl"
          data-parallax="-0.08"
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "32px",
              height: "2px",
              background: "var(--color-teal)",
              marginBottom: "24px",
            }}
          />
          <p
            className="eyebrow mb-5"
            style={{ color: "var(--color-violet)" }}
          >
            A clear division of work
          </p>
          <h2
            className="mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 1.4rem + 2.4vw, 3.25rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              color: "var(--color-heading)",
              textWrap: "balance",
            }}
          >
            You get{" "}
            <span style={{ color: "var(--color-violet)" }}>
              reliable oxygen
            </span>
            . We take on{" "}
            <span style={{ color: "var(--color-violet)" }}>
              the operational burden
            </span>
            .
          </h2>
          <p
            className="max-w-xl"
            style={{
              color: "var(--color-fg)",
              fontSize: "var(--text-p2)",
              lineHeight: 1.5,
            }}
          >
            No shared ownership. No grey areas. Every duty sits on one
            side of the line.
          </p>
        </div>

        {/* Two-panel split — Parchment cards on the white page.
            Reference: fruitful.com — minimal cream/off-white cards with
            no shadows and no borders. The cream vs. white contrast is
            the only "card" cue needed. This also restores compliance
            with CLAUDE.md's no-shadow rule. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <SidePanel side="light" data={hospitalGets} revealed={revealed} />
          <SidePanel side="dark" data={healthPortTakes} revealed={revealed} />
        </div>
      </div>
    </section>
  );
}

type PanelData = {
  eyebrow: string;
  heading: string;
  body: string;
  items: string[];
};

function SidePanel({
  side,
  data,
  revealed,
}: {
  side: "light" | "dark";
  data: PanelData;
  revealed: boolean;
}) {
  // Two-tone palette matching the ProcessTeaser "01 We assess" card the
  // user referenced: LEFT is a light Tea-Green tint with Ink text,
  // RIGHT is deep Teal with Parchment text. Both pairings are allowed
  // per the brand guide (Tea-Green×Ink and Teal×Parchment).
  const isLight = side === "light";
  const bg = isLight
    ? "color-mix(in srgb, var(--color-teagreen) 55%, #FFFFFF)"
    : "var(--color-teal)";
  const eyebrowColor = isLight
    ? "var(--color-teal)"
    : "rgba(204, 238, 170, 0.85)";
  const headingColor = isLight
    ? "var(--color-ink)"
    : "var(--color-parchment)";
  const bodyColor = isLight
    ? "var(--color-fg)"
    : "rgba(242, 239, 234, 0.82)";
  const itemColor = isLight
    ? "var(--color-fg)"
    : "rgba(242, 239, 234, 0.92)";
  const checkDiscBg = isLight
    ? "var(--color-teal)"
    : "var(--color-parchment)";
  const checkTickColor = isLight
    ? "var(--color-parchment)"
    : "var(--color-teal)";

  return (
    <div
      style={{
        background: bg,
        borderRadius: "clamp(20px, 2vw, 28px)",
        padding: "clamp(2rem, 3.5vw, 3rem)",
      }}
    >
      {/* Small identifier tag above the heading */}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: eyebrowColor,
          margin: 0,
          marginBottom: "1.25rem",
        }}
      >
        {data.eyebrow}
      </p>

      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 2.4vw, 32px)",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.015em",
          color: headingColor,
          margin: 0,
          marginBottom: "1rem",
          textWrap: "balance",
        }}
      >
        {data.heading}
      </h3>

      {/* Body paragraph — same Fruitful cadence: title → paragraph →
          list. Gives the card real editorial substance. */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(14px, 0.95vw, 15px)",
          lineHeight: 1.55,
          color: bodyColor,
          margin: 0,
          marginBottom: "1.75rem",
          maxWidth: "38ch",
        }}
      >
        {data.body}
      </p>

      <ul className="list-none flex flex-col gap-4">
        {data.items.map((item, i) => (
          <li
            key={item}
            className="flex items-start gap-3.5"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed
                ? "translateY(0)"
                : "translateY(6px)",
              transition: `opacity 480ms cubic-bezier(0.22, 1, 0.36, 1), transform 480ms cubic-bezier(0.22, 1, 0.36, 1)`,
              transitionDelay: `${180 + i * 90}ms`,
            }}
          >
            <FilledCheck discBg={checkDiscBg} tickColor={checkTickColor} />
            <span
              style={{
                fontSize: "clamp(15px, 1.05vw, 16.5px)",
                lineHeight: 1.5,
                color: itemColor,
              }}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Filled circle check with parameterised colours so it can render on
 * both the light Tea-Green card (Teal disc, Parchment tick) and the
 * dark Teal card (Parchment disc, Teal tick).
 */
function FilledCheck({
  discBg,
  tickColor,
}: {
  discBg: string;
  tickColor: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center"
      style={{
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        background: discBg,
        flexShrink: 0,
        marginTop: "0.15rem",
      }}
    >
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
        <path
          d="M1.5 5.5l3 3 6-7"
          stroke={tickColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
