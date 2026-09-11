import { HeroWash } from "@/components/shared/HeroWash";
import { IntelFlow } from "@/components/oxyintel/IntelFlow";

/**
 * OxyIntel §1 — Page hero.
 *
 * Left-aligned editorial hero with the home page's Coral · Violet · Sky
 * atmospheric wash (HeroWash default "brand" ramp). No cross-mark, no
 * CTA — the primary conversion happens in the CTA banner near the
 * footer.
 *
 * Motion: content block parallax'd via data-parallax so the copy drifts
 * slightly as the reader scrolls.
 */
export function OxyIntelHero() {
  return (
    <section
      className="relative w-full overflow-hidden isolate flex flex-col"
      style={{
        minHeight: "70vh",
        paddingTop: "clamp(4.5rem, 4rem + 3vw, 7rem)",
        paddingBottom: "clamp(2rem, 1rem + 2vw, 3.5rem)",
      }}
      aria-label="The intelligence layer behind HealthPort"
    >
      <HeroWash />

      {/* Content — sits near the TOP of the 80vh block (below the nav
          + the section's top padding). A flex spacer BELOW pushes the
          ScrollCue to the bottom. Aligned to the container's LEFT
          margin — kicker, h1 and sub all hang against the container
          edge instead of centering. */}
      <div className="container-page relative">
        <div
          className="w-full flex flex-col items-start text-left"
          data-parallax="-0.08"
        >
          {/* H1 capped at max-w-5xl so it wraps naturally into ~3 lines
              instead of running edge-to-edge on a 1200px container. */}
          <h1
            className="mb-6 max-w-5xl"
            style={{ lineHeight: 1.04, textWrap: "balance" }}
          >
            The{" "}
            <span style={{ color: "var(--color-violet)" }}>
              intelligence layer
            </span>{" "}
            behind HealthPort.
          </h1>

          <p
            className="max-w-2xl mb-8 md:mb-10"
            style={{
              fontSize: "clamp(1rem, 0.9rem + 0.4vw, 1.15rem)",
              lineHeight: 1.55,
              color: "var(--color-muted)",
            }}
          >
            OxyIntel is HealthPort&rsquo;s intelligent system for
            real-time visibility, forecasting, and clinical decision
            support. Born of the system.
          </p>

          {/* IntelFlow — small data-flow visualisation echoing the
              OaaS ModelFlow. Reads left-to-right: raw operational
              data → OxyIntel → insight. Small animated dots travel
              along the connectors continuously so the hero always
              has a subtle motion beat, matching the OaaS hero's
              cadence. */}
          <IntelFlow />
        </div>
      </div>

      {/* Spacer — takes the remaining vertical space so the ScrollCue
          settles at the bottom of the 80vh block while the content
          above stays anchored near the top. */}
      <div className="flex-1" aria-hidden />

      {/* Scroll cue — anchored at the bottom of the 80vh block. */}
      <ScrollCue />
    </section>
  );
}

/**
 * Small centred scroll invitation sitting at the bottom of the hero.
 * Click scrolls one viewport height down so the reader lands on the
 * next section (the three modules).
 */
function ScrollCue() {
  return (
    <div className="relative flex justify-center">
      <a
        href="#modules"
        className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Scroll to Three modules"
      >
        <span
          className="eyebrow"
          style={{
            fontSize: "11px",
            color: "var(--color-muted)",
          }}
        >
          Three modules, one platform
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

