/**
 * About §7 — AirUp.
 *
 * Two-column layout matching the Figma: LEFT column carries the copy
 * (small Sunny eyebrow → h2 with Sunny punchline → body + light
 * launch note), RIGHT column is the Sunny mascot illustration. The
 * mascot is exactly the client-supplied character — used as-is,
 * no re-work.
 *
 * Motion:
 *   - Left column drifts on data-parallax
 *   - Mascot has a very subtle float on a slow cycle (2 axis
 *     translate, no rotate). Respects prefers-reduced-motion.
 */
import Image from "next/image";
import airupMascot from "../../../public/images/airup-mascot.png";

export function AirUpMention() {
  return (
    <section
      id="airup"
      className="w-full"
      aria-label="AirUp"
      style={{
        paddingBlock: "var(--spacing-section)",
        // Nudge the anchor target below the sticky nav so #airup
        // deep-links (from the footer) don't hide the section header.
        scrollMarginTop: "5rem",
      }}
    >
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] gap-12 md:gap-20 items-center">
          {/* LEFT — copy */}
          <div data-parallax="-0.06">
            <p
              className="eyebrow"
              style={{
                color: "var(--color-teal)",
                marginBottom: "clamp(1.75rem, 2vw, 2.25rem)",
              }}
            >
              AirUp
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 1.5rem + 1.8vw, 3rem)",
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "var(--color-heading)",
                textWrap: "balance",
                margin: 0,
                marginBottom: "clamp(2rem, 2.5vw, 2.5rem)",
              }}
            >
              Making respiratory support{" "}
              <span style={{ color: "var(--color-teal)" }}>
                approachable
              </span>
              .
            </h2>
            <p
              style={{
                fontSize: "clamp(15px, 1vw, 17px)",
                lineHeight: 1.6,
                color: "var(--color-fg)",
                margin: 0,
                marginBottom: "1.25rem",
                maxWidth: "44ch",
              }}
            >
              AirUp is HealthPort&rsquo;s community-facing brand, focused
              on making respiratory support approachable, reassuring, and
              accessible to patients and communities.
            </p>
            <p
              style={{
                fontSize: "13.5px",
                lineHeight: 1.55,
                color: "var(--color-muted)",
                margin: 0,
              }}
            >
              AirUp will launch on its own dedicated platform when ready.
              For now, this is where it lives.
            </p>
          </div>

          {/* RIGHT — mascot */}
          <div className="flex items-center justify-center">
            <div
              className="airup-float relative"
              style={{
                width: "100%",
                maxWidth: "clamp(240px, 26vw, 380px)",
                aspectRatio: "10 / 11",
              }}
            >
              <Image
                src={airupMascot}
                alt="AirUp mascot"
                fill
                sizes="(min-width: 768px) 26vw, 60vw"
                placeholder="blur"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
