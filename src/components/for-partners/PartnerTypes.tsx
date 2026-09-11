/**
 * For Partners §2 — Who we partner with.
 *
 * Left-aligned editorial header, then a grid of five partner-type
 * cards each with a stroke-only line icon, then the same partner-logo
 * marquee we ship on the home page (copied structurally from
 * TrustBar, not imported, so this section stays a single semantic
 * unit — one <section> not nested).
 *
 * Motion:
 *   - Header drifts via data-parallax
 *   - Each partner-type card fades up on IntersectionObserver reveal
 *     with a per-card stagger
 *   - Logo marquee continuously scrolls (hover-pause), independent
 *     of the reveal state
 * Respects prefers-reduced-motion.
 */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PartnerType = {
  key: string;
  name: string;
  body: string;
  icon: React.ComponentType;
};

const types: PartnerType[] = [
  {
    key: "governments",
    name: "Governments",
    body: "Regional and national partners embedding reliable oxygen infrastructure into public health systems.",
    icon: GovtIcon,
  },
  {
    key: "development",
    name: "Development Organisations",
    body: "Programme partners funding and shaping oxygen access across facilities, districts, and regions.",
    icon: GlobeHandIcon,
  },
  {
    key: "ngos",
    name: "NGOs & Global Health Partners",
    body: "Global health partners extending oxygen access to underserved communities and frontline facilities.",
    icon: HeartHandIcon,
  },
  {
    key: "funders",
    name: "Funders",
    body: "Institutional funders financing infrastructure deployment, capacity building, and impact scale-up.",
    icon: CoinIcon,
  },
  {
    key: "distributors",
    name: "Distributors & Channel Partners",
    body: "Logistics and distribution partners strengthening the last-mile delivery of oxygen and equipment.",
    icon: TruckIcon,
  },
];

// Real partner logos — same set the home TrustBar uses. Files live in
// /public/partners/ and were extracted from the Sept 2026 deck.
type Logo = { name: string; file: string; w: number; h: number };

const logos: Logo[] = [
  { name: "Lagos State Ministry of Health", file: "lagos-state-moh.png", w: 600, h: 460 },
  { name: "Edo State Primary Healthcare Development Agency", file: "edo-state-phcda.png", w: 600, h: 600 },
  { name: "Aig-Imoukhuede Foundation", file: "aig-imoukhuede-foundation.png", w: 1000, h: 700 },
  { name: "MIT Solve", file: "mit-solve.png", w: 600, h: 240 },
  { name: "D-Prize", file: "d-prize.png", w: 500, h: 280 },
  { name: "Every Breath Counts", file: "every-breath-counts.png", w: 2000, h: 543 },
  { name: "AFRIMED", file: "afrimed.png", w: 320, h: 320 },
  { name: "LEANMED", file: "leanmed.png", w: 320, h: 120 },
  { name: "Ultra Philanthropy", file: "ultra-philanthropy.png", w: 400, h: 400 },
  { name: "Better Futures CoLab", file: "better-futures-colab.png", w: 800, h: 700 },
];

export function PartnerTypes() {
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
      aria-label="Who we partner with"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        {/* Header — left-aligned, matches OxyIntel/Hospital Solutions
            section-header grammar. */}
        <div className="max-w-3xl mb-12 md:mb-16" data-parallax="-0.08">
          <p
            className="eyebrow mb-5"
            style={{ color: "var(--color-violet)" }}
          >
            Who we partner with
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
            Different partners,{" "}
            <span style={{ color: "var(--color-violet)" }}>
              one shared infrastructure model
            </span>
            .
          </h2>
        </div>

        {/* Partner-type grid — 5 items, 3 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 mb-16 md:mb-20">
          {types.map((t, i) => {
            const Icon = t.icon;
            const delay = 140 + i * 110;
            return (
              <article
                key={t.key}
                className="flex flex-col"
                style={{
                  padding: "clamp(1.5rem, 2vw, 2rem)",
                  borderRadius: "clamp(16px, 1.6vw, 20px)",
                  border: "1px solid var(--color-keyline)",
                  background: "var(--color-white)",
                  opacity: revealed ? 1 : 0,
                  transform: revealed
                    ? "translateY(0)"
                    : "translateY(14px)",
                  transition: `opacity 560ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 560ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
                }}
              >
                <div
                  className="mb-5"
                  style={{
                    width: "44px",
                    height: "44px",
                    color: "var(--color-violet)",
                  }}
                >
                  <Icon />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(17px, 1.3vw, 19px)",
                    fontWeight: 700,
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                    color: "var(--color-heading)",
                    margin: 0,
                    marginBottom: "0.65rem",
                  }}
                >
                  {t.name}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.55,
                    color: "var(--color-muted)",
                    margin: 0,
                  }}
                >
                  {t.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      {/* Current partners marquee — reuses the home TrustBar pattern.
          Full-viewport-width, single line, pauses on hover. Doubled
          in JSX so the CSS translateX(-50%) loop wraps seamlessly. */}
      <div className="flex flex-col gap-6">
        <div className="container-page">
          <p
            className="eyebrow"
            style={{ color: "var(--color-muted)" }}
          >
            Current partnership programmes
          </p>
        </div>

        <div className="partner-marquee">
          <ul className="partner-marquee__track">
            {[...logos, ...logos].map((p, i) => (
              <li
                key={`${p.name}-${i}`}
                className="partner-marquee__item"
                aria-hidden={i >= logos.length}
              >
                <Image
                  src={`/partners/${p.file}`}
                  alt={i < logos.length ? p.name : ""}
                  width={p.w}
                  height={p.h}
                  className="w-auto h-14 md:h-16 object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Icons ---------------------------- */
/* Stroke-only, 1.5px, currentColor — Lucide-style. Sized by parent. */

function iconProps() {
  return {
    width: "100%",
    height: "100%",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

/** Government building — columns with pediment */
function GovtIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 21h18" />
      <path d="M4 21V10l8-5 8 5v11" />
      <path d="M8 21v-8M12 21v-8M16 21v-8" />
      <path d="M3 10h18" />
    </svg>
  );
}

/** Globe + hand — development / programmes */
function GlobeHandIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="10" r="6" />
      <path d="M6 10h12" />
      <path d="M12 4c2 2 3 4 3 6s-1 4-3 6c-2-2-3-4-3-6s1-4 3-6z" />
      <path d="M4 20c1.5-1.5 3-2 5-2s3.5.5 5 2" />
    </svg>
  );
}

/** Heart in hands — NGOs / global health */
function HeartHandIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 15s-4-2.5-4-6a2.5 2.5 0 0 1 4-2 2.5 2.5 0 0 1 4 2c0 3.5-4 6-4 6z" />
      <path d="M4 21c1.5-2 3-3 5-3h6c2 0 3.5 1 5 3" />
    </svg>
  );
}

/** Coin — funders */
function CoinIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="8" />
      <path d="M10 8h4M10 16h4" />
      <path d="M9.5 12h5M12 9v6" />
    </svg>
  );
}

/** Truck — distributors */
function TruckIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M2 17V7h11v10" />
      <path d="M13 10h5l3 4v3h-2" />
      <circle cx="6.5" cy="17.5" r="2" />
      <circle cx="17.5" cy="17.5" r="2" />
      <path d="M8.5 17.5h6.5" />
    </svg>
  );
}
