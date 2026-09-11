/**
 * Hospital Solutions §7 — Onboarding: from first call to first delivery.
 *
 * Reuses the exact OaaS `OaasJourney` layout pattern — dark Ink
 * chapter, 2-col split (5fr sticky editorial header on the left, 7fr
 * numbered steps on the right connected by a dashed Parchment rail),
 * per-step numbered outlined disc that punches through the rail with
 * an Ink halo. Text kept as it was; only the visual grammar swaps.
 *
 * Motion:
 *   - Header drifts via data-parallax
 *   - Rail draws in top → bottom on section reveal (scaleY)
 *   - Each step card fades up with a per-step stagger
 * Respects prefers-reduced-motion.
 */
"use client";

import { useEffect, useRef, useState } from "react";

type Step = {
  n: string;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    n: "01",
    title: "First conversation",
    body: "We understand your facility, current supply arrangements, and where oxygen breaks down for you today.",
  },
  {
    n: "02",
    title: "On-site assessment",
    body: "Our engineers walk your wards, storage, and reticulation. We map demand against capacity.",
  },
  {
    n: "03",
    title: "Solution + agreement",
    body: "We propose infrastructure and service terms tuned to your operations. Usage-based commercials.",
  },
  {
    n: "04",
    title: "First delivery",
    body: "Cylinders arrive, monitoring is enabled, clinicians are trained, the partnership begins.",
  },
];

export function Onboarding() {
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
      className="w-full relative overflow-hidden"
      aria-label="Onboarding — from first call to first delivery"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-parchment)",
        paddingBlock: "var(--spacing-section)",
      }}
    >
      <div className="container-page relative" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 md:gap-20 items-start">
          {/* LEFT — sticky editorial header. No data-parallax (transform
              breaks sticky positioning). */}
          <div className="md:sticky md:top-24">
            <p
              className="eyebrow mb-5"
              style={{ color: "rgba(242, 239, 234, 0.62)" }}
            >
              Onboarding
            </p>

            <h2
              className="mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.25rem, 1.5rem + 3vw, 3.75rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontWeight: 700,
                color: "var(--color-parchment)",
                textWrap: "balance",
              }}
            >
              From first call to{" "}
              <span style={{ color: "var(--color-teagreen)" }}>
                first delivery.
              </span>
            </h2>

            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.6,
                color: "rgba(242, 239, 234, 0.72)",
                margin: 0,
                maxWidth: "34ch",
              }}
            >
              A hospital that stops worrying about oxygen.
            </p>
          </div>

          {/* RIGHT — vertical steps connected by a dashed Parchment
              rail. Draws in top → bottom on section reveal. */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                left: "18px",
                top: "40px",
                bottom: "40px",
                width: "1.5px",
                background:
                  "repeating-linear-gradient(to bottom, rgba(242, 239, 234, 0.28) 0, rgba(242, 239, 234, 0.28) 4px, transparent 4px, transparent 8px)",
                transformOrigin: "top",
                transform: revealed ? "scaleY(1)" : "scaleY(0)",
                transition:
                  "transform 1400ms cubic-bezier(0.22, 1, 0.36, 1) 200ms",
              }}
            />

            <ol className="list-none flex flex-col gap-9 md:gap-11 relative">
              {steps.map((s, i) => (
                <li
                  key={s.n}
                  className="grid grid-cols-[38px_1fr] gap-5 md:gap-7 items-start"
                  style={{
                    opacity: revealed ? 1 : 0,
                    transform: revealed
                      ? "translateY(0)"
                      : "translateY(10px)",
                    transition: `opacity 560ms cubic-bezier(0.22, 1, 0.36, 1) ${
                      500 + i * 180
                    }ms, transform 560ms cubic-bezier(0.22, 1, 0.36, 1) ${
                      500 + i * 180
                    }ms`,
                  }}
                >
                  {/* Numbered disc — outlined Parchment, Ink halo
                      hides the dashed rail behind it so the vertical
                      line reads clean through the whole column. */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      background: "var(--color-ink)",
                      border: "1.5px solid rgba(242, 239, 234, 0.55)",
                      color: "var(--color-parchment)",
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                      boxShadow: "0 0 0 4px var(--color-ink)",
                      flexShrink: 0,
                    }}
                  >
                    {s.n}
                  </div>

                  <div style={{ paddingTop: "0.2rem" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(18px, 1.4vw, 20px)",
                        fontWeight: 600,
                        lineHeight: 1.2,
                        letterSpacing: "-0.005em",
                        color: "var(--color-parchment)",
                        margin: 0,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "clamp(14px, 0.95vw, 15px)",
                        lineHeight: 1.55,
                        color: "rgba(242, 239, 234, 0.7)",
                        margin: 0,
                        maxWidth: "42ch",
                      }}
                    >
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
