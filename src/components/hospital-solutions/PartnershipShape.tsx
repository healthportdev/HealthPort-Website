/**
 * Hospital Solutions §3 — What partnership looks like.
 *
 * Dark Ink chapter. Left-aligned editorial header (Tea Green
 * eyebrow + Tea Green h2 + muted sub), then a 2×2 grid holding
 * three bordered cards. The bottom-right cell is intentionally
 * empty so the faded shake-hands-line outline that bleeds from
 * that corner has room to breathe.
 *
 * Motion:
 *   - Header drifts via data-parallax
 *   - Handshake bleed drifts deeper on its own parallax
 *   - Each card fades up on IntersectionObserver reveal with a
 *     per-card stagger
 * Respects prefers-reduced-motion.
 */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import shakeHands from "../../../public/images/shake-hands-line.png";

type PartnershipItem = {
  title: string;
  body: string;
};

const items: PartnershipItem[] = [
  {
    title: "Dedicated assessment",
    body: "A HealthPort team maps your facility’s real oxygen demand before anything is installed.",
  },
  {
    title: "Infrastructure & services",
    body: "Cylinders, reticulation, oximeters, and gauges installed, owned, and maintained by HealthPort.",
  },
  {
    title: "The OxyIntel advantage",
    body: "Every facility gets live monitoring and demand forecasting as standard, not an add-on.",
  },
];

export function PartnershipShape() {
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className="w-full relative overflow-hidden"
      aria-label="What partnership looks like"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-parchment)",
        paddingBlock: "var(--spacing-section)",
      }}
    >
      {/* Bleed handshake — oversized bottom-right so the parallax
          translation stays inside the safe zone. Section
          overflow:hidden clips the "spare". The source PNG is very
          light-coloured, so on the dark Ink bg the opacity has to
          climb higher than it would on Parchment to still read. */}
      <div
        aria-hidden="true"
        data-parallax="-0.14"
        className="hidden md:block absolute pointer-events-none"
        style={{
          right: "-6vw",
          bottom: "-8vw",
          width: "clamp(600px, 66vw, 980px)",
          aspectRatio: "1 / 1",
          opacity: 0.4,
          zIndex: 0,
        }}
      >
        <Image
          src={shakeHands}
          alt=""
          fill
          sizes="(min-width: 768px) 66vw, 0px"
          placeholder="blur"
          priority={false}
          style={{ objectFit: "contain", objectPosition: "right bottom" }}
        />
      </div>

      <div className="container-page relative" style={{ zIndex: 1 }}>
        {/* Header — LEFT aligned (matches Figma), Tea Green throughout */}
        <div className="max-w-3xl mb-12 md:mb-16" data-parallax="-0.08">
          <p
            className="eyebrow mb-5"
            style={{ color: "var(--color-teagreen)" }}
          >
            Partnership
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 1.6rem + 2.2vw, 3.5rem)",
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              color: "var(--color-parchment)",
              margin: 0,
              marginBottom: "1rem",
              textWrap: "balance",
            }}
          >
            What partnership looks like
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1vw, 17px)",
              lineHeight: 1.55,
              color: "rgba(242, 239, 234, 0.72)",
              margin: 0,
            }}
          >
            A managed relationship, not a vendor contract.
          </p>
        </div>

        {/* 2×2 grid — three cards; bottom-right slot intentionally
            empty so the handshake bleed has room to speak. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-5xl">
          {items.map((item, i) => (
            <PartnershipCard
              key={item.title}
              item={item}
              revealed={revealed}
              delay={140 + i * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Card ---------------------------- */

function PartnershipCard({
  item,
  revealed,
  delay,
}: {
  item: PartnershipItem;
  revealed: boolean;
  delay: number;
}) {
  return (
    <article
      className="flex flex-col"
      style={{
        borderRadius: "clamp(18px, 1.8vw, 22px)",
        border:
          "1px solid color-mix(in srgb, var(--color-teagreen) 22%, transparent)",
        padding: "clamp(2rem, 2.6vw, 2.5rem)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 580ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 580ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(20px, 1.6vw, 24px)",
          fontWeight: 700,
          lineHeight: 1.25,
          letterSpacing: "-0.015em",
          color: "var(--color-parchment)",
          margin: 0,
          marginBottom: "0.85rem",
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          fontSize: "15px",
          lineHeight: 1.55,
          color: "rgba(242, 239, 234, 0.78)",
          margin: 0,
          maxWidth: "42ch",
        }}
      >
        {item.body}
      </p>
    </article>
  );
}
