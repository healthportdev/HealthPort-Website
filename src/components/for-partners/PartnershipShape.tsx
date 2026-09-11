/**
 * For Partners §3 — Ways to build with us.
 *
 * 2×2 grid of four bordered cards. Each card carries a distinct
 * always-on micro-motion on its stroke icon so the section feels
 * alive without shouting:
 *   1. Program design      → gear rotating slowly (12s / rotation)
 *   2. Distribution        → truck body bobs on a soft cycle
 *   3. Funding & financing → bar-chart bars pulse in a wave
 *   4. Sustainable         → lightning bolt breathes in opacity
 *
 * Cards fade up on IntersectionObserver reveal with a per-card
 * stagger. Respects prefers-reduced-motion — all four micro-motions
 * pause and the icons hold static.
 */
"use client";

import { useEffect, useRef, useState } from "react";

type Way = {
  key: string;
  title: string;
  body: string;
  icon: React.ComponentType;
};

const ways: Way[] = [
  {
    key: "program",
    title: "Program design",
    body: "Co-designing large-scale oxygen programmes for regions, states, and health systems — grounded in deployment data, not decks.",
    icon: GearScene,
  },
  {
    key: "distribution",
    title: "Distribution",
    body: "Extending the reliable network through logistics and last-mile partners who keep cylinders moving on time.",
    icon: TruckScene,
  },
  {
    key: "funding",
    title: "Funding & financing",
    body: "Working alongside donors, corporates, and impact investors to shape financing that fits each facility’s reality.",
    icon: ChartScene,
  },
  {
    key: "sustainable",
    title: "Sustainable generation",
    body: "On-site oxygen generation for partners investing in a lower-carbon supply chain and long-term self-sufficiency.",
    icon: BoltScene,
  },
];

export function PartnershipShape() {
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
      className="w-full"
      aria-label="Ways to build with us"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        {/* Header — left-aligned, restrained */}
        <div className="max-w-3xl mb-12 md:mb-16" data-parallax="-0.08">
          <p
            className="eyebrow mb-5"
            style={{ color: "var(--color-violet)" }}
          >
            Ways to build with us
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 1.5rem + 1.8vw, 3rem)",
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "var(--color-heading)",
              margin: 0,
              textWrap: "balance",
            }}
          >
            Diverse investments in{" "}
            <span style={{ color: "var(--color-violet)" }}>
              a single point of scale
            </span>
            .
          </h2>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {ways.map((w, i) => (
            <WayCard
              key={w.key}
              way={w}
              revealed={revealed}
              delay={140 + i * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- WayCard ---------------------------- */

function WayCard({
  way,
  revealed,
  delay,
}: {
  way: Way;
  revealed: boolean;
  delay: number;
}) {
  const Icon = way.icon;
  return (
    <article
      className="flex flex-col"
      style={{
        padding: "clamp(2rem, 2.6vw, 2.5rem)",
        borderRadius: "clamp(18px, 1.8vw, 22px)",
        border: "1px solid var(--color-keyline)",
        background: "var(--color-white)",
        minHeight: "clamp(280px, 26vw, 340px)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 580ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 580ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {/* Icon well — sits inside a rounded square so each card has a
          consistent anchor point regardless of icon shape. */}
      <div
        className="mb-6 flex items-center justify-center"
        style={{
          width: "clamp(70px, 6vw, 84px)",
          height: "clamp(70px, 6vw, 84px)",
          borderRadius: "clamp(14px, 1.4vw, 18px)",
          border: "1px solid var(--color-keyline)",
          background:
            "color-mix(in srgb, var(--color-violet) 4%, var(--color-parchment))",
          color: "var(--color-violet)",
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
          color: "var(--color-heading)",
          margin: 0,
          marginBottom: "0.75rem",
        }}
      >
        {way.title}
      </h3>
      <p
        style={{
          fontSize: "14.5px",
          lineHeight: 1.55,
          color: "var(--color-muted)",
          margin: 0,
          maxWidth: "42ch",
        }}
      >
        {way.body}
      </p>
    </article>
  );
}

/* --------------------------- Icons + micro-motion ---------------------------- */

function iconWrap(children: React.ReactNode) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Gear that rotates slowly. Uses `.ways-spin` — added to globals.css. */
function GearScene() {
  return (
    <span
      className="ways-spin inline-flex"
      style={{
        transformOrigin: "center",
        color: "inherit",
      }}
    >
      {iconWrap(
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        </>
      )}
    </span>
  );
}

/** Delivery truck that bobs subtly on a soft cycle. */
function TruckScene() {
  return (
    <span className="ways-bob inline-flex" style={{ color: "inherit" }}>
      {iconWrap(
        <>
          <path d="M2 17V7h11v10" />
          <path d="M13 10h5l3 4v3h-2" />
          <circle cx="6.5" cy="17.5" r="2" />
          <circle cx="17.5" cy="17.5" r="2" />
          <path d="M8.5 17.5h6.5" />
        </>
      )}
    </span>
  );
}

/** Three bar-chart bars that pulse height in a wave. */
function ChartScene() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 20h18" />
      <rect
        x="5.5"
        y="12"
        width="3"
        height="7"
        rx="0.6"
        className="ways-bar"
        style={{ animationDelay: "0s" } as React.CSSProperties}
      />
      <rect
        x="10.5"
        y="8"
        width="3"
        height="11"
        rx="0.6"
        className="ways-bar"
        style={{ animationDelay: "0.2s" } as React.CSSProperties}
      />
      <rect
        x="15.5"
        y="5"
        width="3"
        height="14"
        rx="0.6"
        className="ways-bar"
        style={{ animationDelay: "0.4s" } as React.CSSProperties}
      />
    </svg>
  );
}

/** Lightning bolt that breathes in opacity (a "generation" pulse). */
function BoltScene() {
  return (
    <span
      className="ways-breathe inline-flex"
      style={{ color: "inherit" }}
    >
      {iconWrap(
        <path d="M13 2 L 4 14 h6 l-1 8 l9-12 h-6 z" />
      )}
    </span>
  );
}
