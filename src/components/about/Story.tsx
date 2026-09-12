/**
 * About §4 — Our story.
 *
 * Two beats stacked:
 *   1. Editorial founder chapter (eyebrow → shimmering h2 → prose)
 *   2. Timeline growth-bar chart matching the Figma — a row of
 *      vertical bars, one per year, that grow in height on scroll.
 *
 * Interactions:
 *   - Timeline animation resets every time the section leaves and
 *     re-enters the viewport (not once-only).
 *   - Hovering a bar reveals a small tooltip above it with a short
 *     detail on what happened that year.
 *
 * Motion:
 *   - Header + prose fade up (once)
 *   - Timeline bars grow via CSS transform on `.story-bar` with
 *     per-bar animation-delay tied to their index — replays every
 *     time the section is scrolled back into view.
 * Respects prefers-reduced-motion.
 */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import airupMascot from "../../../public/images/airup-mascot.png";

type Milestone = {
  year: string;
  // Relative bar height 0.15 → 1.0. Not literal counts; shape of the
  // growth curve. Tuned so the chart reads as a steady climb with a
  // pronounced jump in the last two bars (the future vision).
  height: number;
  label: string;
  detail: string;
};

const milestones: Milestone[] = [
  {
    year: "2020",
    height: 0.18,
    label: "Founded",
    detail:
      "HealthPort founded in Lagos with a single mission: no patient should die from an oxygen shortage.",
  },
  {
    year: "2022",
    height: 0.34,
    label: "First plant",
    detail:
      "First on-site oxygen plant commissioned and delivered to a partner hospital.",
  },
  {
    year: "2024",
    height: 0.52,
    label: "State expansion",
    detail:
      "Managed oxygen service expanded across public and private facilities in Lagos and Edo States.",
  },
  {
    year: "2026",
    height: 0.68,
    label: "47 facilities",
    detail:
      "47 facilities served with continuous supply, real-time monitoring, and clinician training.",
  },
  {
    year: "2030",
    height: 0.82,
    label: "Regional scale",
    detail:
      "Vision milestone: regional reach across West Africa, with OxyIntel operating as the intelligence backbone.",
  },
  {
    year: "2035",
    height: 1.0,
    label: "10,000+ hospitals",
    detail:
      "Vision milestone: 10,000+ hospitals with reliable oxygen access. 100,000+ lives saved every year.",
  },
];

export function Story() {
  const rootRef = useRef<HTMLElement>(null);
  const [headerRevealed, setHeaderRevealed] = useState(false);
  // Timeline is a separate state that toggles with visibility, so
  // the bars re-animate every time the reader scrolls back to it.
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineActive, setTimelineActive] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduced) {
      setHeaderRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Live intersection watcher for the timeline chart — toggles the
  // active state so bars re-run their grow animation each time.
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduced) {
      setTimelineActive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        // Toggle both ways: enter → active, exit → inactive so the
        // next re-entry re-plays the animation.
        setTimelineActive(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className="w-full"
      aria-label="Our story"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        {/* Header */}
        <div
          className="max-w-4xl"
          style={{
            marginBottom: "clamp(2.5rem, 3vw, 3.5rem)",
            opacity: headerRevealed ? 1 : 0,
            transform: headerRevealed
              ? "translateY(0)"
              : "translateY(10px)",
            transition:
              "opacity 620ms cubic-bezier(0.22, 1, 0.36, 1), transform 620ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          data-parallax="-0.06"
        >
          <p
            className="eyebrow"
            style={{
              color: "var(--color-violet)",
              marginBottom: "clamp(1.5rem, 2vw, 2rem)",
            }}
          >
            Our story
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 1.6rem + 2.2vw, 3.5rem)",
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              color: "var(--color-heading)",
              margin: 0,
              textWrap: "balance",
            }}
          >
            It started with a death that{" "}
            <span className="oxygen-word">didn&rsquo;t have to happen</span>
            .
          </h2>
        </div>

        {/* Prose */}
        <div
          className="max-w-2xl"
          style={{
            marginBottom: "clamp(4rem, 6vw, 6rem)",
            opacity: headerRevealed ? 1 : 0,
            transform: headerRevealed
              ? "translateY(0)"
              : "translateY(10px)",
            transition:
              "opacity 620ms cubic-bezier(0.22, 1, 0.36, 1) 180ms, transform 620ms cubic-bezier(0.22, 1, 0.36, 1) 180ms",
          }}
        >
          <p
            style={{
              fontSize: "clamp(15px, 1vw, 17px)",
              lineHeight: 1.7,
              color: "var(--color-fg)",
              margin: 0,
              marginBottom: "clamp(1.75rem, 2vw, 2.25rem)",
            }}
          >
            HealthPort started with a preventable loss. A patient in a
            Nigerian hospital died because reliable oxygen wasn&rsquo;t
            there when it was needed. Not because oxygen didn&rsquo;t
            exist, but because the system to deliver it consistently
            wasn&rsquo;t in place.
          </p>
          <p
            style={{
              fontSize: "clamp(15px, 1vw, 17px)",
              lineHeight: 1.7,
              color: "var(--color-fg)",
              margin: 0,
            }}
          >
            We set out to build the infrastructure that removes that
            failure mode for good, so hospitals never have to think about
            oxygen availability again.
          </p>
        </div>

        {/* Timeline growth-bar chart */}
        <div ref={timelineRef}>
          <Timeline active={timelineActive} />
        </div>

        {/* AirUp inline highlight — closing beat of the story. Ties
            the community-facing brand back into the founding arc:
            "AirUp is part of what we've built." Small editorial
            callout (not a full section — the dedicated AirUp chapter
            lives later on the page). */}
        <div
          className="flex flex-col md:flex-row items-center gap-6 md:gap-8"
          style={{
            marginTop: "clamp(4rem, 6vw, 6rem)",
            padding: "clamp(1.5rem, 2.4vw, 2.25rem)",
            borderRadius: "clamp(18px, 1.8vw, 22px)",
            background:
              "color-mix(in srgb, var(--color-sunny) 22%, var(--color-parchment))",
            border:
              "1px solid color-mix(in srgb, var(--color-teal) 18%, var(--color-keyline))",
          }}
          data-parallax="-0.04"
        >
          {/* Mascot — floats subtly on the same 6s cycle used in the
              main AirUp section. */}
          <div
            className="airup-float relative flex-shrink-0"
            style={{
              width: "clamp(100px, 12vw, 150px)",
              aspectRatio: "10 / 11",
            }}
          >
            <Image
              src={airupMascot}
              alt="AirUp mascot"
              fill
              sizes="150px"
              placeholder="blur"
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Text */}
          <div className="flex-1 flex flex-col text-center md:text-left">
            <p
              className="eyebrow mb-2"
              style={{
                color: "var(--color-teal)",
                fontSize: "10px",
                letterSpacing: "0.16em",
              }}
            >
              AirUp
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(17px, 1.3vw, 20px)",
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                color: "var(--color-heading)",
                margin: 0,
                marginBottom: "0.5rem",
                textWrap: "balance",
              }}
            >
              And along the way, we built AirUp.
            </p>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.55,
                color: "var(--color-fg)",
                opacity: 0.78,
                margin: 0,
                maxWidth: "48ch",
              }}
            >
              HealthPort&rsquo;s community-facing brand, focused on
              making respiratory support approachable, reassuring, and
              accessible to patients and communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Timeline ---------------------------- */

function Timeline({ active }: { active: boolean }) {
  return (
    <div>
      {/* Timeline sub-header */}
      <div
        className="max-w-3xl"
        style={{ marginBottom: "clamp(2rem, 2.5vw, 2.75rem)" }}
      >
        <p
          className="eyebrow"
          style={{
            color: "var(--color-violet)",
            marginBottom: "0.85rem",
          }}
        >
          Timeline
        </p>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--color-heading)",
            margin: 0,
          }}
        >
          How HealthPort started, and where it&rsquo;s going.
        </h3>
      </div>

      {/* Chart — flex row of bar columns. Bars grow whenever `active`
          becomes true (i.e. each time the section re-enters view). */}
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${milestones.length}, 1fr)`,
          columnGap: "clamp(0.5rem, 1.2vw, 1.25rem)",
          height: "clamp(340px, 36vw, 480px)",
        }}
      >
        {milestones.map((m, i) => (
          <BarColumn
            key={m.year}
            milestone={m}
            index={i}
            active={active}
          />
        ))}
      </div>
    </div>
  );
}

/* --------------------------- BarColumn ---------------------------- */

function BarColumn({
  milestone,
  index,
  active,
}: {
  milestone: Milestone;
  index: number;
  active: boolean;
}) {
  // Bars scale in sequence: base 400ms delay + 140ms per bar.
  const delay = 400 + index * 140;
  const [hovered, setHovered] = useState(false);
  // The bar area itself is the top ~78% of the column; the axis +
  // year label occupy the bottom 22%. Bar heights inside the bar
  // area are relative percentages of that region, so the tallest
  // milestone (1.0) still leaves headroom for the label above it.
  return (
    <div
      className="flex flex-col items-center h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="group"
      aria-label={`${milestone.year}: ${milestone.label}`}
    >
      {/* Bar area — flex-1 so it fills the column above the axis;
          bar aligns to its bottom edge. */}
      <div
        className="flex-1 w-full flex flex-col justify-end items-center relative"
        style={{ minHeight: 0 }}
      >
        {/* Milestone label — sits above the bar */}
        <span
          className="text-center mb-2"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(10px, 0.85vw, 12px)",
            fontWeight: 600,
            lineHeight: 1.25,
            letterSpacing: "-0.005em",
            color: "var(--color-fg)",
            opacity: active ? 0.75 : 0,
            transform: active ? "translateY(0)" : "translateY(4px)",
            transition: `opacity 500ms cubic-bezier(0.22, 1, 0.36, 1) ${
              delay + 200
            }ms, transform 500ms cubic-bezier(0.22, 1, 0.36, 1) ${
              delay + 200
            }ms`,
          }}
        >
          {milestone.label}
        </span>

        {/* Bar wrapper — carries the bar's actual height. Tooltip is
            anchored to this wrapper's top edge so it always sits
            right on top of the visible bar, regardless of height. */}
        <div
          className="relative w-full flex justify-center"
          style={{
            height: `${milestone.height * 88}%`,
          }}
        >
          {/* Tooltip — bottom: 100% of the bar wrapper puts its
              bottom edge exactly at the top of the bar. 8px lift-in
              on hover so it sits with a small breath above the bar. */}
          <div
            aria-hidden={!hovered}
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              marginBottom: "10px",
              transform: hovered
                ? "translate(-50%, -4px)"
                : "translate(-50%, 0)",
              width: "clamp(200px, 16vw, 240px)",
              padding: "0.75rem 0.9rem",
              background: "var(--color-ink)",
              color: "var(--color-parchment)",
              borderRadius: "10px",
              opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? "auto" : "none",
              transition:
                "opacity 220ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
              zIndex: 10,
            }}
          >
            <p
              className="eyebrow"
              style={{
                fontSize: "9px",
                color: "var(--color-teagreen)",
                marginBottom: "0.25rem",
              }}
            >
              {milestone.year} · {milestone.label}
            </p>
            <p
              style={{
                fontSize: "12px",
                lineHeight: 1.4,
                color: "rgba(242, 239, 234, 0.85)",
                margin: 0,
              }}
            >
              {milestone.detail}
            </p>
            {/* Downward triangle notch */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: "50%",
                bottom: "-6px",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid var(--color-ink)",
              }}
            />
          </div>

          {/* The bar — Violet by default, deep-Violet on hover.
              Scales from 0 → 1 on `active` transitions. Fatter than
              the previous 64px cap — bars now fill the column up to
              a much wider clamp. */}
          <div
            className="w-full rounded-t-md cursor-pointer"
            style={{
              maxWidth: "clamp(64px, 9vw, 120px)",
              height: "100%",
              background: hovered
                ? "var(--color-violet-deep, var(--color-violet))"
                : "var(--color-violet)",
              transformOrigin: "bottom",
              transform: active ? "scaleY(1)" : "scaleY(0)",
              transition: `transform 900ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, background 220ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          />
        </div>
      </div>

      {/* Axis hairline — spans the column, sits directly under the
          bar area. */}
      <div
        className="w-full"
        style={{
          height: "1px",
          background: "var(--color-keyline)",
        }}
      />

      {/* Year — Teal, sits BELOW the axis in normal flex flow so it's
          never obscured by the bar. */}
      <span
        className="text-center"
        style={{
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
          fontSize: "clamp(12px, 0.95vw, 14px)",
          fontWeight: 700,
          letterSpacing: "-0.005em",
          color: "var(--color-teal)",
          fontVariantNumeric: "tabular-nums",
          paddingTop: "0.75rem",
          paddingBottom: "0.25rem",
          opacity: active ? 1 : 0,
          transition: `opacity 500ms cubic-bezier(0.22, 1, 0.36, 1) ${
            delay + 100
          }ms`,
        }}
      >
        {milestone.year}
      </span>
    </div>
  );
}
