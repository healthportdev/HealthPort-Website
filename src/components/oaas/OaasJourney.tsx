/**
 * OaaS §5 — Customer Journey.
 *
 * Dark Ink chapter. Two-column split: header + outcome + CTA hang LEFT
 * (visible while the reader scans the steps), 4 numbered steps stack
 * vertically on the RIGHT connected by a thin Tea-Green rail that runs
 * top → bottom through all four discs — the "vertical journey" metaphor
 * without the horizontal-band constraint.
 *
 * Motion: rail draws in top → bottom on section reveal, each step card
 * fades up with a stagger. Respects prefers-reduced-motion.
 */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import oxygenValve from "../../../public/images/oxygen-valve.png";

type Step = {
  n: string;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    n: "01",
    title: "Discover",
    body: "Free assessment of your needs, infrastructure, and patient volume.",
  },
  {
    n: "02",
    title: "Design",
    body: "We design a tailored oxygen infrastructure blueprint for your facility.",
  },
  {
    n: "03",
    title: "Deploy",
    body: "Installation, testing, and staff training completed in 30 days or less.",
  },
  {
    n: "04",
    title: "Optimize",
    body: "Continuous performance tuning driven by OxyIntel data.",
  },
];

export function OaasJourney() {
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
      className="w-full relative overflow-hidden"
      aria-label="Customer journey"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-parchment)",
        paddingBlock: "var(--spacing-section)",
      }}
    >
      {/* Bleed valve — mirror of the home page's OxygenGap treatment,
          anchored to the RIGHT viewport edge. Wrapped in an OUTER
          parallax container (data-parallax owns transform: translate3d)
          so the valve drifts on scroll; the INNER div keeps the
          scaleX(-1) mirror since we can't share transform with parallax.
          The parallax container is OVERSIZED (bigger footprint, deeper
          negative anchors on right + bottom) so that parallax
          translation stays inside the safe zone — section overflow:
          hidden still clips the "spare" bleed, so we never see the
          container's own edge revealed as a flat crop line. Follows
          Parallax.tsx's own docs: element should be larger than its
          intended visible area. */}
      <div
        aria-hidden="true"
        data-parallax="-0.15"
        className="hidden md:block absolute pointer-events-none"
        style={{
          right: "-7vw",
          bottom: "-9vw",
          width: "clamp(720px, 78vw, 1200px)",
          aspectRatio: "800 / 501",
          opacity: 0.55,
          zIndex: 0,
        }}
      >
        <div
          className="absolute inset-0"
          style={{ transform: "scaleX(-1)" }}
        >
          <Image
            src={oxygenValve}
            alt=""
            fill
            sizes="(min-width: 768px) 78vw, 0px"
            placeholder="blur"
            priority={false}
            style={{ objectFit: "contain", objectPosition: "left bottom" }}
          />
        </div>
      </div>

      <div className="container-page relative" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 md:gap-20 items-start">
          {/* LEFT — header + outcome + CTA. Stays visible while the
              reader works through the steps on the right. */}
          <div className="md:sticky md:top-24">
            {/* Eyebrow — muted Parchment, not Tea-Green, so the accent
                colour is reserved for the punchline + CTA. */}
            <p
              className="eyebrow mb-5"
              style={{
                color: "rgba(242, 239, 234, 0.62)",
              }}
            >
              Customer journey
            </p>

            {/* H2 — custom-sized so it stays punchy at ~48-64px instead
                of maxing out and forcing awkward two-line wraps. */}
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
              Four steps.{" "}
              <span style={{ color: "var(--color-teagreen)" }}>
                One outcome.
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
              From first conversation to permanent peace of mind.
            </p>
          </div>

          {/* RIGHT — vertical steps connected by a Tea-Green rail. */}
          <div className="relative">
            {/* Connecting rail — muted Parchment dashed line (not Tea-
                Green). Keeps the accent colour concentrated on the
                punchline + CTA instead of shouting from the rail too. */}
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
                  {/* Number disc — OUTLINED Parchment (not filled Tea-
                      Green). Ink halo still hides the rail behind the
                      disc so the vertical line reads clean. */}
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
                    {/* Step titles — smaller and quieter than the h2,
                        so hierarchy reads: h2 > step titles > body.
                        Weight 600 (not 700) to sit under the section h2. */}
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

