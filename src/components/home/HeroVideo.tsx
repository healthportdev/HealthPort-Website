/**
 * Hero video — the ONE autoplay exception per CLAUDE.md.
 *
 * `muted playsinline loop preload="metadata"` with poster and a soft gradient
 * overlay so the hero copy stays AA-readable on any frame. Tap the "watch
 * with sound" pill to unmute (restarts from 0 for a proper viewing).
 *
 * Bandwidth guards:
 *  - Skips video source entirely when `navigator.connection.saveData` is on
 *    or effectiveType is 2g/3g — poster shows alone.
 *  - Pauses under `prefers-reduced-motion: reduce`.
 *
 * Scroll behaviour: outer container scales 0.85 → 1.30 as it enters the
 * viewport. Caption pill counter-scales so it stays visually stable while
 * the frame around it grows. rAF-throttled, GPU transforms.
 */
"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/hero-loop.mp4?v=massey60";
const POSTER_SRC = "/videos/hero-poster.jpg";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};
type NavigatorWithConnection = Navigator & { connection?: NetworkInformation };

export function HeroVideo() {
  const scaleRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(true);
  const [muted, setMuted] = useState(true);

  // Bandwidth + reduced-motion guards on mount
  useEffect(() => {
    const conn = (navigator as NavigatorWithConnection).connection;
    const slow =
      conn?.saveData ||
      (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType));
    if (slow) {
      setLoadVideo(false); // poster only
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      v.pause();
      return;
    }
    // Force muted imperatively — React's JSX `muted` prop can lag behind
    // the property, and browsers gate autoplay on the DOM property being true.
    v.muted = true;
    v.setAttribute("muted", "");
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch((err) => {
        // Surface autoplay rejections instead of silently swallowing them.
        console.warn("[HeroVideo] autoplay rejected:", err);
      });
    }
  }, [loadVideo]);

  // Pause when scrolled out of view, resume when back in view. Uses a
  // "hasBeenVisible" flag so we don't call .pause() on mount before the
  // browser's native autoPlay has kicked in — otherwise IO can fire
  // isIntersecting:false initially and kill autoplay.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let hasBeenVisible = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasBeenVisible = true;
          const p = v.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
        } else if (hasBeenVisible) {
          v.pause();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [loadVideo]);

  // Scroll-driven scale on the outer wrapper (0.85 → 1.30). Caption pill
  // counter-scales via inverse transform to stay visually stable.
  useEffect(() => {
    const el = scaleRef.current;
    const caption = captionRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      const scale = 0.85 + p * 0.45; // 0.85 → 1.30
      el.style.transform = `scale(${scale})`;
      if (caption) caption.style.transform = `scale(${1 / scale})`;
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

  const handleUnmuteToggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (muted) {
      v.currentTime = 0; // restart from 0 for proper viewing per CLAUDE.md
      v.muted = false;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
      setMuted(false);
    } else {
      v.muted = true;
      setMuted(true);
    }
  };

  return (
    <div
      ref={scaleRef}
      className="w-full"
      style={{
        transformOrigin: "center top",
        willChange: "transform",
        transition: "transform 40ms linear",
      }}
    >
      <div
        className="relative w-full overflow-hidden mx-auto"
        style={{
          aspectRatio: "16 / 9",
          maxWidth: "72rem",
          background:
            "color-mix(in srgb, var(--color-teal) 10%, var(--color-ink))",
          border: "1px solid var(--color-keyline)",
          borderRadius: "var(--radius-media)",
        }}
      >
        {loadVideo && (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disableRemotePlayback
            aria-label="HealthPort in the field, muted loop"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {!loadVideo && (
          <img
            src={POSTER_SRC}
            alt="HealthPort in the field"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Dark gradient overlay — bottom-heavy so caption pill stays AA */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,19,22,0.15) 0%, rgba(0,19,22,0) 40%, rgba(0,19,22,0.55) 100%)",
          }}
        />

        {/* Caption / unmute button — centered while muted (call-to-action),
            tucked into the bottom-right corner while playing with sound so it
            doesn't obscure the frame. */}
        <div
          className={
            muted
              ? "absolute inset-0 flex items-center justify-center"
              : "absolute bottom-4 right-4 flex"
          }
          style={{ transition: "all 200ms ease-out" }}
        >
          <button
            ref={captionRef}
            type="button"
            onClick={handleUnmuteToggle}
            className="inline-flex items-center gap-3 px-4 py-2.5"
            style={{
              background: "rgba(0,19,22,0.72)",
              color: "var(--color-parchment)",
              borderRadius: "999px",
              border: "1px solid rgba(242,239,234,0.18)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.01em",
              transformOrigin: muted ? "center center" : "bottom right",
              willChange: "transform",
              transition: "transform 40ms linear",
            }}
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center"
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "var(--color-teagreen)",
                color: "var(--color-ink)",
              }}
            >
              {muted ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M3 2.2v5.6l4-2.8-4-2.8z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <rect x="3" y="2.5" width="2" height="7" fill="currentColor" />
                  <rect x="7" y="2.5" width="2" height="7" fill="currentColor" />
                </svg>
              )}
            </span>
            {muted ? "Watch with sound" : "Sound on · tap to mute"}
          </button>
        </div>
      </div>
    </div>
  );
}
