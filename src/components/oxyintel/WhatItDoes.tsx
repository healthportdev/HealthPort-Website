/**
 * OxyIntel §3 — What the platform does.
 *
 * Three cards, each fully filled with its accent color (Teal, Sky
 * Deep, Coral) — no more neutral parchment wells. Scenes are drawn
 * in Parchment on the coloured surface so they read as clean product
 * dashboards, and title/body sit below a thin Parchment divider in
 * Parchment too. Full-bleed colour makes the section feel like a
 * modern SaaS feature deck instead of a neutral icon grid.
 *
 * Scene motion:
 *   · Teal card    — ECG waveform + pulsing halo, ticking SpO₂ value
 *   · Sky Deep    — sparkline with a dot travelling the whole line
 *                    (SMIL animateMotion, gated by reduced-motion)
 *   · Coral       — chat exchange with a typing-dots pill
 *
 * Cards fade up once on reveal (IntersectionObserver, per-card
 * stagger). Every loop respects prefers-reduced-motion.
 */
"use client";

import { useEffect, useId, useRef, useState } from "react";

type Capability = {
  key: string;
  title: string;
  body: string;
  accent: string;
  scene: React.ComponentType<{ accent: string }>;
};

const capabilities: Capability[] = [
  {
    key: "realtime",
    title: "Real-time data",
    body: "IoT sensors continuously monitor cylinder, pipeline, and ward outlet pressure, flow, and valve status in real time.",
    accent: "var(--color-teal)",
    scene: VitalsScene,
  },
  {
    key: "forecasting",
    title: "Forecasting",
    body: "AI predicts oxygen demand with 94% accuracy, 24 hours in advance.",
    accent: "var(--color-sky-deep)",
    scene: SparklineScene,
  },
  {
    key: "clinical",
    title: "Clinical support",
    body: "Ask questions about patient oxygen data and get evidence-based clinical guidance.",
    accent: "var(--color-coral)",
    scene: ChatScene,
  },
];

export function WhatItDoes() {
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
      aria-label="What the platform does"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        {/* Header */}
        <div
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 md:mb-20"
          data-parallax="-0.08"
        >
          <p
            className="eyebrow mb-4"
            style={{ color: "var(--color-violet)" }}
          >
            What the platform does
          </p>
          <h2 className="mb-4" style={{ lineHeight: 1.06 }}>
            From raw sensor{" "}
            <span style={{ color: "var(--color-violet)" }}>data</span> to
            <br />
            <span style={{ color: "var(--color-violet)" }}>
              clinical insight.
            </span>
          </h2>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.55,
              color: "var(--color-muted)",
            }}
          >
            OxyIntel turns every cylinder and reticulation point into a
            live data source, keeping supply ahead of demand.
          </p>
        </div>

        {/* Three fully-coloured cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
          {capabilities.map((c, i) => (
            <CapabilityCard
              key={c.key}
              capability={c}
              index={i}
              revealed={revealed}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Card ---------------------------- */

function CapabilityCard({
  capability,
  index,
  revealed,
}: {
  capability: Capability;
  index: number;
  revealed: boolean;
}) {
  const Scene = capability.scene;
  const { accent } = capability;
  return (
    <article
      className="flex flex-col overflow-hidden"
      style={{
        borderRadius: "24px",
        background: accent,
        color: "var(--color-parchment)",
        minHeight: "clamp(440px, 42vw, 560px)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 580ms cubic-bezier(0.22, 1, 0.36, 1) ${
          140 + index * 130
        }ms, transform 580ms cubic-bezier(0.22, 1, 0.36, 1) ${
          140 + index * 130
        }ms`,
      }}
    >
      {/* Scene — dominant top region, no more inset well */}
      <div
        className="flex-1 flex items-center justify-center"
        style={{
          padding: "clamp(2rem, 2.6vw, 3rem) clamp(1.5rem, 2vw, 2rem)",
        }}
      >
        <Scene accent={accent} />
      </div>

      {/* Thin Parchment divider */}
      <div
        aria-hidden
        style={{
          height: "1px",
          background: "rgba(242, 239, 234, 0.22)",
          marginInline: "clamp(1.5rem, 2vw, 2rem)",
        }}
      />

      {/* Title + body — Parchment on the colour */}
      <div
        style={{
          padding:
            "clamp(1.5rem, 2vw, 2rem) clamp(1.5rem, 2vw, 2rem) clamp(1.75rem, 2.4vw, 2.25rem)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(22px, 1.8vw, 26px)",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.015em",
            color: "var(--color-parchment)",
            margin: 0,
            marginBottom: "0.65rem",
          }}
        >
          {capability.title}
        </h3>
        <p
          style={{
            fontSize: "14.5px",
            lineHeight: 1.55,
            color: "var(--color-parchment)",
            margin: 0,
            opacity: 0.78,
          }}
        >
          {capability.body}
        </p>
      </div>
    </article>
  );
}

/* --------------------------- Scenes ---------------------------- */

/**
 * VitalsScene — ECG-style trace + pulsing halo at the leading edge,
 * with a monospaced value that cycles below. Drawn in Parchment on
 * the accent-coloured card bg.
 */
function VitalsScene({ accent: _accent }: { accent: string }) {
  const values = ["SpO₂ · 94%", "SpO₂ · 97%", "SpO₂ · 92%", "SpO₂ · 96%"];
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduced) return;
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, []);

  const idx = tick % values.length;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      {/* ECG trace — bigger, thicker stroke for presence */}
      <svg
        viewBox="0 0 100 30"
        width="100%"
        fill="none"
        style={{ overflow: "visible", maxWidth: "300px" }}
        aria-hidden
      >
        <polyline
          points="0,15 20,15 25,9 30,22 35,7 40,15 60,15 65,9 70,22 75,7 80,15 100,15"
          stroke="var(--color-parchment)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Pulsing halo + solid dot at the trace's leading edge */}
        <circle
          cx="100"
          cy="15"
          r="3.2"
          fill="var(--color-parchment)"
          className="flow-now-pulse"
        />
        <circle cx="100" cy="15" r="2" fill="var(--color-parchment)" />
      </svg>

      {/* Ticking mono value — larger, more prominent */}
      <span
        key={idx}
        className="chip-value-in"
        style={{
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
          fontSize: "clamp(16px, 1.4vw, 20px)",
          color: "var(--color-parchment)",
          fontWeight: 600,
          letterSpacing: "-0.005em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {values[idx]}
      </span>
    </div>
  );
}

/**
 * SparklineScene — predictive line chart; a Parchment dot travels
 * along the whole line via SMIL animateMotion (gated on
 * prefers-reduced-motion). Below, the forecast tag cycles.
 */
function SparklineScene({ accent: _accent }: { accent: string }) {
  const tags = ["+18% · 2h", "+12% · 4h", "Steady · 6h", "+6% · 8h"];
  const [tick, setTick] = useState(0);
  const [motionOn, setMotionOn] = useState(false);
  const pathId = useId();

  useEffect(() => {
    const mm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotionOn(!mm.matches);
    const handler = () => setMotionOn(!mm.matches);
    mm.addEventListener("change", handler);
    return () => mm.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!motionOn) return;
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, [motionOn]);

  const idx = tick % tags.length;
  const linePath =
    "M 5 22 L 18 20 L 30 22 L 42 16 L 55 18 L 68 12 L 82 10 L 95 4";

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <svg
        viewBox="0 0 100 28"
        width="100%"
        fill="none"
        aria-hidden
        style={{ overflow: "visible", maxWidth: "300px" }}
      >
        {/* Baseline */}
        <line
          x1="5"
          y1="26"
          x2="95"
          y2="26"
          stroke="var(--color-parchment)"
          strokeWidth="0.6"
          strokeDasharray="1 2"
          opacity="0.4"
        />
        {/* Sparkline */}
        <path
          id={pathId}
          d={linePath}
          stroke="var(--color-parchment)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Moving dot */}
        {motionOn && (
          <circle r="2.4" fill="var(--color-parchment)">
            <animateMotion dur="3.2s" repeatCount="indefinite" rotate="0">
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>
        )}
      </svg>

      {/* Forecast tag */}
      <span
        key={idx}
        className="chip-value-in"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(16px, 1.4vw, 20px)",
          color: "var(--color-parchment)",
          fontWeight: 700,
          letterSpacing: "0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {tags[idx]}
      </span>
    </div>
  );
}

/**
 * ChatScene — clean question bubble on the left (Parchment surface,
 * Ink text so it reads as a nurse's message on a colour), a
 * Parchment-tinted typing pill on the right. Dots pulse continuously
 * via the shared `.brain-synapse` keyframe.
 */
function ChatScene({ accent }: { accent: string }) {
  return (
    <div
      className="w-full flex flex-col justify-center gap-3"
      style={{ maxWidth: "320px" }}
    >
      {/* Question bubble — Parchment surface */}
      <div
        style={{
          alignSelf: "flex-start",
          maxWidth: "86%",
          background: "var(--color-parchment)",
          borderRadius: "14px 14px 14px 3px",
          padding: "12px 14px",
          fontFamily: "var(--font-display)",
        }}
      >
        <p
          className="eyebrow mb-1"
          style={{
            fontSize: "9px",
            color: accent,
            opacity: 0.85,
          }}
        >
          Nurse · Ward 4B
        </p>
        <p
          style={{
            fontSize: "13.5px",
            lineHeight: 1.35,
            color: "var(--color-ink)",
            margin: 0,
          }}
        >
          SpO&#8322; 89 &mdash; advice?
        </p>
      </div>

      {/* Typing pill — right-aligned */}
      <div
        style={{
          alignSelf: "flex-end",
          padding: "8px 12px",
          background: "rgba(242, 239, 234, 0.22)",
          border: "1px solid rgba(242, 239, 234, 0.36)",
          borderRadius: "999px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
        aria-hidden
      >
        {[0, 0.2, 0.4].map((d, i) => (
          <span
            key={i}
            className="brain-synapse"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--color-parchment)",
              animationDelay: `${d}s`,
              display: "inline-block",
            }}
          />
        ))}
      </div>
    </div>
  );
}
