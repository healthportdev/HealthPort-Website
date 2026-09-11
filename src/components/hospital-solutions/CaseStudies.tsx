/**
 * Hospital Solutions §5 — Hospital stories.
 *
 * White page. Left-aligned editorial header, then a horizontal slider
 * of testimonial cards that bleeds off the right edge — the reader
 * scrolls or drag-scrolls horizontally to see more. Card layout
 * matches the Figma: rounded photo → title → italic pull-quote →
 * attribution → thin divider → Violet "Read Case Study →" link at the
 * bottom-right corner.
 *
 * The slider container aligns its left edge with container-page's
 * left edge (so the first card sits under the header), then extends
 * to the full viewport width — so cards can bleed to the right and
 * partial-preview the next one, hinting at scroll.
 *
 * Motion:
 *   - Header drifts via data-parallax
 *   - Each card fades up on IntersectionObserver reveal with a
 *     per-card stagger
 * Respects prefers-reduced-motion.
 */
"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import wardImage from "../../../public/photos/ward-conversation.jpg";
import nicuImage from "../../../public/photos/nurse-monitor-incubator.jpg";
import cylImage from "../../../public/photos/incubator-with-cylinders.jpg";
import teachingImage from "../../../public/photos/nicu-incubator-wide.jpg";
import districtImage from "../../../public/photos/regulator-install.jpg";
import childrensImage from "../../../public/photos/nurse-tending-newborn.jpg";

type Story = {
  key: string;
  location: string;
  quote: string;
  attribution: string;
  image: StaticImageData;
  href: string;
};

const stories: Story[] = [
  {
    key: "general",
    location: "A general hospital, Lagos",
    quote:
      "We handed over the oxygen problem to HealthPort and got back dozens of hours of administrative time every month.",
    attribution: "Folake Ogunsanya, CFO",
    image: wardImage,
    href: "#",
  },
  {
    key: "specialty",
    location: "A specialty facility, Lagos",
    quote:
      "Oxygen availability moved from a daily worry to a solved problem. Our clinical teams focus on care, not on chasing suppliers.",
    attribution: "Dr. Adeola Bakare, Medical Director",
    image: nicuImage,
    href: "#",
  },
  {
    key: "referral",
    location: "A referral hospital, Accra",
    quote:
      "Predictable monthly costs, real-time visibility, and one number to call. That’s the partnership we needed.",
    attribution: "Kwame Mensah, Operations Manager",
    image: cylImage,
    href: "#",
  },
  {
    key: "teaching",
    location: "A teaching hospital, Abuja",
    quote:
      "No more midnight phone calls about cylinder shortages. Uninterrupted care, and a partner who owns the SLA with us.",
    attribution: "Prof. Chidinma Okonkwo, Chief Medical Officer",
    image: teachingImage,
    href: "#",
  },
  {
    key: "district",
    location: "A district hospital, Ibadan",
    quote:
      "Onboarding was smooth. Within 30 days our reticulation was live and the whole clinical team was trained.",
    attribution: "Ibrahim Suleiman, Head of Facilities",
    image: districtImage,
    href: "#",
  },
  {
    key: "childrens",
    location: "A children’s hospital, Enugu",
    quote:
      "Predictable oxygen supply changed how we plan surgeries. The demand forecasting has been remarkably accurate.",
    attribution: "Dr. Ngozi Adeyemi, Surgical Director",
    image: childrensImage,
    href: "#",
  },
];

export function CaseStudies() {
  const rootRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduced) {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // First-card left edge must align exactly with the header's left
  // edge. container-page centres its content in a 75rem max-width and
  // adds inline padding of var(--container-pad-x). So the content's
  // left position from the viewport = max(pad, (100vw - 75rem)/2 + pad).
  const edgeLeft =
    "max(var(--container-pad-x), calc((100vw - var(--container-max)) / 2 + var(--container-pad-x)))" as const;
  // Right-side padding matches the container-pad-x so the last card
  // has the same breathing room when the reader scrolls to the end.
  const edgeRight = "var(--container-pad-x)" as const;

  return (
    <section
      ref={rootRef}
      className="w-full"
      aria-label="Hospital stories"
      style={{
        background: "var(--color-white)",
        color: "var(--color-ink)",
        paddingBlock: "var(--spacing-section)",
      }}
    >
      {/* Header — respects container-page */}
      <div className="container-page">
        <div className="max-w-3xl mb-12 md:mb-16" data-parallax="-0.08">
          <p
            className="eyebrow mb-5"
            style={{ color: "var(--color-violet)" }}
          >
            Stories
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 1.6rem + 2.2vw, 3.5rem)",
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              color: "var(--color-heading)",
              margin: 0,
              marginBottom: "1rem",
              textWrap: "balance",
            }}
          >
            Hospital stories
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1vw, 17px)",
              lineHeight: 1.55,
              color: "var(--color-muted)",
              margin: 0,
            }}
          >
            Real facilities, real teams, real change.
          </p>
        </div>
      </div>

      {/* Slider — full-viewport-width scroll container. Left edge
          aligns with container-page's left; right edge extends off
          the viewport so cards bleed. `scrollPaddingInlineStart`
          matches the flex row's paddingLeft, so scroll-snap treats
          the padded position as the "start" — otherwise the browser
          auto-scrolls the first card to hug the raw container edge
          and the initial alignment with the header is broken. */}
      <div
        className="w-full overflow-x-auto"
        style={{
          scrollSnapType: "x mandatory",
          scrollPaddingInlineStart: edgeLeft,
          scrollPaddingInlineEnd: edgeRight,
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          className="flex gap-5 md:gap-6"
          style={{
            paddingLeft: edgeLeft,
            paddingRight: edgeRight,
            paddingBlock: "0.5rem",
          }}
        >
          {stories.map((story, i) => (
            <StoryCard
              key={story.key}
              story={story}
              revealed={revealed}
              delay={140 + i * 130}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- StoryCard ---------------------------- */

function StoryCard({
  story,
  revealed,
  delay,
}: {
  story: Story;
  revealed: boolean;
  delay: number;
}) {
  return (
    <article
      className="flex flex-col flex-shrink-0"
      style={{
        // Fixed card width so 2 fit on desktop + third peeks in.
        width: "clamp(300px, 32vw, 440px)",
        scrollSnapAlign: "start",
        background: "var(--color-white)",
        border: "1px solid var(--color-keyline)",
        borderRadius: "clamp(18px, 1.8vw, 22px)",
        overflow: "hidden",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 580ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 580ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {/* Photo — fills card top, aspect 4:3, with a subtle Ink scrim
          overlay so the photos read as editorial (deeper blacks,
          slightly cooled highlights) rather than raw jpeg. Solid
          alpha layer, not a gradient — constitution-clean. */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: "4 / 3",
          background: "var(--color-ink)",
        }}
      >
        <Image
          src={story.image}
          alt=""
          fill
          sizes="(min-width: 768px) 32vw, 100vw"
          placeholder="blur"
          style={{ objectFit: "cover" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(0, 19, 22, 0.14)" }}
        />
      </div>

      {/* Content */}
      <div
        className="flex flex-col"
        style={{
          padding: "clamp(1.5rem, 2vw, 2rem)",
          flex: "1 1 auto",
        }}
      >
        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(19px, 1.4vw, 22px)",
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            color: "var(--color-heading)",
            margin: 0,
            marginBottom: "0.85rem",
          }}
        >
          {story.location}
        </h3>

        {/* Italic pull-quote */}
        <p
          style={{
            fontSize: "clamp(14.5px, 1vw, 16px)",
            lineHeight: 1.5,
            fontStyle: "italic",
            color: "var(--color-fg)",
            opacity: 0.85,
            margin: 0,
            marginBottom: "0.85rem",
          }}
        >
          &ldquo;{story.quote}&rdquo;
        </p>

        {/* Attribution */}
        <p
          style={{
            fontSize: "13.5px",
            color: "var(--color-muted)",
            margin: 0,
            marginBottom: "clamp(1.25rem, 1.8vw, 1.5rem)",
          }}
        >
          &mdash; {story.attribution}
        </p>

        {/* Divider */}
        <div
          aria-hidden
          style={{
            height: "1px",
            background: "var(--color-keyline)",
            marginBottom: "clamp(1rem, 1.4vw, 1.25rem)",
          }}
        />

        {/* Read Case Study link — bottom-right, Violet */}
        <div className="flex justify-end mt-auto">
          <Link
            href={story.href}
            className="inline-flex items-center gap-2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14.5px",
              fontWeight: 600,
              color: "var(--color-violet)",
              letterSpacing: "-0.005em",
            }}
          >
            Read Case Study
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
        </div>
      </div>
    </article>
  );
}
