/**
 * About §2 — Why we exist / Mission chapter.
 *
 * Two-column layout matching the Figma: LEFT column carries the
 * mission copy (small eyebrow → h2 with Violet punchline → body),
 * RIGHT column carries the 2035 vision stats stacked in a quiet
 * editorial block. Neutral throughout — no card surface, thin
 * `--color-keyline` dividers only, numbers in Ink.
 *
 * Stats count up 0 → target on IntersectionObserver reveal (per
 * constitution's allowed motion). Respects prefers-reduced-motion.
 */
"use client";

import { useEffect, useRef, useState } from "react";

type VisionStat = {
  label: string;
  target: number;
  suffix: string;
};

const stats: VisionStat[] = [
  { label: "hospitals reached", target: 10000, suffix: "+" },
  { label: "lives saved each year", target: 100000, suffix: "+" },
  { label: "by", target: 2035, suffix: "" },
];

export function WhyWeExistReprise() {
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
      aria-label="Why we exist"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] gap-12 md:gap-20 items-start">
          {/* LEFT — mission copy */}
          <div data-parallax="-0.06">
            <p
              className="eyebrow mb-5"
              style={{ color: "var(--color-violet)" }}
            >
              Why we exist
            </p>
            <h2
              className="mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 1.5rem + 1.8vw, 3rem)",
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "var(--color-heading)",
                textWrap: "balance",
                margin: 0,
              }}
            >
              Every day, patients lose access to{" "}
              <span style={{ color: "var(--color-violet)" }}>
                life-saving oxygen
              </span>{" "}
              &mdash; not because it doesn&rsquo;t exist, but because
              healthcare systems struggle to deliver it reliably.
            </h2>
            <p
              style={{
                fontSize: "clamp(15px, 1vw, 17px)",
                lineHeight: 1.6,
                color: "var(--color-muted)",
                margin: 0,
                maxWidth: "44ch",
              }}
            >
              HealthPort exists to remove that burden. Hospitals should
              never have to worry about oxygen availability — so
              healthcare professionals can focus entirely on caring for
              patients.
            </p>
          </div>

          {/* RIGHT — vision stats stack */}
          <div data-parallax="-0.03">
            <p
              className="eyebrow mb-6"
              style={{
                color: "var(--color-muted)",
                fontSize: "10px",
                letterSpacing: "0.16em",
              }}
            >
              Our vision by 2035
            </p>

            <ul className="list-none flex flex-col">
              {stats.map((s, i) => (
                <StatRow
                  key={s.label}
                  stat={s}
                  revealed={revealed}
                  index={i}
                  isLast={i === stats.length - 1}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- StatRow ---------------------------- */

function StatRow({
  stat,
  revealed,
  index,
  isLast,
}: {
  stat: VisionStat;
  revealed: boolean;
  index: number;
  isLast: boolean;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!revealed) return;
    const duration = 1600;
    const delay = 200 + index * 160;
    const start = performance.now() + delay;
    let raf = 0;
    const step = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(step);
        return;
      }
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(stat.target * eased);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setCurrent(stat.target);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [revealed, stat.target, index]);

  return (
    <li
      className="flex items-baseline justify-between"
      style={{
        borderBottom: isLast
          ? "none"
          : "1px solid var(--color-keyline)",
        paddingBlock: "clamp(1rem, 1.5vw, 1.4rem)",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          lineHeight: 1.4,
          color: "var(--color-muted)",
        }}
      >
        {stat.label}
      </span>
      <span
        style={{
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
          fontSize: "clamp(1.5rem, 1.1rem + 1.4vw, 2.25rem)",
          fontWeight: 700,
          lineHeight: 1,
          color: "var(--color-heading)",
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.round(current).toLocaleString()}
        {stat.suffix}
      </span>
    </li>
  );
}
