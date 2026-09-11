/**
 * OaaS §3 — What's included.
 *
 * Full-bleed 5-panel horizontal strip that runs edge-to-edge on the
 * viewport with no gaps between panels. Each panel is a portrait 3:4
 * photo with a frameless caption (Tea-Green title + Parchment subtitle)
 * overlaid on a heavy diagonal scrim. Panels stack to 1 column on
 * mobile so the images stay large enough to read.
 *
 * Merged from the original 7 items to 5 so each panel is wide enough
 * (~288px on a 1440px viewport) for a display-scale title.
 */
import Image, { type StaticImageData } from "next/image";

import piping from "../../../public/photos/regulator-install.jpg";
import monitoring from "../../../public/photos/pulse-oximeter-monitor.jpg";
import training from "../../../public/photos/nurse-monitor-incubator.jpg";
import maintenance from "../../../public/photos/technicians-servicing.jpg";
import partnership from "../../../public/photos/team-portrait-plant.jpg";

type Panel = {
  key: string;
  title: string;
  caption: string;
  image: StaticImageData;
};

// Content merged from the original 7 items:
//   Deployment + Piping     → Panel 1
//   Real-time monitoring     → Panel 2
//   Clinician training       → Panel 3
//   Maintenance + Delivery   → Panel 4
//   Ongoing partnership      → Panel 5
// Captions kept intentionally short (≤ 10 words) — each panel is narrow,
// so long paragraphs would fight the image and the reader can't scan a
// row of long descriptions.
const panels: Panel[] = [
  {
    key: "deploy",
    title: "Deployed and piped",
    caption: "Cylinders installed and piped to every bedside outlet.",
    image: piping,
  },
  {
    key: "monitoring",
    title: "Real-time monitoring",
    caption: "Live cylinder levels, usage, and refills via OxyIntel.",
    image: monitoring,
  },
  {
    key: "training",
    title: "Clinician training",
    caption: "Your team trained on safe handling and administration.",
    image: training,
  },
  {
    key: "ops",
    title: "Maintenance and delivery",
    caption: "Scheduled servicing and refills, end to end.",
    image: maintenance,
  },
  {
    key: "partnership",
    title: "Ongoing partnership",
    caption: "Your HealthPort team working alongside clinical staff.",
    image: partnership,
  },
];

export function WhatsIncluded() {
  return (
    <section
      className="w-full"
      aria-label="What's included in Oxygen as a Service"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      {/* Header — contained. */}
      <div className="container-page">
        <div
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-16"
          data-parallax="-0.1"
        >
          <p
            className="eyebrow mb-4"
            style={{ color: "var(--color-violet)" }}
          >
            What&rsquo;s included
          </p>
          <h2 className="mb-4" style={{ textWrap: "balance" }}>
            Everything needed to{" "}
            <span style={{ color: "var(--color-violet)" }}>
              deliver oxygen safely and effectively.
            </span>
          </h2>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.55,
              color: "var(--color-muted)",
            }}
          >
            Everything. End to end.
          </p>
        </div>
      </div>

      {/* Full-bleed panel strip — escapes the container-page and runs
          edge-to-edge across the viewport with zero gaps between panels. */}
      <div
        className="w-full grid"
        style={{
          gridTemplateColumns: "1fr",
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-5 gap-0"
        >
          {panels.map((p) => (
            <PanelCard key={p.key} panel={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PanelCard({ panel }: { panel: Panel }) {
  return (
    <article
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: "3 / 4",
        background: "var(--color-ink)",
      }}
    >
      <Image
        src={panel.image}
        alt={panel.title}
        fill
        sizes="(min-width: 768px) 20vw, 100vw"
        placeholder="blur"
        style={{ objectFit: "cover" }}
      />
      {/* Netflix-style overlay — strong vertical gradient with a heavy
          dark band at the bottom that fades cleanly to transparent by
          about 60% up. Reads as a floor of ink under the caption while
          leaving the upper 40% of the image completely visible. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,19,22,0.95) 0%, rgba(0,19,22,0.85) 18%, rgba(0,19,22,0.6) 38%, rgba(0,19,22,0.2) 60%, rgba(0,19,22,0) 78%)",
        }}
      />
      {/* Caption — bottom, frameless, sitting on the Netflix scrim.
          Title bumped up and subtitle bumped for readability on the
          narrower panels. */}
      <div
        className="absolute z-10"
        style={{
          left: "clamp(1.1rem, 2vw, 1.75rem)",
          right: "clamp(1.1rem, 2vw, 1.75rem)",
          bottom: "clamp(1.4rem, 2.5vw, 2rem)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(22px, 2.4vw, 32px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--color-teagreen)",
            margin: 0,
            marginBottom: "0.65rem",
            textWrap: "balance",
          }}
        >
          {panel.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(14px, 1vw, 16px)",
            lineHeight: 1.5,
            color: "rgba(242, 239, 234, 0.95)",
            margin: 0,
            textWrap: "balance",
          }}
        >
          {panel.caption}
        </p>
      </div>
    </article>
  );
}
