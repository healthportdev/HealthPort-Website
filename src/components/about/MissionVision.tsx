/**
 * About §1 — Page hero.
 *
 * Pure hero moment per the Figma: an h1 with Violet punchlines on
 * "Oxygen supplier" and "infrastructure" (the two brand beats), and
 * a promise-line sub. The vision stats moved to §2 (WhyWeExistReprise)
 * where they anchor the mission chapter, so this section stays
 * focused on the single hero claim.
 *
 * Reuses the shared HeroWash and cross-page hero grammar
 * (Hospital Solutions / OxyIntel / For Partners). Content is left-
 * aligned, container-page positioned; parallax on the content
 * wrapper for depth.
 */
import { HeroWash } from "@/components/shared/HeroWash";

export function MissionVision() {
  return (
    <section
      className="relative w-full overflow-hidden isolate flex flex-col"
      style={{
        minHeight: "70vh",
        paddingTop: "clamp(4.5rem, 4rem + 3vw, 7rem)",
        paddingBottom: "clamp(2.5rem, 1.5rem + 2vw, 4rem)",
      }}
      aria-label="Oxygen supplier to healthcare infrastructure"
    >
      <HeroWash />

      <div className="container-page relative flex-1 flex items-center">
        <div
          className="w-full flex flex-col items-start text-left"
          data-parallax="-0.08"
        >
          {/* H1 — Figma line, Violet punchlines on the two brand
              beats: "Oxygen supplier" and "infrastructure". */}
          <h1
            className="mb-6 max-w-5xl"
            style={{ lineHeight: 1.04, textWrap: "balance" }}
          >
            Oxygen supplier to healthcare{" "}
            <span style={{ color: "var(--color-violet)" }}>
              infrastructure
            </span>
            .
          </h1>

          {/* Promise sub — the mission line, second sentence bolded
              so the reader lands on the commitment. */}
          <p
            className="max-w-2xl"
            style={{
              fontSize: "clamp(1rem, 0.9rem + 0.4vw, 1.15rem)",
              lineHeight: 1.55,
              color: "var(--color-muted)",
            }}
          >
            No patient should die from an oxygen shortage.{" "}
            <strong
              style={{
                fontWeight: 700,
                color: "var(--color-heading)",
              }}
            >
              We&rsquo;re building the infrastructure that makes that
              promise real.
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
}
