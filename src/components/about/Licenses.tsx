/**
 * About §6 — Licences, certifications, and regulatory approvals.
 *
 * Centered compact layout matching the Figma: a small Violet
 * eyebrow, a two-line centered h2 with a Violet punchline on
 * "highest standards", then a row of small square certification
 * tiles. Tiles ship as styled text badges — the client will supply
 * real regulator/certification logos to drop in later; each tile is
 * already a `next/image`-ready container so a swap is one line.
 *
 * Motion: header + tiles fade up on IntersectionObserver reveal
 * with a per-tile stagger. Respects prefers-reduced-motion.
 */
"use client";

import { useEffect, useRef, useState } from "react";

type Cert = {
  key: string;
  short: string; // Short label rendered on the tile itself
  full: string; // Full name used for accessibility + tooltip
};

// Placeholder certifications — swap for real logos when supplied.
const certs: Cert[] = [
  { key: "iso-13485", short: "ISO", full: "ISO 13485 · Medical devices" },
  { key: "nafdac", short: "NAFDAC", full: "NAFDAC · Nigeria" },
  { key: "son", short: "SON", full: "Standards Organisation of Nigeria" },
  { key: "fmoh", short: "FMOH", full: "Federal Ministry of Health" },
  { key: "ce", short: "CE", full: "CE marking · European conformity" },
  { key: "iso-9001", short: "ISO 9001", full: "ISO 9001 · Quality management" },
];

export function Licenses() {
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
      className="w-full"
      aria-label="Licences and certifications"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        {/* Centered header */}
        <div
          className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 md:mb-14"
          data-parallax="-0.06"
        >
          <p
            className="eyebrow mb-4"
            style={{ color: "var(--color-violet)" }}
          >
            Standards
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
            Held to the{" "}
            <span style={{ color: "var(--color-violet)" }}>
              highest standards
            </span>
            .
          </h2>
        </div>

        {/* Tiles row — responsive grid, small square tiles */}
        <div
          className="grid gap-3 md:gap-4 max-w-4xl mx-auto"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(clamp(96px, 12vw, 128px), 1fr))`,
          }}
        >
          {certs.map((c, i) => (
            <CertTile
              key={c.key}
              cert={c}
              revealed={revealed}
              delay={140 + i * 80}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- CertTile ---------------------------- */

function CertTile({
  cert,
  revealed,
  delay,
}: {
  cert: Cert;
  revealed: boolean;
  delay: number;
}) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        aspectRatio: "1 / 1",
        background: "var(--color-parchment)",
        border: "1px solid var(--color-keyline)",
        borderRadius: "12px",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 480ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 480ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
      title={cert.full}
      aria-label={cert.full}
      role="img"
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(11px, 1vw, 14px)",
          fontWeight: 700,
          letterSpacing: "0.02em",
          color: "var(--color-heading)",
          textAlign: "center",
          lineHeight: 1.15,
          padding: "0 0.5rem",
        }}
      >
        {cert.short}
      </span>
    </div>
  );
}
