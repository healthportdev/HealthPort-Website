/**
 * OaaS §2 — Why Oxygen as a Service?
 *
 * Rebuilt to mirror the home page's "Why hospitals choose HealthPort"
 * BeforeAfter treatment: a single-column list of six transformations
 * (Traditional → OaaS), each row animating on scroll — the Coral strike
 * draws across the "before" text, an arrow appears, and the OaaS side
 * fades in with its check.
 *
 * Client component: IntersectionObserver drives per-row reveal. Reveal
 * resets on scroll-out so the cascade replays. Respects prefers-reduced-
 * motion (renders instantly).
 */
"use client";

import { useEffect, useRef, useState } from "react";

type Transition = { before: string; after: string };

// Six paired transformations. Content matches the previous WhyOaas data,
// paired up so each traditional pain resolves into an OaaS behaviour.
// Copy kept intentionally SHORT on the "before" side so every row fits on
// a single line — the Coral strike is a single horizontal background line,
// so two-line wraps look wrong (strike drops under the last line rather
// than through the text).
const transitions: Transition[] = [
  {
    before: "Vendor-owned cylinders",
    after: "HealthPort supplies and owns the cylinders",
  },
  {
    before: "Vendor-driven maintenance",
    after: "Cylinders receive frequent, scheduled maintenance",
  },
  {
    before: "Hospital manages inventory",
    after: "HealthPort monitors usage in real time",
  },
  {
    before: "Coordinating multiple suppliers",
    after: "HealthPort manages replenishment",
  },
  {
    before: "Demand predicted manually",
    after: "HealthPort optimises distribution",
  },
  {
    before: "Emergency purchases ad hoc",
    after: "One predictable monthly invoice",
  },
];

export function WhyOaas() {
  const [allRevealed, setAllRevealed] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setAllRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        setAllRevealed(entry.isIntersecting && entry.intersectionRatio > 0);
      },
      { rootMargin: "0px 0px -12% 0px", threshold: [0, 0.15, 0.3] }
    );
    io.observe(list);
    return () => io.disconnect();
  }, []);

  return (
    <section
      className="w-full"
      aria-label="Why Oxygen as a Service"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        {/* Header — same rhythm as the home BeforeAfter: Teal accent line
            → violet eyebrow → h2 with the Violet punchline → sub → Coral
            accent line. Keeps the visual language consistent across
            "compare" sections. */}
        <div
          className="flex flex-col items-center text-center"
          data-parallax="-0.1"
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "32px",
              height: "2px",
              background: "var(--color-teal)",
              marginBottom: "24px",
            }}
          />
          <p
            className="eyebrow mb-5"
            style={{ color: "var(--color-violet)" }}
          >
            Why Oxygen as a Service?
          </p>
          <h2 className="max-w-3xl mb-4" style={{ textWrap: "balance" }}>
            Traditional models don&rsquo;t support{" "}
            <span style={{ color: "var(--color-violet)" }}>
              continuous care.
            </span>
          </h2>
          <p
            className="mb-6 max-w-xl"
            style={{
              color: "var(--color-fg)",
              fontSize: "var(--text-p2)",
              lineHeight: 1.5,
            }}
          >
            Stop managing oxygen. Let OaaS automate supply, reduce costs,
            and improve visibility.
          </p>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "32px",
              height: "2px",
              background: "var(--color-coral)",
              marginBottom: "56px",
            }}
          />
        </div>

        {/* Transformation rows */}
        <ul
          ref={listRef}
          className="list-none max-w-4xl mx-auto"
        >
          {transitions.map((t, i) => {
            const isRevealed = allRevealed;
            const rowDelay = i * 110;
            const strikeDelay = rowDelay + 220;
            const afterDelay = rowDelay + 420;
            return (
              <li
                key={t.before}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-8"
                style={{
                  padding: "22px 0",
                  borderTop:
                    i === 0 ? "1px solid var(--color-keyline)" : "none",
                  borderBottom: "1px solid var(--color-keyline)",
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed
                    ? "translateY(0)"
                    : "translateY(14px)",
                  transition: `opacity 500ms cubic-bezier(0.22,1,0.36,1) ${rowDelay}ms, transform 500ms cubic-bezier(0.22,1,0.36,1) ${rowDelay}ms`,
                }}
              >
                {/* Before — Coral X icon, strike-through draws across */}
                <div className="flex items-center gap-3 min-w-0">
                  <IconX revealed={isRevealed} delay={strikeDelay - 100} />
                  <span
                    style={{
                      display: "inline",
                      fontSize: "var(--text-p2)",
                      color: "var(--color-muted)",
                      lineHeight: 1.4,
                      backgroundImage:
                        "linear-gradient(var(--color-coral), var(--color-coral))",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "0 58%",
                      backgroundSize: isRevealed
                        ? "100% 1.5px"
                        : "0% 1.5px",
                      transition: `background-size 560ms cubic-bezier(0.22,1,0.36,1) ${strikeDelay}ms`,
                    }}
                  >
                    {t.before}
                  </span>
                </div>

                {/* Arrow — draws in with the outcome */}
                <ArrowRight revealed={isRevealed} delay={afterDelay - 100} />

                {/* After — fades in after the strike */}
                <div
                  className="flex items-center gap-3 min-w-0"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed
                      ? "translateX(0)"
                      : "translateX(-10px)",
                    transition: `opacity 460ms cubic-bezier(0.22,1,0.36,1) ${afterDelay}ms, transform 460ms cubic-bezier(0.22,1,0.36,1) ${afterDelay}ms`,
                  }}
                >
                  <IconCheck />
                  <span
                    style={{
                      fontSize: "var(--text-p2)",
                      color: "var(--color-fg)",
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {t.after}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function IconX({ revealed, delay = 0 }: { revealed: boolean; delay?: number }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      style={{
        flexShrink: 0,
        color: "var(--color-coral)",
        opacity: revealed ? 1 : 0.4,
        transition: `opacity 380ms ease-out ${delay}ms`,
      }}
    >
      <path
        d="M4 4l10 10M14 4l-10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0, color: "var(--color-teal)" }}
    >
      <path
        d="M3.5 9.5l3.5 3.5 7.5-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight({ revealed, delay = 0 }: { revealed: boolean; delay?: number }) {
  return (
    <span
      aria-hidden
      className="hidden md:flex items-center justify-center"
      style={{
        color: "var(--color-muted)",
        opacity: revealed ? 0.7 : 0,
        transform: revealed ? "translateX(0)" : "translateX(-6px)",
        transition: `opacity 380ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 380ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
        <path
          d="M1 6h19M15 1l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
