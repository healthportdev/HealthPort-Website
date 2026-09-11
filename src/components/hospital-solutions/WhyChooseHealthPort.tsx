/**
 * Hospital Solutions §2 — Why hospitals choose HealthPort.
 *
 * Static side-by-side comparison (dropped the previous
 * BeforeAfterToggle — the Figma shows both panels visible at once for
 * scannability at admin reading pace). LEFT panel is dark Ink with
 * Coral cross-marks — the pain of the traditional model. RIGHT panel
 * is Tea Green with Teal check-marks — the after-HealthPort state.
 * Section header sits centred above the two, with the Violet
 * punchline landing on "HealthPort" in the h2.
 *
 * Motion:
 *   - Header drifts via data-parallax
 *   - Each panel fades up on IntersectionObserver reveal with a
 *     small right-side stagger
 * Respects prefers-reduced-motion.
 */
"use client";

import { useEffect, useRef, useState } from "react";

const traditionalItems = [
  "Staff chasing multiple suppliers",
  "Emergency refills at unpredictable cost",
  "Cylinders lost between wards",
  "Oxygen wastage nobody can quantify",
  "Purity varies by delivery",
  "Training happens ad-hoc, if at all",
];

const healthPortItems = [
  "One partner. One monthly invoice.",
  "Reliable supply, tracked in real time",
  "Cylinders followed through their lifecycle",
  "Wastage measured and reduced",
  "Medical-grade purity to a stated standard",
  "Clinician training built into the service",
];

export function WhyChooseHealthPort() {
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="why-choose"
      className="w-full"
      aria-label="Why hospitals choose HealthPort"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        {/* Centered header — restrained weight/size vs the site's
            default h2; the section is a comparison, not a monument. */}
        <div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          data-parallax="-0.08"
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 1.5rem + 1.8vw, 3rem)",
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              textAlign: "center",
              textWrap: "balance",
              margin: 0,
            }}
          >
            Why hospitals choose{" "}
            <span style={{ color: "var(--color-violet)" }}>
              HealthPort
            </span>
            .
          </h2>
        </div>

        {/* Two panels — same grid, opposite personalities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <ComparisonPanel
            title="Traditional Model"
            items={traditionalItems}
            variant="traditional"
            revealed={revealed}
            delay={140}
          />
          <ComparisonPanel
            title="After HealthPort"
            items={healthPortItems}
            variant="healthport"
            revealed={revealed}
            delay={280}
          />
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Panel ---------------------------- */

function ComparisonPanel({
  title,
  items,
  variant,
  revealed,
  delay,
}: {
  title: string;
  items: string[];
  variant: "traditional" | "healthport";
  revealed: boolean;
  delay: number;
}) {
  const isTraditional = variant === "traditional";
  return (
    <article
      className="flex flex-col"
      style={{
        background: isTraditional
          ? "var(--color-ink)"
          : "var(--color-teagreen)",
        color: isTraditional
          ? "var(--color-parchment)"
          : "var(--color-ink)",
        borderRadius: "clamp(20px, 2vw, 28px)",
        padding: "clamp(2rem, 2.8vw, 2.75rem)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 580ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 580ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {/* Panel title */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(20px, 1.7vw, 24px)",
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: "-0.015em",
          margin: 0,
          marginBottom: "clamp(1.5rem, 2vw, 2rem)",
          color: isTraditional
            ? "var(--color-parchment)"
            : "var(--color-ink)",
        }}
      >
        {title}
      </h3>

      {/* Items */}
      <ul className="list-none flex flex-col gap-3 md:gap-3.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3"
            style={{
              fontSize: "clamp(14px, 1vw, 15.5px)",
              lineHeight: 1.5,
              color: isTraditional
                ? "var(--color-parchment)"
                : "var(--color-ink)",
              opacity: 0.9,
            }}
          >
            {isTraditional ? <XMark /> : <CheckMark />}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* --------------------------- Icons ---------------------------- */

/**
 * Small cross-mark for the traditional-model list — Coral outline
 * circle with an inner ×, Coral being brand's "warning / off" beat.
 */
function XMark() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{
        width: "20px",
        height: "20px",
        marginTop: "1px",
        borderRadius: "50%",
        border: "1.4px solid var(--color-coral)",
        color: "var(--color-coral)",
      }}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M2 2 L 8 8 M8 2 L 2 8" />
      </svg>
    </span>
  );
}

/**
 * Small check-mark for the HealthPort list — Teal filled disc with a
 * Parchment tick inside. Reads as "yes, we handle this."
 */
function CheckMark() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{
        width: "20px",
        height: "20px",
        marginTop: "1px",
        borderRadius: "50%",
        background: "var(--color-teal)",
      }}
    >
      <svg
        width="11"
        height="9"
        viewBox="0 0 11 9"
        fill="none"
        stroke="var(--color-parchment)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1.5 5 L 4.5 8 L 9.5 1" />
      </svg>
    </span>
  );
}
