/**
 * OxyIntel §4 — What's coming.
 *
 * Scroll-driven roadmap timeline. As the reader scrolls through the
 * section, the Teal thread's height tracks a "reveal line" fixed
 * ~60% down the viewport; each row (phase marker or item) fades in
 * only when the thread reaches its marker's Y position. Nothing
 * appears prematurely, nothing hangs there idle — the timeline
 * unfolds as the user reads it.
 *
 * Right column is deliberately tight: smaller titles, tighter body
 * copy, one-line hints. All motion is respecfully gated on
 * prefers-reduced-motion — the reduced-motion path shows everything
 * expanded up front.
 */
"use client";

import { useEffect, useRef, useState } from "react";

type PhaseRow = {
  kind: "phase";
  key: string;
  number: string;
  label: string;
  hint: string;
};

type ItemRow = {
  kind: "item";
  key: string;
  name: string;
  body: string;
};

type Row = PhaseRow | ItemRow;

const rows: Row[] = [
  {
    kind: "phase",
    key: "p-next",
    number: "01",
    label: "Next up",
    hint: "Nearest shipping horizon.",
  },
  {
    kind: "item",
    key: "oxydash",
    name: "OxyDash",
    body: "Operational dashboards for hospital administrators.",
  },
  {
    kind: "item",
    key: "advanced-ai",
    name: "Advanced demand AI",
    body: "Deeper ML models fed by connected sensors.",
  },
  {
    kind: "phase",
    key: "p-works",
    number: "02",
    label: "In the works",
    hint: "Building, testing, partner pilots.",
  },
  {
    kind: "item",
    key: "oxysense",
    name: "OxySense",
    body: "Point-of-consumption oxygen usage monitoring.",
  },
  {
    kind: "item",
    key: "predictive",
    name: "Predictive maintenance",
    body: "Catch equipment wear before it disrupts supply.",
  },
  {
    kind: "phase",
    key: "p-exploring",
    number: "03",
    label: "Exploring",
    hint: "Research and scoping.",
  },
  {
    kind: "item",
    key: "cv",
    name: "Computer vision",
    body: "Cylinder tracking via image recognition.",
  },
  {
    kind: "item",
    key: "patient",
    name: "Patient-facing services",
    body: "Respiratory care support beyond hospital walls.",
  },
];

export function WhatsComing() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  useEffect(() => {
    const reducedMedia = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // Reduced motion: reveal everything, fill the thread all the way.
    const applyReduced = () => {
      setRevealed(new Set(rows.map((_, i) => i)));
      if (threadRef.current) {
        threadRef.current.style.transform = "scaleY(1)";
      }
    };

    if (reducedMedia.matches) {
      applyReduced();
      const handler = () => {
        if (reducedMedia.matches) applyReduced();
      };
      reducedMedia.addEventListener("change", handler);
      return () => reducedMedia.removeEventListener("change", handler);
    }

    let raf = 0;
    const update = () => {
      const timeline = timelineRef.current;
      const thread = threadRef.current;
      if (!timeline || !thread) return;

      const rect = timeline.getBoundingClientRect();
      // A fixed "reveal line" ~60% down the viewport. The thread's
      // bottom tracks this line as the reader scrolls.
      const revealLineY = window.innerHeight * 0.6;
      const scrolledInto = revealLineY - rect.top;
      const progress = Math.max(
        0,
        Math.min(1, scrolledInto / rect.height)
      );

      // Update the thread imperatively so this doesn't trigger a
      // React re-render on every scroll frame.
      thread.style.transform = `scaleY(${progress})`;

      // Recompute which rows are revealed (marker's top has passed
      // the reveal line).
      const nextRevealed = new Set<number>();
      markerRefs.current.forEach((el, i) => {
        if (!el) return;
        const markerRect = el.getBoundingClientRect();
        if (markerRect.top < revealLineY) nextRevealed.add(i);
      });

      // Only setState when the set changes, to avoid re-renders on
      // pure scroll motion.
      setRevealed((prev) => {
        if (
          prev.size === nextRevealed.size &&
          [...prev].every((x) => nextRevealed.has(x))
        ) {
          return prev;
        }
        return nextRevealed;
      });
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      className="w-full"
      aria-label="What's coming — the roadmap"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 md:gap-20 items-start">
          {/* LEFT — sticky editorial header. Note: no data-parallax
              here — transform breaks position:sticky. The scroll-
              driven timeline on the right already carries the section's
              motion, so the left header sits still. */}
          <div className="md:sticky md:top-24">
            <p
              className="eyebrow mb-5"
              style={{ color: "var(--color-violet)" }}
            >
              What&rsquo;s coming
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.25rem, 1.5rem + 3vw, 3.5rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontWeight: 700,
                color: "var(--color-heading)",
                textWrap: "balance",
              }}
            >
              The roadmap.{" "}
              <span style={{ color: "var(--color-violet)" }}>
                Honest about what&rsquo;s next.
              </span>
            </h2>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.6,
                color: "var(--color-muted)",
                margin: 0,
                maxWidth: "34ch",
              }}
            >
              Directional, not promised. We ship when it&rsquo;s ready —
              and we&rsquo;d rather admit uncertainty than sell a date.
            </p>
          </div>

          {/* RIGHT — scroll-driven timeline */}
          <div ref={timelineRef} className="relative">
            {/* Thread — scaleY driven imperatively by scroll listener */}
            <div
              aria-hidden
              ref={threadRef}
              className="absolute pointer-events-none"
              style={{
                left: "9px",
                top: "16px",
                bottom: "16px",
                width: "1.5px",
                background: "var(--color-teal)",
                opacity: 0.45,
                transformOrigin: "top",
                transform: "scaleY(0)",
                // Tiny transition so the imperative scaleY updates
                // don't visually stutter between rAF frames.
                transition: "transform 90ms linear",
              }}
            />

            <ol className="list-none flex flex-col gap-7">
              {rows.map((row, i) =>
                row.kind === "phase" ? (
                  <PhaseRowView
                    key={row.key}
                    row={row}
                    revealed={revealed.has(i)}
                    markerRef={(el) => {
                      markerRefs.current[i] = el;
                    }}
                  />
                ) : (
                  <ItemRowView
                    key={row.key}
                    row={row}
                    revealed={revealed.has(i)}
                    markerRef={(el) => {
                      markerRefs.current[i] = el;
                    }}
                  />
                )
              )}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- PhaseRowView ---------------------------- */

function PhaseRowView({
  row,
  revealed,
  markerRef,
}: {
  row: PhaseRow;
  revealed: boolean;
  markerRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <li
      className="grid grid-cols-[20px_1fr] gap-5 items-center"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(6px)",
        transition:
          "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1), transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
        marginTop: "0.5rem",
      }}
    >
      <div
        ref={markerRef}
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "5px",
          background: "var(--color-teal)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-parchment)",
          fontFamily: "var(--font-display)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.02em",
        }}
      >
        {row.number}
      </div>

      <div className="flex flex-col leading-tight">
        <span
          className="eyebrow"
          style={{
            color: "var(--color-teal)",
            fontSize: "10px",
            letterSpacing: "0.14em",
          }}
        >
          {row.label}
        </span>
        <span
          style={{
            fontSize: "12px",
            color: "var(--color-muted)",
            marginTop: "2px",
          }}
        >
          {row.hint}
        </span>
      </div>
    </li>
  );
}

/* --------------------------- ItemRowView ---------------------------- */

function ItemRowView({
  row,
  revealed,
  markerRef,
}: {
  row: ItemRow;
  revealed: boolean;
  markerRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <li
      className="grid grid-cols-[20px_1fr] gap-5 items-start"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(6px)",
        transition:
          "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1), transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div
        ref={markerRef}
        className="flex items-start justify-center pt-1"
      >
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "var(--color-white)",
            border: "2px solid var(--color-teal)",
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "15.5px",
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: "-0.005em",
            color: "var(--color-heading)",
            margin: 0,
          }}
        >
          {row.name}
        </h3>
        <p
          style={{
            fontSize: "13.5px",
            lineHeight: 1.5,
            color: "var(--color-fg)",
            margin: 0,
            opacity: 0.68,
            maxWidth: "44ch",
          }}
        >
          {row.body}
        </p>
      </div>
    </li>
  );
}
