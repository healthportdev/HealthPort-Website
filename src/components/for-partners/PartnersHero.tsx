import Link from "next/link";
import { HeroWash } from "@/components/shared/HeroWash";

/**
 * For Partners §1 — the page hero.
 *
 * Same hero grammar we've settled into across pages: shared HeroWash
 * (brand ramp) → h1 with Violet punchlines on the beats that name
 * the outcome ("oxygen", "at scale") → muted sub → primary CTA.
 * Centred stack — the partnership audience gets an institutional
 * front-door treatment.
 */
export function PartnersHero() {
  return (
    <section
      className="relative w-full overflow-hidden isolate flex flex-col"
      style={{
        minHeight: "70vh",
        paddingTop: "clamp(4.5rem, 4rem + 3vw, 7rem)",
        paddingBottom: "clamp(2.5rem, 1.5rem + 2vw, 4rem)",
      }}
      aria-label="Expanding oxygen access at scale"
    >
      <HeroWash />

      <div className="container-page relative">
        <div
          className="w-full flex flex-col items-start text-left"
          data-parallax="-0.08"
        >
          {/* H1 — Violet punchlines on "oxygen" and "at scale" so the
              two brand beats (what we deliver, at what magnitude) get
              the accent. Left-aligned, matching the Hospital Solutions
              and OxyIntel hero grammar. */}
          <h1
            className="mb-6 max-w-5xl"
            style={{ lineHeight: 1.04, textWrap: "balance" }}
          >
            Expanding{" "}
            <span style={{ color: "var(--color-violet)" }}>oxygen</span>{" "}
            access{" "}
            <span style={{ color: "var(--color-violet)" }}>
              at scale
            </span>
            .
          </h1>

          {/* Sub — Figma copy: partnership scope, then the outcome
              bolded so the reader lands on what we deliver. */}
          <p
            className="max-w-2xl mb-10 md:mb-12"
            style={{
              fontSize: "clamp(1rem, 0.9rem + 0.4vw, 1.15rem)",
              lineHeight: 1.55,
              color: "var(--color-muted)",
            }}
          >
            Partnering with governments, NGOs, and global organisations
            to{" "}
            <strong
              style={{
                fontWeight: 700,
                color: "var(--color-heading)",
              }}
            >
              improve oxygen access in hospitals.
            </strong>
          </p>

          {/* CTAs — primary partnership conversation + secondary link
              to the impact story lower on the page. */}
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">
              Start a partnership conversation
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
              href="#transparency"
              className="btn-secondary"
            >
              See our impact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
