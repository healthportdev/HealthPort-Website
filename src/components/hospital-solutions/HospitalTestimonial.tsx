/**
 * Hospital Solutions §6 — Testimonials.
 *
 * Minimal header ("TESTIMONIALS" eyebrow) sitting above the shared
 * TestimonialVideo (poster + tap-to-play with sound, same behaviour
 * as the home version). The video wrapper picks up the exact
 * scroll-scale animation the home HeroVideo uses — the outer
 * container scales 0.85 → 1.30 as the section enters the viewport,
 * so the frame grows into presence as the reader arrives. Respects
 * prefers-reduced-motion.
 */
"use client";

import { useEffect, useRef } from "react";
import { TestimonialVideo } from "@/components/home/TestimonialVideo";

export function HospitalTestimonial() {
  const scaleRef = useRef<HTMLDivElement>(null);

  // Scroll-driven scale on the outer wrapper (0.85 → 1.30) — copied
  // exactly from HeroVideo so the two moments feel unified.
  useEffect(() => {
    const el = scaleRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduced) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      let p = 0;
      if (rect.bottom > 0 && rect.top < winH) {
        p = Math.min(1, Math.max(0, (winH - rect.top) / (winH * 0.9)));
      } else if (rect.top < 0) {
        p = 1;
      }
      const scale = 0.5 + p * 0.4; // 0.5 → 0.9
      el.style.transform = `scale(${scale})`;
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      aria-label="Testimonials"
      className="overflow-hidden"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        {/* Header — big monumental centred title */}
        <div className="flex justify-center mb-10 md:mb-14">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              color: "var(--color-heading)",
              textAlign: "center",
              margin: 0,
            }}
          >
            Testimonials.
          </h2>
        </div>

        {/* Scroll-scale wrapper — outer div grows 0.85 → 1.30 as the
            section moves through the viewport. Transform-origin is
            center-top so the growth reads as "the video pushing
            toward you" rather than "sliding down the screen". */}
        <div
          ref={scaleRef}
          className="w-full"
          style={{
            transformOrigin: "center top",
            willChange: "transform",
            transition: "transform 40ms linear",
          }}
        >
          <TestimonialVideo />
        </div>
      </div>
    </section>
  );
}
