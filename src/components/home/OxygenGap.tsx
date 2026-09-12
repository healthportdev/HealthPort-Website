/**
 * OxygenGap — the "problem" chapter, restrained.
 *
 * Transparent valve PNG bleeds in from the LEFT viewport edge with no card
 * or background around it — that no-container floating gives the section its
 * immersive, 3D-like anchor. Prose + a three-row dashboard (Most · Hours ·
 * Unseen) live in the right column so they never overlap the image.
 *
 * The row labels are color-coded Teal · Coral · Violet — the same trio used
 * for the shimmer words in the testimonial payoff ("It saves cost / time /
 * life"). Typography rhyme without changing the crisis wording.
 *
 * Motion: row items fade-up-and-settle with an 80 ms stagger via
 * [[StatReveal]] client leaf.
 *
 * Facts marked `FACT NEEDED` until a citable source is provided.
 */
import Image from "next/image";
import oxygenValve from "../../../public/images/oxygen-valve.png";

type Row = {
  label: string;
  color: string; // one of the three testimonial shimmer colors
  body: React.ReactNode;
};

// Original three failure modes restated as a color-coded dashboard. Labels
// pick up the three testimonial-payoff brand colors (Teal / Coral / Violet)
// so the typography still rhymes with the "It saves cost / time / life"
// moment down the page, even though the label words themselves stay as the
// original crisis nouns.
const rows: Row[] = [
  {
    label: "Most",
    color: "var(--color-teal)",
    body: (
      <>
        hospital departments{" "}
        <strong className="font-semibold">can&rsquo;t see</strong> how much
        oxygen is left until it runs out.
      </>
    ),
  },
  {
    label: "Hours",
    color: "var(--color-coral)",
    body: (
      <>
        of wait between an empty cylinder and a refill during{" "}
        <strong className="font-semibold">peak demand.</strong>
      </>
    ),
  },
  {
    label: "Unseen",
    color: "var(--color-violet)",
    body: (
      <>
        Between service visits, cylinders and lines degrade with{" "}
        <strong className="font-semibold">no warning.</strong>
      </>
    ),
  },
];

export function OxygenGap() {
  return (
    <section
      className="w-full relative overflow-hidden"
      aria-label="The oxygen access gap"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      {/* Ambient Coral wash — low-opacity radial pooled in the BOTTOM-RIGHT
          corner, well behind the row dashboard. Reinforces the section's
          existing tension color (eyebrow, "access gap." punchline, "Hours"
          row) without introducing a new hue. Masked to fade toward the top
          so the wash whispers rather than announces itself. Pairs against
          the cool valve diagram bleeding from the bottom-LEFT — the section
          reads as a diagonal: problem-diagram left, consequence-atmosphere
          right. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(ellipse 70% 55% at 92% 108%, rgba(239, 100, 97, 0.20), transparent 65%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.4) 78%, transparent 100%)",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.4) 78%, transparent 100%)",
        }}
      />

      {/* Bleed image — transparent PNG anchored to the section's BOTTOM-LEFT
          corner and pushed slightly past both edges so it literally bleeds
          off-screen on the left and the bottom. No card, no bg — the raw
          PNG floats and gives the section its immersive anchor.
          Height follows the source aspect (800×501) so the composition is
          preserved as it scales. */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute pointer-events-none"
        style={{
          left: "-3vw",
          bottom: "-1vw",
          width: "clamp(680px, 70vw, 1120px)",
          aspectRatio: "800 / 501",
          zIndex: 0,
        }}
      >
        <Image
          src={oxygenValve}
          alt=""
          fill
          sizes="(min-width: 768px) 62vw, 0px"
          placeholder="blur"
          priority={false}
          style={{ objectFit: "contain", objectPosition: "left bottom" }}
        />
      </div>

      <div className="container-page relative" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          {/* Left spacer — reserves visual room for the bleed image. */}
          <div className="hidden md:block md:col-span-3" aria-hidden />

          {/* Content column — prose stacked over the three-row dashboard.
              The rows sit tight under the subhead (no big gap) and each row
              is a single line: a wide-tracked colored LABEL + a plain-Ink
              statement, keyline separated. All type capped at 14px per spec. */}
          <div className="col-span-12 md:col-span-9 flex flex-col gap-8 md:gap-10">
            <div>
              <p
                className="eyebrow mb-4"
                style={{ color: "var(--color-violet)" }}
              >
                The problem
              </p>
              <h2
                className="mb-6 md:mb-8"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 1.2rem + 4.5vw, 4.5rem)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.03em",
                  fontWeight: 700,
                  textWrap: "balance",
                }}
              >
                The oxygen
                <br />
                <span style={{ color: "var(--color-coral)" }}>
                  access gap.
                </span>
              </h2>
              <p
                style={{
                  fontSize: "18px",
                  lineHeight: 1.55,
                  color: "var(--color-muted)",
                  maxWidth: "44rem",
                }}
              >
                Across Nigerian hospitals, the gap isn&rsquo;t supply.{" "}
                <span style={{ color: "var(--color-violet)" }}>
                  It&rsquo;s delivery, maintenance, and visibility.
                </span>
              </p>
            </div>

            {/* Three rows — same editorial treatment as the h2: big colored
                display word acting as a mini-heading, plain-Ink body below.
                Label picks up the testimonial trio (Teal / Coral / Violet)
                so the typography still rhymes with the payoff further down. */}
            <div data-stat-group style={{ maxWidth: "44rem" }}>
              {rows.map((r, i) => (
                <div
                  key={r.label}
                  data-stat-reveal
                  className="py-6 md:py-7 flex flex-col gap-2"
                  style={
                    i > 0
                      ? { borderTop: "1px solid var(--color-keyline)" }
                      : undefined
                  }
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.75rem, 1.2rem + 1.6vw, 2.5rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      fontWeight: 700,
                      color: r.color,
                      margin: 0,
                    }}
                  >
                    {r.label}
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      lineHeight: 1.5,
                      color: "var(--color-fg)",
                      margin: 0,
                    }}
                  >
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
            {/* FACT NEEDED: verify these framing numbers with a citable source. */}
          </div>
        </div>
      </div>
    </section>
  );
}
