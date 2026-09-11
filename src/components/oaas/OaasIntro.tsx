import { HeroWash } from "@/components/shared/HeroWash";

/**
 * OaaS §1 — Page hero.
 *
 * Atmospheric wash (same Coral · Violet · Sky ramp as the home hero for
 * visual consistency across pages), tiny Violet cross mark above the
 * headline, "The model behind the promise." with "model" in Violet, and a
 * short intro paragraph.
 *
 * The "What is Oxygen as a Service?" header that used to live here belongs
 * to the next section (was the video panel, now ProcessTeaser). Keeping
 * this section as a single clean hero.
 *
 * No CTA in the hero — the primary CTA lives in OaasJourney further down
 * the page and again in the site-wide footer.
 */
export function OaasIntro() {
  return (
    <section
      className="relative w-full overflow-hidden isolate flex flex-col"
      style={{
        minHeight: "90vh",
        paddingTop: "clamp(4rem, 3rem + 5vw, 7rem)",
        paddingBottom: "clamp(2rem, 1rem + 2vw, 3.5rem)",
      }}
      aria-label="The model behind the promise"
    >
      <HeroWash ramp="teagreen" />

      {/* Content — vertically centered inside the 90vh block so the
          whitespace above and below the headline reads as intentional
          composition rather than empty padding. */}
      <div className="flex-1 flex items-center container-page relative">
        <div
          className="w-full flex flex-col items-center text-center"
          data-parallax="-0.08"
        >
          {/* Kicker — small brand + product tag establishing context BEFORE
              the poetic h1 lands. Cold visitors from search / shared links
              now know what page they're on before decoding the metaphor. */}
          <p
            className="mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--color-violet)",
            }}
          >
            Oxygen as a Service
          </p>
          <h1
            className="max-w-4xl mb-6"
            style={{ textWrap: "balance" }}
          >
            The{" "}
            <span style={{ color: "var(--color-violet)" }}>model</span>{" "}
            behind
            <br />
            the promise.
          </h1>
          <p
            className="mx-auto max-w-2xl"
            style={{
              fontSize: "clamp(1rem, 0.9rem + 0.4vw, 1.15rem)",
              lineHeight: 1.55,
              color: "var(--color-muted)",
            }}
          >
            Oxygen as a Service means HealthPort owns, operates, and
            maintains your oxygen infrastructure, you get a supply that
            never runs out.
          </p>

          <ModelFlow />
        </div>
      </div>

      {/* Scroll cue — anchored at the bottom of the 90vh block. Clickable
          so the reader can skip straight to the next section, and the
          eyebrow-style label previews what's coming ("What is OaaS?"). */}
      <ScrollCue />
    </section>
  );
}

/**
 * Small centred scroll invitation sitting at the bottom of the hero. Click
 * scrolls one viewport height down so the reader lands on the next section
 * (What is OaaS + animated teaser). Uses smooth scroll; respects the
 * platform default, and Safari honours it since we set scroll-behavior on
 * <html> in globals.css.
 */
function ScrollCue() {
  return (
    <div className="relative flex justify-center">
      <a
        href="#what-is-oaas"
        className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Scroll to What is Oxygen as a Service?"
      >
        <span
          className="eyebrow"
          style={{
            fontSize: "11px",
            color: "var(--color-muted)",
          }}
        >
          What is Oxygen as a Service
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          style={{ color: "var(--color-muted)" }}
        >
          <path
            d="M3 5.5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

/**
 * ModelFlow — compact 3-node visualization of the OaaS model, sitting
 * below the hero paragraph. Gives the hero a concrete visual anchor
 * beyond just typography without inventing data or stock photography:
 *
 *   [ Hospital ]  →  [ HealthPort ]  →  [ Oxygen. Always. ]
 *
 * Middle node picks up Violet (the "we do the work" moment); flanking
 * nodes stay quiet in Parchment. Small enough not to fight the h1;
 * concrete enough to be evidence for the promise.
 */
function ModelFlow() {
  return (
    <div
      className="mt-10 md:mt-14 flex flex-wrap items-center justify-center gap-2 md:gap-3"
      aria-label="How the model works: hospital, HealthPort, oxygen always available"
    >
      <ModelNode icon={<HospitalIcon />} label="Hospital" />
      <FlowArrow />
      <ModelNode icon={<HealthPortMark />} label="HealthPort" primary />
      <FlowArrow />
      <ModelNode icon={<AlwaysIcon />} label="Oxygen, always" />
    </div>
  );
}

function ModelNode({
  icon,
  label,
  primary = false,
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3.5 py-2"
      style={{
        background: primary
          ? "var(--color-violet)"
          : "color-mix(in srgb, var(--color-parchment) 92%, transparent)",
        color: primary ? "var(--color-parchment)" : "var(--color-ink)",
        border: primary
          ? "none"
          : "1px solid var(--color-keyline)",
        borderRadius: "999px",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: "13px",
        letterSpacing: "-0.005em",
      }}
    >
      <span
        aria-hidden
        className="inline-flex items-center justify-center"
        style={{ width: "16px", height: "16px" }}
      >
        {icon}
      </span>
      {label}
    </div>
  );
}

/**
 * FlowArrow — thin dashed line with three dots continuously flowing from
 * the left node to the right node, staggered so the flow feels ambient
 * rather than pulsed. The dots run inside a fixed-width track so the
 * flex layout stays predictable across breakpoints.
 */
function FlowArrow() {
  const TRACK_WIDTH = 44;
  return (
    <div
      aria-hidden
      className="relative shrink-0"
      style={{ width: `${TRACK_WIDTH}px`, height: "10px" }}
    >
      {/* Track — thin dashed line the dots ride on. */}
      <svg
        width={TRACK_WIDTH}
        height="10"
        viewBox={`0 0 ${TRACK_WIDTH} 10`}
        className="absolute inset-0"
      >
        <line
          x1="1"
          y1="5"
          x2={TRACK_WIDTH - 1}
          y2="5"
          stroke="var(--color-keyline)"
          strokeWidth="1"
          strokeDasharray="2 3"
          strokeLinecap="round"
        />
      </svg>
      {/* Flowing dots — three, staggered by 0.8s each so the arrow feels
          continuously alive rather than pulsed. --flow-distance controls
          the pixel offset of the translateX in the keyframes. */}
      {[0, 0.8, 1.6].map((delay, i) => (
        <span
          key={i}
          className="model-flow-dot absolute"
          style={{
            top: "50%",
            left: 0,
            width: "4px",
            height: "4px",
            marginTop: "-2px",
            borderRadius: "50%",
            background: "var(--color-violet)",
            animationDelay: `${delay}s`,
            ["--flow-distance" as string]: `${TRACK_WIDTH - 4}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function HospitalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 14V5.5L8 2l6 3.5V14M2 14h12M6 14V10h4v4M8 5v3M6.5 6.5h3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HealthPortMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3M3.4 3.4l2.1 2.1M10.5 10.5l2.1 2.1M12.6 3.4l-2.1 2.1M5.5 10.5l-2.1 2.1"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="1.75" fill="currentColor" />
    </svg>
  );
}

function AlwaysIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.5 5c-1.5 0-2.5 1.3-2.5 3s1 3 2.5 3c1 0 1.9-.6 3.5-3 1.6-2.4 2.5-3 3.5-3 1.5 0 2.5 1.3 2.5 3s-1 3-2.5 3c-1 0-1.9-.6-3.5-3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

