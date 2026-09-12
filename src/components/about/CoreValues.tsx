/**
 * About §3 — What guides how we build.
 *
 * Dark Ink chapter with a 2×2 grid of value cards. Each card:
 *   - Stroke-only Lucide-style icon (Tea Green)
 *   - Value label (Parchment, weight 700)
 *   - Short body copy
 *
 * Section header left-aligned per cross-page grammar. Cards fade up
 * on IntersectionObserver reveal with a per-card stagger. Respects
 * prefers-reduced-motion.
 */
"use client";

import { useEffect, useRef, useState } from "react";

type Value = {
  key: string;
  label: string;
  body: string;
  icon: React.ComponentType;
};

const values: Value[] = [
  {
    key: "reliability",
    label: "Reliability",
    body: "Uptime you can count on, cylinders where they should be, systems that work when it matters.",
    icon: ShieldIcon,
  },
  {
    key: "responsibility",
    label: "Responsibility",
    body: "We take on the operational burden of oxygen so hospitals can take responsibility for care.",
    icon: HandshakeIcon,
  },
  {
    key: "human-impact",
    label: "Human impact",
    body: "Every cylinder, every algorithm, every deployment is measured against patient outcomes.",
    icon: HeartPulseIcon,
  },
  {
    key: "accessibility",
    label: "Accessibility",
    body: "Reliable oxygen should not depend on where a patient happens to be treated.",
    icon: CompassIcon,
  },
];

export function CoreValues() {
  const rootRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
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
      aria-label="What guides how we build"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-parchment)",
        paddingBlock: "var(--spacing-section)",
      }}
    >
      <div className="container-page">
        {/* Header — left-aligned */}
        <div className="max-w-3xl mb-12 md:mb-16" data-parallax="-0.08">
          <p
            className="eyebrow mb-5"
            style={{ color: "var(--color-teagreen)" }}
          >
            Our values
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 1.5rem + 1.8vw, 3rem)",
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "var(--color-parchment)",
              margin: 0,
              textWrap: "balance",
            }}
          >
            What guides how{" "}
            <span style={{ color: "var(--color-teagreen)" }}>
              we build
            </span>
            .
          </h2>
        </div>

        {/* 2×2 grid of value cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {values.map((v, i) => (
            <ValueCard
              key={v.key}
              value={v}
              revealed={revealed}
              delay={140 + i * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- ValueCard ---------------------------- */

function ValueCard({
  value,
  revealed,
  delay,
}: {
  value: Value;
  revealed: boolean;
  delay: number;
}) {
  const Icon = value.icon;
  return (
    <article
      className="flex flex-col"
      style={{
        padding: "clamp(2rem, 2.6vw, 2.5rem)",
        borderRadius: "clamp(18px, 1.8vw, 22px)",
        border:
          "1px solid color-mix(in srgb, var(--color-parchment) 10%, transparent)",
        background:
          "color-mix(in srgb, var(--color-parchment) 4%, var(--color-ink))",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 580ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 580ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {/* Icon well — square, subtle Ink-tinted Tea Green fill */}
      <div
        className="mb-6 flex items-center justify-center"
        style={{
          width: "clamp(60px, 5vw, 72px)",
          height: "clamp(60px, 5vw, 72px)",
          borderRadius: "clamp(12px, 1.2vw, 16px)",
          border:
            "1px solid color-mix(in srgb, var(--color-teagreen) 20%, transparent)",
          background:
            "color-mix(in srgb, var(--color-teagreen) 8%, transparent)",
          color: "var(--color-teagreen)",
        }}
      >
        <Icon />
      </div>

      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(20px, 1.6vw, 24px)",
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: "-0.015em",
          color: "var(--color-parchment)",
          margin: 0,
          marginBottom: "0.75rem",
        }}
      >
        {value.label}
      </h3>
      <p
        style={{
          fontSize: "14.5px",
          lineHeight: 1.55,
          color: "rgba(242, 239, 234, 0.72)",
          margin: 0,
          maxWidth: "40ch",
        }}
      >
        {value.body}
      </p>
    </article>
  );
}

/* --------------------------- Icons ---------------------------- */

function iconProps() {
  return {
    width: "32",
    height: "32",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

/** Shield with a small centred tick — Reliability */
function ShieldIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 3 L 20 6 v6c0 4-3.5 7.5-8 9-4.5-1.5-8-5-8-9V6z" />
      <path d="M9 12.5 L 11 14.5 L 15.5 10" />
    </svg>
  );
}

/** Two hands meeting — Responsibility */
function HandshakeIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M2 12l4-4 3 3-4 4z" />
      <path d="M22 12l-4-4-3 3 4 4z" />
      <path d="M9 11l3 3 3-3" />
      <path d="M12 14v4" />
    </svg>
  );
}

/** Heart with a pulse trace across it — Human impact */
function HeartPulseIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
      <path d="M4 12h3l2-3 2 6 2-4h4" />
    </svg>
  );
}

/** Compass — Accessibility */
function CompassIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </svg>
  );
}
