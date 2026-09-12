/**
 * §5 — What HealthPort does.
 * Light chapter. Centered eyebrow + headline + supporting line, then a large
 * hero image with a carousel dot indicator at the bottom. Matches Figma —
 * no card grid, no dark treatment.
 *
 * The dots are rendered as a visual affordance; multiple images will be added
 * when the client supplies wider facility photography. Until then the carousel
 * shows a single slide.
 */
import { WhatWeDoCarousel } from "@/components/home/WhatWeDoCarousel";

const slides = [
  {
    src: "/photos/incubator-with-cylinders.jpg",
    alt: "A newborn in a NICU incubator beside HealthPort-branded oxygen cylinders, infrastructure and care in one frame.",
    tag: "At the bedside",
    caption: "Bedside care, uninterrupted.",
    subtitle:
      "HealthPort cylinders feed every incubator and outlet, so clinicians never have to think about supply.",
  },
  {
    src: "/photos/oxygen-plant-nexair.jpg",
    alt: "HealthPort Nexair oxygen generation plant installed at a hospital.",
    tag: "At your facility",
    caption: "Oxygen generated on-site.",
    subtitle:
      "The Nexair plant is installed, commissioned, and maintained by us, so you get the supply, not the machinery to manage.",
  },
  {
    src: "/photos/technicians-servicing.jpg",
    alt: "HealthPort technicians servicing an oxygen concentrator on-site.",
    tag: "Our team",
    caption: "Everything is serviced by us.",
    subtitle:
      "Scheduled maintenance, on-call response, and technician training. End to end, no third parties.",
  },
  {
    src: "/photos/nurse-monitor-incubator.jpg",
    alt: "A nurse checking a bedside monitor at an incubator.",
    tag: "In operation",
    caption: "Real-time monitoring, 24/7.",
    subtitle:
      "OxyIntel watches every cylinder and outlet, alerting your team before shortages happen.",
  },
];

export function WhatWeDo() {
  return (
    <section className="chapter" aria-label="What HealthPort does">
      {/* Intro — centered per Figma. Parallax on the whole block so children
          stay put relative to each other and never overlap. */}
      <div
        className="flex flex-col items-center text-center mb-12 md:mb-16"
        data-parallax="-0.1"
      >
        <p className="eyebrow mb-6" style={{ color: "var(--color-violet)" }}>
          What we do
        </p>
        <h2 className="max-w-3xl mb-5" style={{ textWrap: "balance" }}>
          Built for hospitals to{" "}
          <span style={{ color: "var(--color-violet)" }}>connect,</span> not
          maintain.
        </h2>
        <p
          className="max-w-2xl"
          style={{
            color: "var(--color-muted)",
            fontSize: "var(--text-p2)",
            lineHeight: 1.55,
          }}
        >
          HealthPort designs, installs, and manages your hospital&rsquo;s
          oxygen infrastructure.
        </p>
      </div>

      {/* Hero carousel — real HealthPort photography with rich captions
          (tag + headline + subtitle per slide). Autoplay + dots. Section
          answers "what we do" through the carousel alone — the four
          pillars are told slide-by-slide there. */}
      <WhatWeDoCarousel slides={slides} intervalMs={5200} />
    </section>
  );
}
