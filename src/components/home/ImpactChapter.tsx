/**
 * ImpactChapter — dark "Why we exist" chapter.
 *
 * Second Draft: single left-aligned column — eyebrow → headline (with the
 * word "oxygen" flipped to Tea Green as the brand accent) → prose body →
 * four horizontal stat cards. Surface is Ink; text reads Parchment.
 *
 * Motion: intro block rides SectionReveal (fade-up on first entry); the
 * four stats stagger in via [[StatReveal]] and each number counts up once
 * on scroll-in via [[CountUp]]. Both are within the six allowed motions.
 *
 * Values are treated as targets pending client confirmation — flip to
 * source-cited figures when the client signs off.
 */
import Image from "next/image";
import { CountUp } from "@/components/motion/CountUp";
import { metricsOrdered } from "@/lib/metrics";

const stats = metricsOrdered;

export function ImpactChapter() {
  return (
    <section
      className="relative w-full overflow-hidden isolate"
      style={{
        background: "var(--color-surface-dark)",
        color: "var(--color-parchment)",
      }}
      aria-label="Why we exist"
    >
      {/* Decorative background — stock placeholder, dimmed and desaturated so it
          reads as texture on the Ink chapter. Replace with commissioned photo. */}
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <Image
          src="/photos/newborn-nasal-cannula.jpg"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-center"
          data-parallax="0.22"
          style={{
            opacity: 0.22,
            filter: "grayscale(1) contrast(1.05) brightness(1.05)",
            mixBlendMode: "luminosity",
            scale: "1.25",
          }}
        />
      </div>

      <div
        className="relative container-page"
        style={{ paddingBlock: "var(--spacing-section)" }}
      >
        {/* Intro block — parallax on the whole block so children stay put
            relative to each other and never overlap. */}
        <div className="max-w-3xl" data-parallax="-0.1">
          <p
            className="eyebrow mb-6"
            style={{ color: "var(--color-teagreen)", opacity: 0.9 }}
          >
            Why we exist
          </p>
          <h2 style={{ color: "var(--color-parchment)" }}>
            Hospitals focus on care.
            <br />
            We handle the{" "}
            <span style={{ color: "var(--color-teagreen)" }}>oxygen</span>.
          </h2>
          <p
            className="mt-8"
            style={{
              color: "rgba(242,239,234,0.72)",
              fontSize: "var(--text-p2)",
              lineHeight: 1.6,
              maxWidth: "42rem",
            }}
          >
            HealthPort exists to remove that burden. We believe hospitals
            should never have to worry about oxygen availability so healthcare
            professionals can focus entirely on caring for patients.
          </p>
        </div>

        {/* Stats row — staggered reveal via StatReveal, each number counts up
            via CountUp on scroll-into-view. */}
        <div
          data-stat-group
          className="mt-16 md:mt-24 grid grid-cols-2 gap-x-8 gap-y-10 md:flex md:flex-row md:flex-wrap md:justify-between md:gap-x-6"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              data-stat-reveal
              className="flex flex-col gap-3"
            >
              <CountUp
                value={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h2)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--color-parchment)",
                }}
                ariaLabel={`${stat.label}: ${stat.value}${stat.suffix ?? ""}`}
              />
              <span
                style={{
                  color: "rgba(242,239,234,0.72)",
                  fontSize: "var(--text-p3)",
                  lineHeight: 1.4,
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
