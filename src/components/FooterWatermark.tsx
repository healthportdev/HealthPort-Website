"use client";

import { useEffect, useRef, useState } from "react";

/**
 * FooterWatermark — the huge translucent "HealthPort" wordmark at the
 * bottom of the footer. Fades in and rises from below every time it enters
 * view; resets when it leaves so the reveal plays again on next entry.
 * Respects prefers-reduced-motion.
 */
export function FooterWatermark() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setRevealed(entry.isIntersecting && entry.intersectionRatio > 0);
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: [0, 0.1, 0.25] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-x-0 bottom-0 pointer-events-none flex justify-center"
      style={{ zIndex: 0 }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "max(140px, 22vw)",
          lineHeight: 0.85,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          color: "rgba(242,239,234,0.05)",
          userSelect: "none",
          whiteSpace: "nowrap",
          transform: revealed
            ? "translateY(28%)"
            : "translateY(60%)",
          opacity: revealed ? 1 : 0,
          transition:
            "opacity 900ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1)",
          willChange: "opacity, transform",
        }}
      >
        HealthPort
      </span>
    </div>
  );
}
