/**
 * Hospital Solutions §4 — Signs HealthPort is right for your facility.
 *
 * Tea Green chapter, editorial 2-column layout: bold left column
 * (h2 + sub + primary CTA), right column carries the signs list as a
 * single stack with Teal check discs. Same visual grammar the
 * WhatsComing timeline uses on the OxyIntel page — anchors the reader
 * with the claim on the left while the list scans on the right.
 *
 * Motion:
 *   - Left column stays visually still (sticky on desktop, no
 *     parallax — transform breaks sticky positioning)
 *   - Each sign fades up on scroll into view with a per-item stagger
 * Respects prefers-reduced-motion.
 */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const signs = [
  "You’re running out of oxygen more often than you should",
  "Growing demand is outpacing your current supply arrangements",
  "You depend on multiple suppliers with inconsistent service",
  "Cylinders go missing, wait unused, or return late",
  "You want real-time visibility into what’s where",
  "You want predictable monthly costs instead of surprise refills",
];

export function SignsRightForYou() {
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

  return (
    <section
      ref={rootRef}
      className="w-full"
      aria-label="Signs HealthPort is right for your facility"
      style={{
        background: "var(--color-teagreen)",
        color: "var(--color-ink)",
        paddingBlock: "var(--spacing-section)",
      }}
    >
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 md:gap-20 items-start">
          {/* LEFT — bold editorial header, sticky on desktop */}
          <div className="md:sticky md:top-24">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 1.5rem + 2vw, 3.25rem)",
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                color: "var(--color-ink)",
                margin: 0,
                marginBottom: "1.25rem",
                textWrap: "balance",
              }}
            >
              Signs{" "}
              <span style={{ color: "var(--color-violet)" }}>
                HealthPort
              </span>{" "}
              is right for your facility.
            </h2>
            <p
              style={{
                fontSize: "clamp(15px, 1vw, 17px)",
                lineHeight: 1.6,
                color: "var(--color-ink)",
                opacity: 0.72,
                margin: 0,
                marginBottom: "clamp(2rem, 2.5vw, 2.5rem)",
                maxWidth: "36ch",
              }}
            >
              If two or three of these sound familiar, we should talk.
            </p>
            <Link href="/contact" className="btn-primary">
              Book an assessment
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

          {/* RIGHT — signs stack, one per row */}
          <ol className="list-none flex flex-col gap-3.5 md:gap-4">
            {signs.map((sign, i) => (
              <SignRow
                key={sign}
                text={sign}
                revealed={revealed}
                delay={200 + i * 90}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- SignRow ---------------------------- */

function SignRow({
  text,
  revealed,
  delay,
}: {
  text: string;
  revealed: boolean;
  delay: number;
}) {
  return (
    <li
      className="flex items-start gap-3.5"
      style={{
        background: "rgba(255, 255, 255, 0.4)",
        border: "1px solid rgba(0, 19, 22, 0.08)",
        borderRadius: "clamp(12px, 1.4vw, 16px)",
        padding: "clamp(1rem, 1.4vw, 1.15rem) clamp(1.15rem, 1.6vw, 1.4rem)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 480ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 480ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      <CheckDisc />
      <span
        style={{
          fontSize: "clamp(14.5px, 1vw, 16px)",
          lineHeight: 1.5,
          color: "var(--color-ink)",
        }}
      >
        {text}
      </span>
    </li>
  );
}

function CheckDisc() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        background: "var(--color-teal)",
        marginTop: "1px",
      }}
    >
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
        <path
          d="M1.5 5 L 4.5 8 L 10.5 1.5"
          stroke="var(--color-parchment)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
