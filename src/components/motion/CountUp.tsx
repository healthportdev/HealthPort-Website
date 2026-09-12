"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CountUp — one of the six allowed animations. Counts a numeric stat up from
 * 0 to its final value on first scroll-into-view, once. Respects
 * prefers-reduced-motion (renders final value immediately).
 *
 * Accepts a numeric `value` (with optional `prefix`, `suffix`, `decimals`).
 * When `value === null` the component renders `placeholder` (default "-") and
 * skips animation entirely — used while real client figures are pending.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
  placeholder = "-",
  className,
  style,
  ariaLabel,
}: {
  value: number | null;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(
    value === null
      ? placeholder
      : `${prefix}${(0).toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    if (value === null) {
      setDisplay(placeholder);
      return;
    }
    const el = nodeRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finalStr = `${prefix}${value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

    if (reduced) {
      setDisplay(finalStr);
      return;
    }

    let raf = 0;
    let start = 0;
    const zeroStr = `${prefix}${(0).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const cur = value * eased;
      setDisplay(
        `${prefix}${cur.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`
      );
      if (p < 1) raf = window.requestAnimationFrame(step);
      else setDisplay(finalStr);
    };

    let inView = false;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        const nowIn = entry.isIntersecting && entry.intersectionRatio > 0;
        if (nowIn === inView) return;
        inView = nowIn;

        if (raf) {
          window.cancelAnimationFrame(raf);
          raf = 0;
        }
        start = 0;

        if (nowIn) {
          setDisplay(zeroStr);
          raf = window.requestAnimationFrame(step);
        } else {
          setDisplay(zeroStr);
        }
      },
      { threshold: [0, 0.05, 0.2], rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [value, prefix, suffix, decimals, duration, placeholder]);

  return (
    <span
      ref={nodeRef}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {display}
    </span>
  );
}
