"use client";

import { useEffect, useRef } from "react";

/**
 * HeroWash — atmospheric radial wash for the top of a page hero.
 *
 * Parallax'd: moves at 0.4× scroll speed so it trails the page as you scroll,
 * creating depth. rAF-throttled scroll listener, GPU-friendly transform.
 * Respects prefers-reduced-motion.
 *
 * Two ramps, each ships its own layout (height + mask + radial positions)
 * so a page can pick the atmosphere that fits its hero:
 *   - "brand"    Coral · Violet · Sky pooled at the TOP of a compact hero.
 *                Used on the home hero, where the copy sits near the top
 *                and the video sits below.
 *   - "teagreen" Tea-Green cloud CENTERED on the hero's content. Used on
 *                the OaaS hero, which is a 90vh block with vertically-
 *                centered copy — the halo has to wrap the h1, not pool
 *                above the nav.
 */
export type HeroWashRamp = "brand" | "teagreen";

type WashConfig = {
  height: string;
  background: string;
  mask: string;
};

const CONFIGS: Record<HeroWashRamp, WashConfig> = {
  brand: {
    height: "70%",
    background: [
      "radial-gradient(ellipse 70% 60% at 12% -10%, rgba(239, 100, 97, 0.28), transparent 60%)",
      "radial-gradient(ellipse 80% 65% at 50% -15%, rgba(128, 16, 120, 0.22), transparent 60%)",
      "radial-gradient(ellipse 75% 60% at 88% -10%, rgba(93, 183, 222, 0.32), transparent 60%)",
    ].join(", "),
    // Fade top-down: opaque near the top, transparent near the bottom.
    mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.4) 75%, transparent 100%)",
  },
  teagreen: {
    // Top-pooled cloud, same layout skeleton as the home hero's "brand"
    // ramp — pools at the top of the section and fades toward the middle.
    // Only the palette differs (Tea-Green vs Coral · Violet · Sky).
    height: "70%",
    background: [
      "radial-gradient(ellipse 70% 60% at 20% -10%, rgba(204, 238, 170, 0.48), transparent 60%)",
      "radial-gradient(ellipse 85% 70% at 50% -15%, rgba(204, 238, 170, 0.36), transparent 60%)",
      "radial-gradient(ellipse 75% 60% at 82% -10%, rgba(204, 238, 170, 0.42), transparent 60%)",
    ].join(", "),
    mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.4) 75%, transparent 100%)",
  },
};

export function HeroWash({ ramp = "brand" }: { ramp?: HeroWashRamp } = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      el.style.transform = `translate3d(0, ${y * 0.4}px, 0)`;
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const config = CONFIGS[ramp];

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-x-0 top-0 -z-10 pointer-events-none"
      style={{
        height: config.height,
        willChange: "transform",
        background: config.background,
        WebkitMaskImage: config.mask,
        maskImage: config.mask,
      }}
    />
  );
}
