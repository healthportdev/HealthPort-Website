/**
 * §6 — How it works.
 * Fruitful-style scroll-synced journey. Left column: dimmed stack of steps,
 * ~two visible in the viewport at a time; only the step nearest the viewport
 * centre is fully opaque. Right column: sticky visual, extends to the right
 * viewport edge (bleed), swaps to match the active step.
 *
 * No pin, no scrub, no parallax — position:sticky is CSS and the active
 * index comes from IntersectionObserver. Visuals are labelled placeholders
 * until commissioned photography lands.
 */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Step = {
  n: string;
  phase: "Onboarding" | "Continuous care";
  title: string;
  body: string;
  /** Photo path relative to /public, OR "billing" to render the animated
   *  monthly-cycle visual for step 06. */
  visual: string;
};

const steps: Step[] = [
  {
    n: "01",
    phase: "Onboarding",
    title: "Needs assessment",
    body: "We audit your current oxygen infrastructure, patient volume, and supply gaps.",
    visual: "/photos/technicians-servicing.jpg",
  },
  {
    n: "02",
    phase: "Onboarding",
    title: "Solution design",
    body: "A custom plan with cylinders, reticulation, monitoring hardware, and logistics sized to your facility.",
    visual: "/photos/regulator-install.jpg",
  },
  {
    n: "03",
    phase: "Onboarding",
    title: "Deployment",
    body: "Full installation, commissioning, and clinician training. Zero disruption to patient care.",
    visual: "/photos/oxygen-plant-nexair.jpg",
  },
  {
    n: "04",
    phase: "Continuous care",
    title: "Monitoring",
    body: "OxyIntel watches every cylinder and outlet 24/7 and alerts your team before shortages.",
    visual: "/photos/pulse-oximeter-monitor.jpg",
  },
  {
    n: "05",
    phase: "Continuous care",
    title: "Optimisation",
    body: "Data-driven adjustments to usage patterns, refill schedules, and predictive maintenance.",
    visual: "/photos/oxygen-tanks-close.jpg",
  },
  {
    n: "06",
    phase: "Continuous care",
    title: "Monthly usage billing",
    body: "One predictable invoice for what you actually used. No capital cost, no surprise refills.",
    visual: "billing",
  },
];

export function Journey() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const els = stepRefs.current.filter((el): el is HTMLLIElement => !!el);
    if (els.length === 0) return;

    const ratios = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target, e.intersectionRatio));
        let bestIdx = 0;
        let bestRatio = 0;
        els.forEach((el, i) => {
          const r = ratios.get(el) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestIdx = i;
          }
        });
        // When nothing is intersecting (scrolled fully past the section),
        // every ratio is 0 and bestIdx defaults to 0 — which used to flash
        // step 01's image over the top of step 06 as the user scrolled
        // away. Skip the update so the last active step stays pinned.
        if (bestRatio > 0) setActive(bestIdx);
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      aria-label="How it works"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      {/* Intro — stays contained. Parallax on the whole block so children
          move as a unit and never overlap. */}
      <div className="container-page mb-14 md:mb-20">
        <div className="max-w-3xl" data-parallax="-0.1">
          <p className="eyebrow mb-6" style={{ color: "var(--color-violet)" }}>
            How it works
          </p>
          <h2 style={{ textWrap: "balance" }}>
            From first call to{" "}
            <span style={{ color: "var(--color-violet)" }}>
              continuous care.
            </span>
          </h2>
          <p className="lead mt-6">
            HealthPort owns every step so nothing depends on hospital staff
            chasing it.
          </p>
        </div>
      </div>

      {/* Two-column region — LEFT aligns to container edge, RIGHT bleeds to viewport edge */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start"
        style={{
          // Left padding matches the container's left edge on wide screens
          // (max(pad, half of the extra beyond container-max) + pad).
          paddingLeft:
            "max(1.5rem, calc((100vw - var(--container-max)) / 2 + 1.5rem))",
          paddingRight: "0",
        }}
      >
        {/* LEFT — stacked step list */}
        <ol className="list-none flex flex-col">
          {steps.map((s, i) => {
            const isActive = i === active;
            return (
              <li
                key={s.n}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="relative"
                style={{
                  minHeight: "38vh",
                  paddingBlock: "2vh",
                  transition: "opacity 400ms ease",
                  opacity: isActive ? 1 : 0.32,
                }}
              >
                <p
                  className="eyebrow mb-4"
                  style={{
                    color: isActive
                      ? "var(--color-teal)"
                      : "var(--color-muted)",
                  }}
                >
                  Step {s.n} · {s.phase}
                </p>
                <h3
                  className="mb-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-h3)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.015em",
                    fontWeight: 600,
                    color: "var(--color-heading)",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "var(--color-fg)",
                    fontSize: "var(--text-p2)",
                    lineHeight: 1.55,
                    maxWidth: "36rem",
                  }}
                >
                  {s.body}
                </p>
              </li>
            );
          })}
        </ol>

        {/* RIGHT — sticky visual, bleeds to viewport right edge */}
        <div className="hidden md:block sticky top-24 self-start">
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "4 / 5",
              borderRadius: "28px 0 0 28px",
              background: "var(--color-ink)",
            }}
          >
            {steps.map((s, i) => {
              const isActive = i === active;
              const isBilling = s.visual === "billing";
              return (
                <div
                  key={s.n}
                  aria-hidden={!isActive}
                  className="absolute inset-0"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 520ms ease",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  {isBilling ? (
                    <BillingCycleVisual active={isActive} />
                  ) : (
                    <Image
                      src={s.visual}
                      alt={s.title}
                      fill
                      sizes="(max-width: 1200px) 50vw, 600px"
                      className="object-cover"
                      priority={false}
                    />
                  )}

                  {/* Step number badge (top-left, on top of photo) */}
                  {!isBilling && (
                    <div
                      className="absolute top-6 left-6 flex items-center gap-3 px-3 py-1.5"
                      style={{
                        background: "rgba(0,19,22,0.65)",
                        color: "var(--color-parchment)",
                        borderRadius: "999px",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono, ui-monospace)",
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                        }}
                      >
                        STEP {s.n}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}

/* ------------------------------------------------------------------
   BillingCycleVisual — the step 06 visual. Instead of a photo, an
   animated "invoice" card that cycles month-by-month, so the visual
   for "Monthly usage billing" is literally the monthly cycle in motion.
   Cycles only while active; pauses otherwise (nothing to see anyway).
   ------------------------------------------------------------------ */
function BillingCycleVisual({ active }: { active: boolean }) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  // Deterministic monthly usage sequence — reads like real data, not random.
  const amounts = [
    "₦482,000", "₦506,500", "₦468,900", "₦521,200", "₦497,800", "₦539,400",
    "₦512,750", "₦488,600", "₦530,100", "₦505,900", "₦519,300", "₦541,700",
  ];
  const litres = [
    "42,180 L", "44,240 L", "41,020 L", "45,570 L", "43,530 L", "47,150 L",
    "44,830 L", "42,720 L", "46,340 L", "44,220 L", "45,410 L", "47,340 L",
  ];

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % 12), 1600);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-8 md:p-10"
      style={{
        background:
          "radial-gradient(ellipse 90% 70% at 30% 20%, rgba(128,16,120,0.35), transparent 70%), radial-gradient(ellipse 90% 70% at 80% 90%, rgba(21,83,98,0.35), transparent 70%), var(--color-ink)",
      }}
    >
      {/* Invoice card */}
      <div
        className="w-full max-w-sm"
        style={{
          background: "rgba(242,239,234,0.05)",
          border: "1px solid rgba(242,239,234,0.14)",
          borderRadius: "16px",
          padding: "22px 24px",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          color: "var(--color-parchment)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <span
            style={{
              fontFamily: "var(--font-mono, ui-monospace)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(242,239,234,0.65)",
            }}
          >
            HEALTHPORT · INVOICE
          </span>
          <span
            className="inline-flex items-center gap-1.5"
            style={{
              fontSize: "11px",
              color: "var(--color-teagreen)",
              fontFamily: "var(--font-mono, ui-monospace)",
              letterSpacing: "0.05em",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--color-teagreen)",
              }}
            />
            PAID
          </span>
        </div>

        {/* Month — animated key change per cycle */}
        <div style={{ minHeight: "42px", overflow: "hidden" }}>
          <p
            key={`m-${idx}`}
            className="billing-slide-in"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              color: "var(--color-parchment)",
              margin: 0,
            }}
          >
            {months[idx]} 2026
          </p>
        </div>

        {/* Amount */}
        <div className="mt-4" style={{ minHeight: "48px", overflow: "hidden" }}>
          <p
            key={`a-${idx}`}
            className="billing-slide-in"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "34px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "var(--color-parchment)",
              margin: 0,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {amounts[idx]}
          </p>
        </div>

        {/* Usage line */}
        <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(242,239,234,0.1)" }}>
          <div className="flex justify-between" style={{ fontSize: "12px", color: "rgba(242,239,234,0.7)" }}>
            <span style={{ fontFamily: "var(--font-mono, ui-monospace)", letterSpacing: "0.06em" }}>OXYGEN USED</span>
            <span
              key={`l-${idx}`}
              className="billing-slide-in"
              style={{
                fontFamily: "var(--font-mono, ui-monospace)",
                letterSpacing: "0.03em",
                color: "var(--color-parchment)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {litres[idx]}
            </span>
          </div>
        </div>
      </div>

      {/* Step number badge (matches the photo cards) */}
      <div
        className="absolute top-6 left-6 flex items-center gap-3 px-3 py-1.5"
        style={{
          background: "rgba(0,19,22,0.65)",
          color: "var(--color-parchment)",
          borderRadius: "999px",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono, ui-monospace)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          STEP 06
        </span>
      </div>
    </div>
  );
}
