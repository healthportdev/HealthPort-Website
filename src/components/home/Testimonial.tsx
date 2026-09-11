/**
 * §9 — Hospital testimonial.
 *
 * Editorial vertical stack: pull-quote from the video serves as the section
 * heading (no separate H2), attribution beneath, then the full-container-width
 * video (16:9). Click the play pill to hear Dr. Niki tell the story with sound.
 */
import { TestimonialVideo } from "@/components/home/TestimonialVideo";

export function Testimonial() {
  return (
    <section
      aria-label="Hospital testimonial"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        {/* Header block — centered stack. The pull-quote is hero-scale so
            centering is warranted (CLAUDE.md permits it for hero moments).
            Each payoff noun (cost / time / life) picks up a different brand
            color for tri-part visual escalation: Teal → Coral → Violet. */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <p
            className="eyebrow mb-6"
            style={{ color: "var(--color-violet)" }}
          >
            In their words
          </p>

          <figure style={{ margin: 0 }} className="max-w-5xl">
            <blockquote style={{ margin: 0 }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px, 5.5vw, 72px)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  color: "var(--color-heading)",
                  margin: 0,
                }}
              >
                &ldquo;It saves{" "}
                <span className="shimmer-teal">cost</span>. It saves{" "}
                <span className="shimmer-coral">time</span>.<br />
                It saves <span className="oxygen-word">life</span>.&rdquo;
              </p>
            </blockquote>

            <figcaption
              className="mt-8 md:mt-10 flex flex-col items-center gap-1"
              style={{ color: "var(--color-muted)" }}
            >
              {/* FACT NEEDED: confirm speaker name spelling (whisper heard "Ola Niki") */}
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "17px",
                  color: "var(--color-fg)",
                }}
              >
                Dr. Ola Niki
              </span>
              <span className="eyebrow" style={{ color: "var(--color-muted)" }}>
                Medical Director, Massey Street Children&rsquo;s Hospital &middot; Lagos, Nigeria
              </span>
            </figcaption>
          </figure>
        </div>

        <TestimonialVideo />
      </div>
    </section>
  );
}
