/**
 * OaaS §7 — Is your hospital eligible for OaaS?
 *
 * Layout borrowed from peekpile.io's closing card (pill badge → big
 * centered statement → body → subtle grid background), but content
 * stays about eligibility. No CTAs — the primary "Book an Assessment"
 * lives in the site-wide footer and repeating it here would be noise.
 * The four qualifying criteria sit in a full-sentence 2×2 grid beneath
 * the header.
 *
 * Motion: pill + statement fade up first, then each criterion tile
 * staggers in. Respects prefers-reduced-motion.
 */
"use client";

import { useEffect, useRef, useState } from "react";

// Four qualifying criteria — the same full-sentence signals that
// appeared in the design brief and the earlier 2×2 grid version.
const criteria = [
  "Facility admits patients requiring supplemental oxygen on a regular basis",
  "Located within a serviceable region for scheduled maintenance visits",
  "Current oxygen supply is cylinder-based, piped, or a mix of both",
  "Willing to move from capital equipment ownership to a managed service",
];

export function Eligibility() {
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
      aria-label="Is your hospital eligible for Oxygen as a Service"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-parchment)",
        paddingBlock: "var(--spacing-section)",
      }}
    >
      {/* Grid pattern background — subtle, sits behind everything. Same
          device peekpile uses to give a dark surface texture without
          decoration. Uses masked opacity so the grid fades at edges. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(rgba(242, 239, 234, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(242, 239, 234, 0.045) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.4) 65%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.4) 65%, transparent 100%)",
          zIndex: 0,
        }}
      />

      <div className="container-page relative" style={{ zIndex: 1 }}>
        <div
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
          data-parallax="-0.08"
        >
          {/* Pill badge — same shape peekpile uses. Sets the conversion
              mood: "you're ready, we're ready." */}
          <span
            style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              background: "rgba(242, 239, 234, 0.06)",
              border: "1px solid rgba(242, 239, 234, 0.18)",
              fontFamily: "var(--font-display)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(242, 239, 234, 0.85)",
              marginBottom: "1.75rem",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(6px)",
              transition:
                "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: "80ms",
            }}
          >
            Eligibility
          </span>

          {/* Big centered statement — Tea-Green punchline on "eligible"
              so the qualifying word gets the accent. */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 1.5rem + 4vw, 4.5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              fontWeight: 700,
              color: "var(--color-parchment)",
              margin: 0,
              marginBottom: "1.25rem",
              textWrap: "balance",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(8px)",
              transition:
                "opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), transform 560ms cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: "220ms",
            }}
          >
            Is your hospital{" "}
            <span style={{ color: "var(--color-teagreen)" }}>eligible</span>{" "}
            for OaaS?
          </h2>

          {/* Body — describes what the criteria are checking against, so
              the checkmark row that follows reads as answers to it. */}
          <p
            style={{
              fontSize: "clamp(15px, 1.1vw, 17px)",
              lineHeight: 1.55,
              color: "rgba(242, 239, 234, 0.72)",
              margin: 0,
              marginBottom: "2rem",
              maxWidth: "44ch",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(6px)",
              transition:
                "opacity 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: "360ms",
            }}
          >
            If any of these fit your facility, we can build the right
            OaaS setup around it.
          </p>

          {/* Qualifying criteria — full-sentence 2×2 grid, centered
              under the header. Each tile has a Tea-Green disc + the
              criterion. Same content as the design brief. */}
          <div
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-2"
            style={{ maxWidth: "56rem" }}
          >
            {criteria.map((item, i) => (
              <div
                key={item}
                className="flex items-start gap-3 text-left"
                style={{
                  background: "rgba(242, 239, 234, 0.05)",
                  border: "1px solid rgba(242, 239, 234, 0.12)",
                  borderRadius: "clamp(14px, 1.4vw, 18px)",
                  padding: "clamp(1.25rem, 2vw, 1.75rem)",
                  opacity: revealed ? 1 : 0,
                  transform: revealed
                    ? "translateY(0)"
                    : "translateY(8px)",
                  transition: `opacity 520ms cubic-bezier(0.22, 1, 0.36, 1) ${
                    500 + i * 110
                  }ms, transform 520ms cubic-bezier(0.22, 1, 0.36, 1) ${
                    500 + i * 110
                  }ms`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center"
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--color-teagreen)",
                    flexShrink: 0,
                    marginTop: "0.15rem",
                  }}
                >
                  <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
                    <path
                      d="M1.5 6l3.5 3.5 6.5-8"
                      stroke="var(--color-ink)"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  style={{
                    fontSize: "clamp(15px, 1.05vw, 16.5px)",
                    lineHeight: 1.5,
                    color: "var(--color-parchment)",
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

