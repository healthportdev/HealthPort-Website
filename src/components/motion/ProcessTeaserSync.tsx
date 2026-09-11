"use client";

import { useEffect } from "react";

/**
 * ProcessTeaserSync — as the reader scrolls through the OaaS process
 * teaser's stage cards, the active card swaps to Violet and the sticky
 * panel's matching stage fades in. IntersectionObserver on each
 * [data-process-stage] with a middle-of-viewport threshold; the stage whose
 * midpoint is closest to viewport center wins.
 *
 * Respects prefers-reduced-motion: leaves the initial stage active.
 */
export function ProcessTeaserSync() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-process-root]");
    if (!root) return;

    const stages = Array.from(
      root.querySelectorAll<HTMLElement>("[data-process-stage]")
    );
    const panelStages = Array.from(
      root.querySelectorAll<HTMLElement>("[data-process-panel-stage]")
    );
    if (stages.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const setActive = (key: string) => {
      stages.forEach((s) => {
        const isActive = s.dataset.processStage === key;
        if (isActive) {
          s.dataset.active = "true";
          s.style.opacity = "1";
        } else {
          delete s.dataset.active;
          s.style.opacity = "0.42";
        }
        // Left marker line toggles with the active state.
        const marker = s.querySelector<HTMLElement>("[data-process-marker]");
        if (marker) marker.style.opacity = isActive ? "1" : "0";
      });
      panelStages.forEach((p) => {
        const isActive = p.dataset.processPanelStage === key;
        p.style.opacity = isActive ? "1" : "0";
        // Also toggle a data attribute so CSS animations inside each panel
        // can play/pause based on whether the panel is the active one.
        if (isActive) {
          p.dataset.active = "true";
        } else {
          delete p.dataset.active;
        }
      });
    };

    let raf = 0;
    let queued = false;

    const pick = () => {
      queued = false;
      const winH = window.innerHeight;
      const mid = winH * 0.45;
      let best: { key: string; d: number } | null = null;
      stages.forEach((s) => {
        const r = s.getBoundingClientRect();
        const stageMid = r.top + r.height / 2;
        const d = Math.abs(stageMid - mid);
        const key = s.dataset.processStage!;
        if (!best || d < best.d) best = { key, d };
      });
      if (best) setActive((best as { key: string; d: number }).key);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = window.requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
