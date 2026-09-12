/**
 * OxyIntel Hero — Data → OxyIntel → Insight visualisation.
 *
 * Three raw operational streams on the LEFT feed into a tall Violet
 * OxyIntel core in the MIDDLE, which fans three actionable insights out
 * to the RIGHT. Every 2.8s the metric + insight values cycle so the
 * whole thing feels alive — implying the platform is continuously
 * reading, thinking, and producing verdicts.
 *
 * Motion layers:
 *   - Flowing violet dots on each of the 6 tracks (`.model-flow-dot`,
 *     reused from OaaS ModelFlow)
 *   - Metric + insight values swap in with a small fade-up
 *     (`.chip-value-in`)
 *   - OxyIntel core has a breathing inner glow + three staggered
 *     "processing" dots
 *
 * Everything respects `prefers-reduced-motion` — animations halt but
 * the static layout is fully legible.
 *
 * Sits beyond the strict 6-effect motion budget in CLAUDE.md — flagged
 * consciously, kept because the reader needs to *feel* the intelligence
 * promise this early in the page.
 */
"use client";

import { useEffect, useState } from "react";

/** Icons available to the tile components. */
type IconName = "cylinder" | "flow" | "pulse" | "alert" | "trend" | "check";

/** Cycling raw operational metrics — what OxyIntel ingests. */
const rawStreams = [
  {
    key: "cylinders",
    icon: "cylinder" as IconName,
    label: "Cylinders",
    values: ["214 filled", "198 filled", "241 filled"],
  },
  {
    key: "flow",
    icon: "flow" as IconName,
    label: "Flow",
    values: ["47 L/min", "52 L/min", "43 L/min"],
  },
  {
    key: "spo2",
    icon: "pulse" as IconName,
    label: "SpO₂",
    values: ["94%", "97%", "92%"],
  },
];

/** Starting count for the "insights recorded" tile — an arbitrary
 *  believable baseline the counter grows from. */
const INSIGHT_BASE_COUNT = 247;

/** Rotating latest insights the panel displays — a mix of location +
 *  stat so the reader sees the sort of thing OxyIntel actually
 *  produces, not just a decorative counter. */
const insightPool = [
  { category: "Refill", text: "Zone A · 14 needed" },
  { category: "Demand", text: "ICU · +18% in 2h" },
  { category: "Storage", text: "Wing B · 46 filled" },
  { category: "Triage", text: "3 urgent cases" },
  { category: "Flow", text: "OR-2 · 52 L/min" },
  { category: "Recovery", text: "Ward C · steady" },
];

export function IntelFlow() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;
    const id = setInterval(() => setTick((t) => t + 1), 2800);
    return () => clearInterval(id);
  }, []);

  const idx = tick % 3;
  const insightCount = INSIGHT_BASE_COUNT + tick;
  const insight = insightPool[tick % insightPool.length];

  return (
    <div className="w-full">
      <div
        className="flex items-stretch w-full"
        style={{ gap: "clamp(4px, 0.6vw, 10px)" }}
        role="img"
        aria-label="OxyIntel continuously processes raw operational data (cylinders, flow, SpO₂) into actionable insights: refill, demand, triage."
      >
        {/* LEFT — raw data streams (Ink text on Parchment chips).
            flex-1 so the column grows to fill the container width. */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {rawStreams.map((s) => (
            <RawTile
              key={s.key}
              icon={s.icon}
              label={s.label}
              value={s.values[idx]}
              cycleIdx={idx}
            />
          ))}
        </div>

        {/* FEED IN — 3 curved arrows converging from each left tile
            onto the brain, with dots travelling along each curve. */}
        <FeedFan direction="in" />

        {/* CENTER — brain silhouette on white (no container) */}
        <OxyCore />

        {/* FEED OUT — one straight line from the brain to the single
            InsightPanel on the right, arrowhead at the tile end. */}
        <FeedFan direction="out" />

        {/* RIGHT — one InsightPanel showing the LATEST specific insight
            OxyIntel has produced + a running count of insights this
            shift. Centered vertically so it aligns with the brain. */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <InsightPanel
            count={insightCount}
            category={insight.category}
            text={insight.text}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * LEFT tile — raw operational metric with a small muted icon, an
 * uppercase eyebrow label and a mono value that swaps on each cycle.
 */
function RawTile({
  icon,
  label,
  value,
  cycleIdx,
}: {
  icon: IconName;
  label: string;
  value: string;
  cycleIdx: number;
}) {
  return (
    <div
      className="flex items-center w-full"
      style={{
        gap: "14px",
        padding: "14px 20px",
        borderRadius: "14px",
        background:
          "color-mix(in srgb, var(--color-parchment) 92%, transparent)",
        border: "1px solid var(--color-keyline)",
        height: "68px",
        fontFamily: "var(--font-display)",
      }}
    >
      <span
        aria-hidden
        className="inline-flex items-center justify-center"
        style={{
          width: "26px",
          height: "26px",
          color: "var(--color-muted)",
          flexShrink: 0,
        }}
      >
        <IntelIcon name={icon} />
      </span>
      <div className="flex flex-col leading-tight min-w-0">
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            fontWeight: 700,
            marginBottom: "2px",
          }}
        >
          {label}
        </span>
        <span
          key={cycleIdx}
          className="chip-value-in"
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
            fontSize: "16px",
            color: "var(--color-ink)",
            fontWeight: 600,
            letterSpacing: "-0.005em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

/**
 * RIGHT panel — a single tile that shows the LATEST insight OxyIntel
 * has produced (a location + stat pairing, e.g. "Zone A · 14 needed")
 * plus a running count of insights logged this shift. The category
 * eyebrow and the insight text cycle together with each raw-data
 * tick; the count grows by one per tick — implying "data in →
 * insight out." Minimalist by design: no icons, no clutter.
 */
function InsightPanel({
  count,
  category,
  text,
}: {
  count: number;
  category: string;
  text: string;
}) {
  return (
    <div
      className="flex flex-col w-full"
      style={{
        padding: "22px 26px",
        borderRadius: "16px",
        background:
          "color-mix(in srgb, var(--color-violet) 5%, var(--color-parchment))",
        border:
          "1px solid color-mix(in srgb, var(--color-violet) 22%, var(--color-keyline))",
        fontFamily: "var(--font-display)",
      }}
    >
      {/* Top row — cycling category eyebrow + live pulse dot */}
      <div className="flex items-center justify-between mb-3">
        <span
          key={`cat-${category}`}
          className="chip-value-in"
          style={{
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-violet)",
            fontWeight: 700,
          }}
        >
          {category}
        </span>
        <span
          aria-hidden
          className="brain-synapse"
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--color-violet)",
            display: "inline-block",
            animationDelay: "0s",
          }}
        />
      </div>

      {/* The insight itself — the "what OxyIntel just said" line */}
      <span
        key={`text-${text}`}
        className="chip-value-in"
        style={{
          fontSize: "clamp(20px, 1.9vw, 26px)",
          color: "var(--color-ink)",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.015em",
        }}
      >
        {text}
      </span>

      {/* Running count of insights this shift */}
      <span
        style={{
          fontSize: "12px",
          color: "var(--color-muted)",
          marginTop: "10px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count.toLocaleString()} logged today
      </span>
    </div>
  );
}

/**
 * Rack of three parallel horizontal tracks — same height + gap as the
 * tile columns so each track aligns 1:1 with a tile row.
 */
/**
 * FeedFan — SVG that draws three curved arrows fanning between the
 * tile column and the brain. Feed-in curves CONVERGE from each tile
 * onto the brain's centre; feed-out curves DIVERGE from the brain out
 * to each tile. Small Violet dots animate along each curve via CSS
 * `offset-path`, and an arrowhead marker sits at the terminating end
 * of every curve so the direction of flow is unambiguous.
 *
 * Height is fixed at the same 228px total the tile columns produce
 * (3 × 68 tiles + 2 × 12 gaps) so the curves anchor exactly on the
 * tile row centres (y = 34, 114, 194).
 */
function FeedFan({ direction }: { direction: "in" | "out" }) {
  const WIDTH = 140;
  const HEIGHT = 228;
  const CENTER_Y = HEIGHT / 2;
  const TOP_Y = 34;
  const BOTTOM_Y = 194;

  // The three curves. Cubic Béziers with control points that create
  // graceful S-shapes on the top and bottom rails.
  const paths =
    direction === "in"
      ? [
          // Three curves converging FROM each tile ONTO the brain.
          `M 0 ${TOP_Y}     C 46 ${TOP_Y},    94 ${CENTER_Y}, ${WIDTH} ${CENTER_Y}`,
          `M 0 ${CENTER_Y}  L ${WIDTH} ${CENTER_Y}`,
          `M 0 ${BOTTOM_Y}  C 46 ${BOTTOM_Y}, 94 ${CENTER_Y}, ${WIDTH} ${CENTER_Y}`,
        ]
      : [
          // One straight line from the brain to the single InsightPanel.
          `M 0 ${CENTER_Y}  L ${WIDTH} ${CENTER_Y}`,
        ];

  const dotDelays = [0, 0.6, 1.2];
  const markerId = `fan-arrow-${direction}`;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: WIDTH, height: HEIGHT }}
      aria-hidden
    >
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="absolute inset-0"
        style={{ overflow: "visible" }}
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 Z"
              style={{ fill: "var(--color-violet)" }}
            />
          </marker>
        </defs>
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="color-mix(in srgb, var(--color-violet) 30%, transparent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            markerEnd={`url(#${markerId})`}
          />
        ))}
      </svg>

      {/* Animated dots — one per (path × delay) combo, so each curve
          carries a continuous three-dot procession. */}
      {paths.map((path, pathIdx) =>
        dotDelays.map((delay, dotIdx) => (
          <span
            key={`${pathIdx}-${dotIdx}`}
            className="fan-flow-dot"
            style={
              {
                offsetPath: `path("${path}")`,
                animationDelay: `${delay}s`,
              } as React.CSSProperties
            }
          />
        ))
      )}
    </div>
  );
}

/**
 * A single horizontal dashed line with three violet dots continuously
 * flowing along it. Reuses the `.model-flow-dot` keyframes and the
 * `--flow-distance` CSS custom prop.
 */

/**
 * OxyIntel core — tall Violet pill that spans the height of the tile
 * columns. Contains: HealthPort mark → "OxyIntel" wordmark → three
 * staggered pulsing processing dots. A breathing inner glow adds a
 * subtle sense of computation without decoration.
 */
/**
 * OxyCore — no container, no wordmark, no violet pill. Just the brain
 * silhouette sitting alone in the middle of the flow. The feed-in
 * dots visually terminate against its left flank and the feed-out
 * dots emerge from its right flank.
 */
function OxyCore() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ alignSelf: "stretch", flexShrink: 0 }}
      aria-hidden
    >
      <BrainMark />
    </div>
  );
}

/**
 * Stylised two-hemisphere brain — the OxyIntel processor. Three
 * synapse dots inside the outline fire in sequence (via the
 * `.brain-synapse` keyframe) to imply active computation. Rendered
 * at 168px so it dominates the middle of the flow; `non-scaling-
 * stroke` keeps the outline crisp at that size.
 */
function BrainMark() {
  return (
    <svg
      width="168"
      height="168"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--color-violet)" }}
      aria-hidden="true"
    >
      {/* Outer brain silhouette — two lobes joined at the fissure */}
      <path
        d="M12 4
           C 10 2.6, 6.5 3.4, 5.8 6
           C 3.4 6.6, 2.4 9, 3.4 10.9
           C 2 12, 2 13.8, 3.4 14.9
           C 3.3 17.2, 6 18.7, 8 18.2
           C 9 19.7, 11 19.7, 12 18.6
           C 13 19.7, 15 19.7, 16 18.2
           C 18 18.7, 20.7 17.2, 20.6 14.9
           C 22 13.8, 22 12, 20.6 10.9
           C 21.6 9, 20.6 6.6, 18.2 6
           C 17.5 3.4, 14 2.6, 12 4 Z"
        vectorEffect="non-scaling-stroke"
        strokeWidth="1.6"
      />
      {/* Central fissure */}
      <path
        d="M12 4 L 12 18.6"
        vectorEffect="non-scaling-stroke"
        strokeWidth="1.2"
      />
      {/* Left-lobe grooves */}
      <path
        d="M7 8 Q 9 9.5, 7 11 Q 9 12.5, 7 14"
        vectorEffect="non-scaling-stroke"
        strokeWidth="1.2"
      />
      {/* Right-lobe grooves */}
      <path
        d="M17 8 Q 15 9.5, 17 11 Q 15 12.5, 17 14"
        vectorEffect="non-scaling-stroke"
        strokeWidth="1.2"
      />

      {/* Synapse dots — three-beat firing wave inside the brain */}
      <circle
        cx="7.5"
        cy="9"
        r="0.55"
        fill="currentColor"
        stroke="none"
        className="brain-synapse"
        style={{ animationDelay: "0s" } as React.CSSProperties}
      />
      <circle
        cx="12"
        cy="12.5"
        r="0.55"
        fill="currentColor"
        stroke="none"
        className="brain-synapse"
        style={{ animationDelay: "0.35s" } as React.CSSProperties}
      />
      <circle
        cx="16.5"
        cy="9"
        r="0.55"
        fill="currentColor"
        stroke="none"
        className="brain-synapse"
        style={{ animationDelay: "0.7s" } as React.CSSProperties}
      />
    </svg>
  );
}

/**
 * Small stroke-only icon set used in the flow. Kept inline so no
 * external asset dependency and no round-trip to a sprite sheet.
 */
function IntelIcon({ name }: { name: IconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "cylinder":
      return (
        <svg {...common}>
          <rect x="5.5" y="4" width="7" height="11" rx="1.4" />
          <path d="M7.5 4v-1a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1" />
          <line x1="6.5" y1="8" x2="11.5" y2="8" />
        </svg>
      );
    case "flow":
      return (
        <svg {...common}>
          <path d="M2 9h4" />
          <path d="M12 9h4" />
          <path d="M6 6l3 3-3 3" />
          <circle cx="10.5" cy="9" r="1.6" />
        </svg>
      );
    case "pulse":
      return (
        <svg {...common}>
          <path d="M2 9h3l1.5-4.5L9 13.5l1.6-4 1-.5H16" />
        </svg>
      );
    case "alert":
      return (
        <svg {...common}>
          <path d="M9 3l6.5 11H2.5z" />
          <line x1="9" y1="8" x2="9" y2="10.5" />
          <circle cx="9" cy="12.3" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "trend":
      return (
        <svg {...common}>
          <path d="M2 12l4-4 3 3 5-5" />
          <path d="M11 6h3v3" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="6" />
          <path d="M6 9.5l2 2 4-4" />
        </svg>
      );
  }
}
