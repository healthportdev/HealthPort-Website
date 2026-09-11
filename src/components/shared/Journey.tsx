/**
 * Shared Journey — a numbered vertical journey with a Teal terminal plate.
 * Used on Home (6 steps) and Oxygen as a Service (4 steps + outcome-led
 * ending). Steps are passed in; the caller controls copy and count.
 *
 * Motion: [[JourneyReveal]] client leaf reveals each step in sequence as it
 * scrolls into view (60ms stagger, once). Data attributes below wire it up.
 */
import { JourneyReveal } from "@/components/motion/JourneyReveal";

export type JourneyStep = {
  n: string;
  title: string;
  /** Plain string — the caller supplies HTML entities as-is (e.g. &rsquo;). */
  body: string;
};

export type JourneyOutcome = {
  eyebrow: string;
  text: string;
};

export function Journey({
  eyebrow,
  headline,
  steps,
  outcome,
  eyebrowColor,
}: {
  eyebrow: string;
  headline: string;
  steps: JourneyStep[];
  outcome: JourneyOutcome;
  /** Optional inline color override for the top eyebrow. Falls back to the
   *  default muted color when not provided. */
  eyebrowColor?: string;
}) {
  return (
    <section className="chapter" aria-label={eyebrow} data-journey-root>
      <div className="chapter-inner">
        <p
          className="eyebrow mb-8"
          style={eyebrowColor ? { color: eyebrowColor } : undefined}
        >
          {eyebrow}
        </p>
        <h2 className="max-w-3xl mb-16 md:mb-24">{headline}</h2>

        <ol className="flex flex-col gap-14 md:gap-20 list-none">
          {steps.map((s) => (
            <li
              key={s.n}
              data-journey-step
              className="grid grid-cols-[3rem_1fr] md:grid-cols-[5rem_1fr] gap-6 md:gap-10"
            >
              <div className="flex flex-col items-start">
                <span
                  className="stat"
                  style={{
                    fontSize: "clamp(1.75rem, 1.25rem + 1.5vw, 2.5rem)",
                    color: "var(--color-teal)",
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </span>
              </div>
              <div>
                <h3
                  className="mb-3"
                  style={{ fontSize: "var(--text-h4)", lineHeight: 1.2 }}
                >
                  {s.title}
                </h3>
                <p
                  className="max-w-xl"
                  style={{
                    color: "var(--color-muted)",
                    fontSize: "var(--text-p1)",
                    lineHeight: 1.55,
                  }}
                  dangerouslySetInnerHTML={{ __html: s.body }}
                />
              </div>
            </li>
          ))}
        </ol>

        <div
          className="mt-20 md:mt-32 p-10 md:p-14"
          style={{
            background: "var(--color-teal)",
            color: "var(--color-parchment)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <p
            className="eyebrow"
            style={{ color: "var(--color-parchment)", opacity: 0.7 }}
          >
            {outcome.eyebrow}
          </p>
          <p
            className="mt-4 max-w-3xl"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h3)",
              lineHeight: "var(--text-h3--line-height)",
              letterSpacing: "var(--text-h3--letter-spacing)",
              fontWeight: 700,
              color: "var(--color-parchment)",
              textWrap: "balance",
            }}
          >
            {outcome.text}
          </p>
        </div>
      </div>
      <JourneyReveal />
    </section>
  );
}
