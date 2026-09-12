/**
 * OxyIntel §2 — Three modules. One integrated platform.
 *
 * Chaptered layout borrowed from the OaaS ProcessTeaser: one full
 * chapter per module, split into a Tea-Green editorial column on the
 * LEFT (chapter number + module name + headline + body + status pill +
 * stage indicator) and an Ink scene panel on the RIGHT (a custom SVG
 * scene specific to that module, with one small purposeful motion).
 *
 * Motion:
 *   - Section header parallax'd via data-parallax
 *   - Each chapter fades up on scroll into view (IntersectionObserver)
 *   - Each scene carries a single subtle motion:
 *       · OxyTrack — "active zone" indicator cycles through 9 tiles
 *       · OxyFlow  — pulsing dot on the "now" point of the demand line
 *       · RespiraAI — typing dots between chat bubbles
 * Respects prefers-reduced-motion.
 */
"use client";

import { useEffect, useRef, useState } from "react";

type Status = "Deployed" | "MVP" | "Prototype";

/** Per-chapter colour theme — picks one of the brand secondaries so
 *  the three chapters read as related but distinct. Each theme obeys
 *  the CLAUDE.md pairing rules: bg + accent + ink work together, and
 *  the scene on the Ink right panel picks up the same accent. */
type ChapterTheme = {
  bg: string;
  accent: string; // eyebrow / punchline / status pill / stage / verb
  sceneAccent: string; // the "live" colour used inside the Ink scene
};

type ChapterData = {
  key: string;
  number: string;
  name: string;
  status: Status;
  verb: string;
  headline: (accent: string) => React.ReactNode;
  body: string;
  scene: (accent: string) => React.ReactNode;
  theme: ChapterTheme;
};

const chapters: ChapterData[] = [
  {
    key: "oxytrack",
    number: "01",
    name: "OxyTrack",
    status: "Deployed",
    verb: "Monitor",
    headline: (accent) => (
      <>
        Every cylinder,{" "}
        <span style={{ color: accent }}>accounted for.</span>
      </>
    ),
    body: "Real-time tracking of oxygen cylinders through their lifecycle: filled, in use, empty. Inventory accountability, reduced losses, streamlined distribution.",
    scene: (accent) => <OxyTrackScene accent={accent} />,
    theme: {
      bg: "var(--color-teagreen)",
      accent: "var(--color-teal)",
      sceneAccent: "var(--color-teagreen)",
    },
  },
  {
    key: "oxyflow",
    number: "02",
    name: "OxyFlow",
    status: "MVP",
    verb: "Predict",
    headline: (accent) => (
      <>
        See demand{" "}
        <span style={{ color: accent }}>before it arrives.</span>
      </>
    ),
    body: "Intelligent oxygen demand forecasting. Combines operational data, environmental variables, and machine learning to plan production and distribution before demand spikes.",
    scene: (accent) => <OxyFlowScene accent={accent} />,
    theme: {
      // Light Sky bg — Sky at ~30% mixed with Parchment. Deep-navy
      // accents pick up brand's Sky Deep for AA-safe headline colour.
      bg: "color-mix(in srgb, var(--color-sky) 30%, var(--color-parchment))",
      accent: "var(--color-sky-deep)",
      sceneAccent: "var(--color-sky)",
    },
  },
  {
    key: "respiraai",
    number: "03",
    name: "RespiraAI",
    status: "Prototype",
    verb: "Support",
    headline: (accent) => (
      <>
        Clinical support,{" "}
        <span style={{ color: accent }}>at the bedside.</span>
      </>
    ),
    body: "AI-powered clinical support for nurses, biomedical technicians, and frontline workers. Respiratory case triage, device troubleshooting, and intelligent clinical guidance.",
    scene: (accent) => <RespiraAIScene accent={accent} />,
    theme: {
      // Light peach bg — Coral at ~22% mixed with Parchment. Full
      // Coral for accents (contrast is fine at eyebrow / h3+ sizes).
      bg: "color-mix(in srgb, var(--color-coral) 22%, var(--color-parchment))",
      accent: "var(--color-coral)",
      sceneAccent: "var(--color-coral)",
    },
  },
];

export function Modules() {
  return (
    <section
      id="modules"
      className="w-full"
      aria-label="OxyIntel modules"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        {/* Section header — Violet eyebrow → h2 with Violet punchline
            → muted sub. */}
        <div
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 md:mb-20"
          data-parallax="-0.08"
        >
          <p
            className="eyebrow mb-4"
            style={{ color: "var(--color-violet)" }}
          >
            What&rsquo;s inside
          </p>
          {/* Explicit break so line 1 reads "Three modules." (Ink)
              and line 2 the Violet punchline "One integrated
              platform." — avoids the awkward mid-phrase wrap textWrap
              balance was producing. */}
          <h2 className="mb-4" style={{ lineHeight: 1.06 }}>
            Three modules.
            <br />
            <span style={{ color: "var(--color-violet)" }}>
              One integrated platform.
            </span>
          </h2>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.55,
              color: "var(--color-muted)",
            }}
          >
            OxyIntel is HealthPort&rsquo;s intelligent system for
            real-time visibility, forecasting, and clinical decision
            support.
          </p>
        </div>

        {/* Chapters, stacked with generous gap so each reads as its
            own chapter, not a row in a list. */}
        <div className="flex flex-col gap-6 md:gap-8">
          {chapters.map((c, i) => (
            <Chapter
              key={c.key}
              data={c}
              index={i}
              totalStages={chapters.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Chapter ---------------------------- */

function Chapter({
  data,
  index,
  totalStages,
}: {
  data: ChapterData;
  index: number;
  totalStages: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
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

  const stageIdx = String(index + 1).padStart(2, "0");
  const stageTotal = String(totalStages).padStart(2, "0");

  return (
    <article
      ref={ref}
      style={{
        borderRadius: "clamp(20px, 2vw, 28px)",
        overflow: "hidden",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(16px)",
        transition:
          "opacity 640ms cubic-bezier(0.22, 1, 0.36, 1), transform 640ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* LEFT — themed editorial column */}
        <div
          className="flex flex-col"
          style={{
            background: data.theme.bg,
            color: "var(--color-ink)",
            padding: "clamp(2rem, 3.5vw, 4rem)",
            minHeight: "clamp(420px, 44vw, 620px)",
          }}
        >
          {/* Top — chapter number + module name */}
          <p
            className="eyebrow mb-8"
            style={{ color: data.theme.accent }}
          >
            {data.number} · {data.name.toUpperCase()}
          </p>

          {/* Middle — headline + body */}
          <div className="flex-1 flex flex-col justify-center gap-5 md:gap-6">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 1.2rem + 2.4vw, 3.25rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--color-ink)",
                margin: 0,
                textWrap: "balance",
              }}
            >
              {data.headline(data.theme.accent)}
            </h3>

            <p
              style={{
                fontSize: "clamp(14px, 1vw, 16px)",
                lineHeight: 1.55,
                color: "var(--color-ink)",
                margin: 0,
                maxWidth: "36ch",
                opacity: 0.78,
              }}
            >
              {data.body}
            </p>

            <div className="flex items-center gap-3 mt-1">
              <StatusPill
                status={data.status}
                color={data.theme.accent}
              />
              <span
                className="eyebrow"
                style={{
                  color: data.theme.accent,
                  fontSize: "10px",
                  opacity: 0.7,
                }}
              >
                {data.verb}
              </span>
            </div>
          </div>

          {/* Bottom — stage indicator */}
          <p
            className="eyebrow mt-8"
            style={{
              color: data.theme.accent,
              fontSize: "10px",
              opacity: 0.72,
            }}
          >
            Stage {stageIdx} / {stageTotal}
          </p>
        </div>

        {/* RIGHT — Ink scene panel. Subtle data-parallax so the
            scene drifts slightly against the fixed copy on the left,
            giving each chapter depth without breaking the card's
            outer reveal transform (which lives on the <article>). */}
        <div
          className="flex items-center justify-center"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-parchment)",
            padding: "clamp(2rem, 3vw, 3rem)",
            minHeight: "clamp(360px, 40vw, 620px)",
          }}
          data-parallax="-0.05"
        >
          {data.scene(data.theme.sceneAccent)}
        </div>
      </div>
    </article>
  );
}

/* --------------------------- StatusPill ---------------------------- */

function StatusPill({ status, color }: { status: Status; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.25rem 0.6rem",
        border: `1px solid ${color}`,
        borderRadius: "999px",
        color,
        fontFamily: "var(--font-display)",
        fontSize: "10px",
        letterSpacing: "0.12em",
        fontWeight: 700,
        textTransform: "uppercase",
        background: "transparent",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: color,
        }}
      />
      {status}
    </span>
  );
}

/* --------------------------- Scenes ---------------------------- */

/**
 * OxyTrack scene — 3×3 grid of dashed rounded tiles, one per hospital
 * zone. Each tile shows 3 muted dots representing tracked cylinders.
 * A single "active" indicator cycles through the tiles ~every 1.4s,
 * signalling continuous scanning. Reference-image aesthetic:
 * institutional, clean, no photorealism.
 */
/**
 * OxyTrack scene — 3×3 grid of individual cylinders. Each tile shows
 * a small stroke cylinder icon, a status dot (Filled / In use / Empty)
 * and the cylinder's ID. A single "active" indicator cycles through
 * the tiles every ~1.4s, signalling continuous scanning by OxyTrack.
 * Matches the copy: real-time tracking of cylinders through their
 * lifecycle (filled → in use → empty).
 */
function OxyTrackScene({ accent }: { accent: string }) {
  type Status = "filled" | "in-use" | "empty";
  const cylinders: Array<{ id: string; status: Status }> = [
    { id: "C-1247", status: "filled" },
    { id: "C-1248", status: "in-use" },
    { id: "C-1305", status: "filled" },
    { id: "C-1339", status: "empty" },
    { id: "C-1414", status: "filled" },
    { id: "C-1502", status: "in-use" },
    { id: "C-1601", status: "filled" },
    { id: "C-1705", status: "filled" },
    { id: "C-1812", status: "empty" },
  ];
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduced) return;
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % cylinders.length),
      1400
    );
    return () => clearInterval(id);
  }, [cylinders.length]);

  return (
    <div
      className="grid grid-cols-3 gap-3 md:gap-4 w-full"
      style={{ maxWidth: "460px" }}
      aria-hidden
    >
      {cylinders.map((c, i) => {
        const active = i === activeIdx;
        return (
          <div
            key={c.id}
            style={{
              aspectRatio: "1 / 1",
              borderRadius: "10px",
              border: `1.5px dashed ${
                active ? accent : "rgba(242, 239, 234, 0.22)"
              }`,
              display: "grid",
              gridTemplateRows: "auto 1fr auto",
              padding: "10px 8px",
              transition:
                "border-color 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* Top row: persistent status dot, right-aligned */}
            <div className="flex justify-end">
              <StatusDot status={c.status} />
            </div>

            {/* Middle: cylinder icon, brightens on active */}
            <div
              className="flex items-center justify-center"
              style={{
                color: active ? accent : "rgba(242, 239, 234, 0.55)",
                transition:
                  "color 700ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <CylinderIcon />
            </div>

            {/* Bottom: cylinder ID */}
            <span
              className="eyebrow"
              style={{
                fontSize: "9px",
                color: active ? accent : "rgba(242, 239, 234, 0.55)",
                letterSpacing: "0.09em",
                textAlign: "center",
                fontVariantNumeric: "tabular-nums",
                transition:
                  "color 700ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {c.id}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Persistent status dot per cylinder — colour-coded so the reader
 * can read the fleet at a glance:
 *   Filled → Tea Green (bright, present)
 *   In use → Sunny (bright yellow, actively delivering)
 *   Empty  → outline ring (visibly absent)
 */
function StatusDot({ status }: { status: "filled" | "in-use" | "empty" }) {
  if (status === "empty") {
    return (
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          border: "1.2px solid rgba(242, 239, 234, 0.45)",
          background: "transparent",
        }}
      />
    );
  }
  const bg =
    status === "filled" ? "var(--color-teagreen)" : "var(--color-sunny)";
  return (
    <span
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: bg,
      }}
    />
  );
}

/**
 * Stroke-only gas cylinder icon. Rectangular body with rounded
 * corners, a small valve neck on top, and a horizontal gauge line —
 * reads as an oxygen cylinder at ~24px.
 */
function CylinderIcon() {
  return (
    <svg
      width="24"
      height="30"
      viewBox="0 0 16 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Body */}
      <rect x="3" y="5" width="10" height="13" rx="1.6" />
      {/* Valve base */}
      <path d="M6 5 v-2 h4 v2" />
      {/* Valve stem */}
      <line x1="8" y1="3" x2="8" y2="1.5" />
      {/* Gauge line */}
      <line x1="5" y1="9.5" x2="11" y2="9.5" />
    </svg>
  );
}

/**
 * OxyFlow scene — a simple demand line chart. Solid Tea-Green stroke
 * for historical demand, dashed continuation for the 24h forecast, a
 * pulsing dot at the "now" transition. Nothing gimmicky — reads as an
 * actual analytics chart.
 */
function OxyFlowScene({ accent }: { accent: string }) {
  const W = 420;
  const H = 240;
  const padX = 24;
  const padY = 32;
  const nowX = 220;

  // Fake demand series — hand-tuned so it feels realistic
  const past = "0,180 30,168 60,172 90,150 120,140 150,120 180,132 210,118";
  const forecast =
    "220,118 250,128 280,110 310,96 340,82 370,90 400,72";

  return (
    <div className="w-full flex flex-col" style={{ maxWidth: W }} aria-hidden>
      {/* Chart */}
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{ display: "block" }}
      >
        {/* Axis line */}
        <line
          x1={padX}
          y1={H - padY}
          x2={W - padX}
          y2={H - padY}
          stroke="rgba(242, 239, 234, 0.22)"
          strokeWidth="1"
        />

        {/* Historical demand — solid Tea-Green polyline */}
        <polyline
          points={past}
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Forecast — dashed continuation */}
        <polyline
          points={forecast}
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeDasharray="4 5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />

        {/* "Now" vertical marker */}
        <line
          x1={nowX}
          y1="20"
          x2={nowX}
          y2={H - padY}
          stroke="rgba(242, 239, 234, 0.28)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Pulsing dot at "now" — the single motion in this scene */}
        <circle
          cx={nowX}
          cy="118"
          r="6"
          fill={accent}
          className="flow-now-pulse"
        />
        <circle
          cx={nowX}
          cy="118"
          r="4"
          fill="var(--color-ink)"
          stroke={accent}
          strokeWidth="1.5"
        />

        {/* Axis labels */}
        <text
          x={padX}
          y={H - 8}
          fill="rgba(242, 239, 234, 0.5)"
          fontSize="10"
          fontFamily="var(--font-display)"
          letterSpacing="0.1em"
        >
          00:00
        </text>
        <text
          x={nowX - 12}
          y={H - 8}
          fill={accent}
          fontSize="10"
          fontFamily="var(--font-display)"
          letterSpacing="0.1em"
          fontWeight="700"
        >
          NOW
        </text>
        <text
          x={W - padX - 24}
          y={H - 8}
          fill="rgba(242, 239, 234, 0.5)"
          fontSize="10"
          fontFamily="var(--font-display)"
          letterSpacing="0.1em"
        >
          +24H
        </text>
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2">
        <LegendItem swatch="solid" label="Historical" color={accent} />
        <LegendItem swatch="dashed" label="Forecast" color={accent} />
      </div>
    </div>
  );
}

function LegendItem({
  swatch,
  label,
  color,
}: {
  swatch: "solid" | "dashed";
  label: string;
  color: string;
}) {
  return (
    <span
      className="flex items-center gap-2"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "10px",
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        color: "rgba(242, 239, 234, 0.62)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "20px",
          height: "0",
          borderTop:
            swatch === "solid"
              ? `2px solid ${color}`
              : `2px dashed ${color}`,
          opacity: swatch === "dashed" ? 0.75 : 1,
        }}
      />
      {label}
    </span>
  );
}

/**
 * RespiraAI scene — a compact chat exchange: nurse message on the
 * left, RespiraAI reply on the right, and a small typing indicator
 * (three pulsing dots) between them implying continuous availability.
 */
function RespiraAIScene({ accent }: { accent: string }) {
  return (
    <div
      className="w-full flex flex-col gap-3"
      style={{ maxWidth: "420px" }}
      aria-hidden
    >
      {/* Nurse bubble — left aligned */}
      <div
        style={{
          alignSelf: "flex-start",
          maxWidth: "78%",
          background: "rgba(242, 239, 234, 0.08)",
          border: "1px solid rgba(242, 239, 234, 0.14)",
          borderRadius: "14px 14px 14px 4px",
          padding: "12px 14px",
          fontFamily: "var(--font-display)",
        }}
      >
        <p
          className="eyebrow mb-1.5"
          style={{
            fontSize: "9px",
            color: "rgba(242, 239, 234, 0.55)",
          }}
        >
          Nurse · Ward 4B
        </p>
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.4,
            color: "var(--color-parchment)",
            margin: 0,
          }}
        >
          SpO&#8322; 89 on patient 4B — advice?
        </p>
      </div>

      {/* Typing indicator between the two — the one motion in this
          scene. Three dots pulsing in sequence. */}
      <div
        className="flex items-center gap-1.5"
        style={{
          alignSelf: "center",
          padding: "6px 10px",
          background: "rgba(128, 16, 120, 0.14)",
          borderRadius: "999px",
        }}
      >
        {[0, 0.2, 0.4].map((d, i) => (
          <span
            key={i}
            className="brain-synapse"
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: accent,
              animationDelay: `${d}s`,
              display: "inline-block",
            }}
          />
        ))}
      </div>

      {/* RespiraAI bubble — right aligned, tinted with the chapter's
          accent so it reads as the AI's colour identity. */}
      <div
        style={{
          alignSelf: "flex-end",
          maxWidth: "78%",
          background: `color-mix(in srgb, ${accent} 18%, transparent)`,
          border: `1px solid color-mix(in srgb, ${accent} 40%, transparent)`,
          borderRadius: "14px 14px 4px 14px",
          padding: "12px 14px",
          fontFamily: "var(--font-display)",
        }}
      >
        <p
          className="eyebrow mb-1.5"
          style={{
            fontSize: "9px",
            color: accent,
          }}
        >
          RespiraAI
        </p>
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.4,
            color: "var(--color-parchment)",
            margin: 0,
          }}
        >
          Raise FiO&#8322; by 5%. Recheck saturation in 15 min. Confirm
          humidifier temp &ge; 34&deg;C.
        </p>
      </div>
    </div>
  );
}
