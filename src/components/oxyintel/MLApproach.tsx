/**
 * OxyIntel §5 — Built on intelligence.
 *
 * Apple-style monumental slide: small Violet eyebrow, huge two-line
 * headline (Ink → Violet punchline), one clean paragraph beneath.
 * All centred, generous vertical whitespace, no imagery — the type
 * itself carries the argument. Fades up on scroll reveal with a
 * short eyebrow → headline → sub stagger. Respects
 * prefers-reduced-motion.
 */
"use client";

import { useEffect, useRef, useState } from "react";

export function MLApproach() {
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
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className="w-full flex items-center justify-center"
      aria-label="Built on intelligence"
      style={{
        paddingBlock: "clamp(6rem, 15vh, 14rem)",
        minHeight: "70vh",
      }}
    >
      <div className="container-page w-full">
        <div
          className="flex flex-col items-center text-center mx-auto max-w-5xl"
          data-parallax="-0.05"
        >
          {/* Eyebrow */}
          <p
            className="eyebrow mb-6 md:mb-8"
            style={{
              color: "var(--color-violet)",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(6px)",
              transition:
                "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            Built on intelligence
          </p>

          {/* Monumental Apple-style headline — a two-beat statement.
              Line 1 poses the reveal, line 2 lands the honesty in
              Violet. */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              // Toned down from clamp(2.75rem, 7vw, 7rem) — was
              // competing with the page h1. Now 44px → 64px so it's
              // still a monumental statement but visibly smaller than
              // the hero on wide desktop.
              fontSize: "clamp(2.25rem, 4vw, 4rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              fontWeight: 700,
              color: "var(--color-heading)",
              margin: 0,
              marginBottom: "clamp(2.5rem, 4vw, 3.5rem)",
              textWrap: "balance",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(14px)",
              transition:
                "opacity 720ms cubic-bezier(0.22, 1, 0.36, 1) 140ms, transform 720ms cubic-bezier(0.22, 1, 0.36, 1) 140ms",
            }}
          >
            Built to keep oxygen
            <br />
            <span style={{ color: "var(--color-violet)" }}>
              one step ahead.
            </span>
          </h2>

          {/* Sub — public-facing framing: outcomes, not architecture.
              The detailed model / sensor stack lives in the investor
              deck, not on the marketing site (per stakeholder review). */}
          <p
            style={{
              fontSize: "clamp(15px, 1.15vw, 18px)",
              lineHeight: 1.55,
              color: "var(--color-muted)",
              maxWidth: "56ch",
              margin: 0,
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(6px)",
              transition:
                "opacity 620ms cubic-bezier(0.22, 1, 0.36, 1) 320ms, transform 620ms cubic-bezier(0.22, 1, 0.36, 1) 320ms",
            }}
          >
            OxyIntel learns your facility&rsquo;s usage patterns and flags
            supply risk before it becomes a shortage — so your team plans
            refills and maintenance instead of reacting to them.
          </p>
        </div>
      </div>
    </section>
  );
}
