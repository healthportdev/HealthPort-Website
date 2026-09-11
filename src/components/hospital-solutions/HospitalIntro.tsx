import Link from "next/link";
import { HeroWash } from "@/components/shared/HeroWash";

/**
 * Hospital Solutions §1 — the page hero.
 *
 * Same eyebrow → h1 → sub → CTA skeleton the section always had,
 * dressed in the shared HeroWash (brand ramp — Coral · Violet · Sky)
 * so the page opens with the same atmospheric wash as the home and
 * OxyIntel pages. Headline swapped to the Figma line: "For hospitals
 * that can't afford oxygen failures.", with the Violet punchline
 * landing on "oxygen failures." — the beat that names the stakes.
 *
 * Motion: content block drifts subtly via data-parallax, matching
 * the cross-page hero grammar.
 */
export function HospitalIntro() {
  return (
    <section
      className="relative w-full overflow-hidden isolate flex flex-col"
      style={{
        minHeight: "70vh",
        paddingTop: "clamp(4.5rem, 4rem + 3vw, 7rem)",
        paddingBottom: "clamp(2.5rem, 1.5rem + 2vw, 4rem)",
      }}
      aria-label="For hospitals that can't afford oxygen failures"
    >
      <HeroWash />

      <div className="container-page relative">
        <div
          className="w-full flex flex-col items-start text-left"
          data-parallax="-0.08"
        >
          {/* Headline — Figma line, split so "oxygen failures." is the
              Violet punchline on line 2. */}
          <h1
            className="mb-6 max-w-5xl"
            style={{ lineHeight: 1.04, textWrap: "balance" }}
          >
            For hospitals that can&rsquo;t afford
            <br />
            <span style={{ color: "var(--color-violet)" }}>
              oxygen failures.
            </span>
          </h1>

          {/* Sub — Figma copy: the distraction cost first, then the
              promise bolded so the reader lands on the commitment. */}
          <p
            className="max-w-2xl mb-10 md:mb-12"
            style={{
              fontSize: "clamp(1rem, 0.9rem + 0.4vw, 1.15rem)",
              lineHeight: 1.55,
              color: "var(--color-muted)",
            }}
          >
            Managing oxygen shouldn&rsquo;t distract your clinical
            team.{" "}
            <strong
              style={{
                fontWeight: 700,
                color: "var(--color-heading)",
              }}
            >
              We own, monitor, and guarantee your oxygen supply.
            </strong>
          </p>

          {/* CTAs — primary "Book an assessment" + secondary link to
              the OaaS page for the service mechanics. */}
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">
              Book an assessment
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/oxygen-as-a-service"
              className="btn-secondary"
            >
              How the service works
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
