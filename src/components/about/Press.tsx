/**
 * About §8 — Coverage and recognition.
 *
 * Centered compact header, then a horizontal user-scrollable row of
 * publication cards that bleeds off the right edge. Same slider
 * grammar the Hospital Solutions CaseStudies section uses — the
 * first card aligns with the header's left content edge, cards
 * extend to the viewport right, and the reader drags / scrolls
 * horizontally. Auto-motion off — this is user-driven, not a
 * ticker.
 *
 * Cards ship as styled text placeholders (publication name in
 * display type + article title). Swap the publication tile for a
 * real logo when the client supplies one.
 */
"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import oxygenPlantImg from "../../../public/photos/oxygen-plant-nexair.jpg";
import wardConversationImg from "../../../public/photos/ward-conversation.jpg";
import techniciansImg from "../../../public/photos/technicians-servicing.jpg";
import regulatorImg from "../../../public/photos/regulator-install.jpg";
import teamPortraitImg from "../../../public/photos/team-portrait-plant.jpg";

type Press = {
  key: string;
  publication: string;
  title: string;
  href: string;
  date: string;
  thumbnail: StaticImageData;
};

const items: Press[] = [
  {
    key: "quartz",
    publication: "QUARTZ",
    title:
      "How HealthPort is building the oxygen infrastructure of tomorrow.",
    href: "#",
    date: "2026",
    thumbnail: oxygenPlantImg,
  },
  {
    key: "stat",
    publication: "STAT",
    title:
      "Africa's medical oxygen crisis, and the operators trying to solve it.",
    href: "#",
    date: "2025",
    thumbnail: wardConversationImg,
  },
  {
    key: "the-guardian",
    publication: "The Guardian",
    title:
      "Reliable oxygen access reaches more Nigerian hospitals through managed service.",
    href: "#",
    date: "2025",
    thumbnail: regulatorImg,
  },
  {
    key: "bloomberg",
    publication: "Bloomberg",
    title:
      "A new model for medical infrastructure is scaling across West Africa.",
    href: "#",
    date: "2024",
    thumbnail: techniciansImg,
  },
  {
    key: "techcabal",
    publication: "TechCabal",
    title:
      "Inside HealthPort: engineering, operations, and OxyIntel.",
    href: "#",
    date: "2024",
    thumbnail: teamPortraitImg,
  },
];

export function Press() {
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

  // Same container-page math the CaseStudies slider uses so the
  // first card lines up under the header's left edge exactly.
  const edgeLeft =
    "max(var(--container-pad-x), calc((100vw - var(--container-max)) / 2 + var(--container-pad-x)))" as const;
  const edgeRight = "var(--container-pad-x)" as const;

  return (
    <section
      ref={rootRef}
      className="w-full"
      aria-label="Coverage and recognition"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      {/* Header — centered, compact, matches Licences grammar */}
      <div className="container-page">
        <div
          className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 md:mb-14"
          data-parallax="-0.06"
        >
          <p
            className="eyebrow mb-4"
            style={{ color: "var(--color-violet)" }}
          >
            Coverage & recognition
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--color-heading)",
              textAlign: "center",
              textWrap: "balance",
              margin: 0,
            }}
          >
            Coverage and recognition{" "}
            <span style={{ color: "var(--color-violet)" }}>to date</span>
            .
          </h2>
        </div>
      </div>

      {/* Slider — full-viewport-width horizontal scroll, cards bleed
          off the right, first card aligns with container-page's left
          content edge. `scroll-snap` keeps card alignment clean but
          the row is drag/scroll-driven, not auto-animating. */}
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
          className="flex"
          style={{
            paddingLeft: edgeLeft,
            paddingRight: edgeRight,
            paddingBlock: "0.5rem",
            gap: "clamp(1rem, 1.5vw, 1.5rem)",
          }}
        >
          {items.map((p, i) => (
            <PressCard
              key={p.key}
              press={p}
              revealed={revealed}
              delay={140 + i * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- PressCard ---------------------------- */

function PressCard({
  press,
  revealed,
  delay,
}: {
  press: Press;
  revealed: boolean;
  delay: number;
}) {
  return (
    <article
      className="flex flex-col flex-shrink-0"
      style={{
        // Fixed card width so ~2.5 fit on desktop with the next
        // peeking — that's the "bleed to the right" hint.
        width: "clamp(280px, 30vw, 420px)",
        scrollSnapAlign: "start",
        background: "var(--color-white)",
        border: "1px solid var(--color-keyline)",
        borderRadius: "clamp(16px, 1.6vw, 20px)",
        overflow: "hidden",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 560ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 560ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {/* Thumbnail photo — landscape 16:9 at the top of the card. */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: "16 / 9",
          background: "var(--color-ink)",
        }}
      >
        <Image
          src={press.thumbnail}
          alt=""
          fill
          sizes="(min-width: 768px) 30vw, 90vw"
          placeholder="blur"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Content */}
      <div
        className="flex flex-col flex-1"
        style={{
          padding: "clamp(1.25rem, 1.8vw, 1.75rem)",
        }}
      >
        {/* Publication + date row — small caps eyebrow */}
        <div
          className="flex items-center justify-between mb-3"
          style={{
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
          }}
        >
          <span style={{ color: "var(--color-heading)" }}>
            {press.publication}
          </span>
          <span style={{ color: "var(--color-muted)" }}>
            {press.date}
          </span>
        </div>

        {/* Article title */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(15px, 1.15vw, 17px)",
            fontWeight: 600,
            lineHeight: 1.35,
            letterSpacing: "-0.005em",
            color: "var(--color-heading)",
            margin: 0,
            marginBottom: "1rem",
            flex: 1,
          }}
        >
          {press.title}
        </p>

        {/* Read link — bottom-right */}
        <div
          className="flex justify-end"
          style={{
            borderTop: "1px solid var(--color-keyline)",
            paddingTop: "0.85rem",
          }}
        >
          <a
            href={press.href}
            className="inline-flex items-center gap-1.5"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--color-violet)",
              letterSpacing: "-0.005em",
            }}
          >
            Read
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 6h8M7 3l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
