/**
 * For Partners §4 — Transparency is built into the platform.
 *
 * Dark Ink chapter, 2-column layout. LEFT column carries the
 * editorial header (Tea Green eyebrow + Parchment h2 + muted sub +
 * primary CTA), RIGHT column carries a live-impact dashboard card
 * with four stat rows. The stat values count up from 0 to their
 * target when the section enters the viewport — same rAF/ease-out
 * pattern the constitution allows for impact stats.
 *
 * Motion:
 *   - Header + card fade up on IntersectionObserver reveal
 *   - Stat values animate 0 → target once (1.6s ease-out cubic)
 *   - Small "LIVE" pulse dot on the card header (opacity breath)
 * Respects prefers-reduced-motion — values snap to their target,
 * pulse holds static.
 */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Stat = {
  label: string;
  target: number;
  format: (n: number) => string;
};

const stats: Stat[] = [
  {
    label: "Cylinders monitored",
    target: 12847,
    format: (n) => Math.round(n).toLocaleString(),
  },
  {
    label: "Oxygen delivered",
    target: 2.4,
    // "M L" suffix — value is in millions of litres so we render
    // one decimal + M L for a compact, dashboard-ish look.
    format: (n) => `${n.toFixed(1)}M L`,
  },
  {
    label: "Facilities served",
    target: 47,
    format: (n) => Math.round(n).toLocaleString(),
  },
  {
    label: "Patient hours covered",
    target: 892450,
    format: (n) => Math.round(n).toLocaleString(),
  },
];

export function ImpactReporting() {
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
      id="transparency"
      className="w-full"
      aria-label="Transparency is built into the platform"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-parchment)",
        paddingBlock: "var(--spacing-section)",
      }}
    >
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 md:gap-16 items-center">
          {/* LEFT — editorial header + CTA */}
          <div data-parallax="-0.06">
            <p
              className="eyebrow mb-5"
              style={{ color: "var(--color-teagreen)" }}
            >
              Transparency
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 1.5rem + 2vw, 3.25rem)",
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                color: "var(--color-parchment)",
                margin: 0,
                textWrap: "balance",
              }}
            >
              Transparency is{" "}
              <span style={{ color: "var(--color-teagreen)" }}>
                built into the platform
              </span>
              .
            </h2>
            <p
              style={{
                fontSize: "clamp(15px, 1vw, 17px)",
                lineHeight: 1.6,
                color: "rgba(242, 239, 234, 0.72)",
                margin: 0,
                marginBottom: "2rem",
                maxWidth: "40ch",
              }}
            >
              Accountable operational dashboards with real-time metrics for
              funders, governments, and delivery partners. Ground-truth
              from OxyIntel — not survey estimates.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2"
              style={{
                background: "var(--color-teagreen)",
                color: "var(--color-ink)",
                fontFamily: "var(--font-display)",
                fontSize: "14.5px",
                fontWeight: 700,
                letterSpacing: "-0.005em",
                padding: "0.75rem 1.25rem",
                borderRadius: "8px",
              }}
            >
              Request full report
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
            </Link>
          </div>

          {/* RIGHT — dashboard card. Parallax on an OUTER wrapper so
              the fade-up reveal transform on the inner div doesn't
              collide with the parallax translate (Parallax.tsx
              overwrites `transform`). */}
          <div data-parallax="-0.05">
            <div
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(14px)",
                transition:
                  "opacity 620ms cubic-bezier(0.22, 1, 0.36, 1) 200ms, transform 620ms cubic-bezier(0.22, 1, 0.36, 1) 200ms",
              }}
            >
              <ImpactCard revealed={revealed} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- ImpactCard ---------------------------- */

function ImpactCard({ revealed }: { revealed: boolean }) {
  return (
    <div
      style={{
        background:
          "color-mix(in srgb, var(--color-parchment) 4%, var(--color-ink))",
        border:
          "1px solid color-mix(in srgb, var(--color-parchment) 10%, transparent)",
        borderRadius: "clamp(18px, 1.8vw, 22px)",
        overflow: "hidden",
      }}
    >
      {/* Header row — eyebrow + LIVE indicator */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "clamp(1.25rem, 1.6vw, 1.6rem) clamp(1.5rem, 2vw, 2rem)",
          borderBottom:
            "1px solid color-mix(in srgb, var(--color-parchment) 10%, transparent)",
        }}
      >
        <span
          className="eyebrow"
          style={{
            fontSize: "10px",
            color: "rgba(242, 239, 234, 0.6)",
            letterSpacing: "0.16em",
          }}
        >
          Impact report
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="brain-synapse"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--color-teagreen)",
              display: "inline-block",
              animationDelay: "0s",
            }}
          />
          <span
            className="eyebrow"
            style={{
              fontSize: "10px",
              color: "var(--color-teagreen)",
              letterSpacing: "0.14em",
            }}
          >
            Live
          </span>
        </span>
      </div>

      {/* Stat rows */}
      <ul className="list-none">
        {stats.map((s, i) => (
          <StatRow key={s.label} stat={s} animate={revealed} index={i} />
        ))}
      </ul>
    </div>
  );
}

/* --------------------------- StatRow ---------------------------- */

function StatRow({
  stat,
  animate,
  index,
}: {
  stat: Stat;
  animate: boolean;
  index: number;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!animate) return;
    // rAF-driven count-up from 0 → target with ease-out cubic. Per
    // the constitution's motion budget: impact stats count up once
    // when scrolled into view.
    const duration = 1600;
    const delay = 260 + index * 140;
    const start = performance.now() + delay;
    let raf = 0;
    const step = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(step);
        return;
      }
      const t = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(stat.target * eased);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setCurrent(stat.target);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animate, stat.target, index]);

  return (
    <li
      className="flex items-center justify-between"
      style={{
        padding: "clamp(1rem, 1.4vw, 1.25rem) clamp(1.5rem, 2vw, 2rem)",
        borderBottom:
          "1px solid color-mix(in srgb, var(--color-parchment) 8%, transparent)",
      }}
    >
      <span
        style={{
          fontSize: "clamp(14px, 0.95vw, 15px)",
          color: "rgba(242, 239, 234, 0.72)",
        }}
      >
        {stat.label}
      </span>
      <span
        style={{
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
          fontSize: "clamp(17px, 1.4vw, 20px)",
          fontWeight: 700,
          color: "var(--color-parchment)",
          letterSpacing: "-0.01em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {stat.format(current)}
      </span>
    </li>
  );
}
