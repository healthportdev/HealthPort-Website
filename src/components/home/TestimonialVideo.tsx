/**
 * TestimonialVideo — poster + tap-to-play video for the "In their words"
 * section. Renders as the left panel of the split testimonial card:
 * portrait aspect matches the layout. NOT autoplay (per CLAUDE.md).
 *
 * Bandwidth guard: skips source when save-data on or effectiveType 2g/3g.
 */
"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/testimonial.mp4";
const POSTER_SRC = "/videos/testimonial-poster.jpg";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };
type NavigatorWithConnection = Navigator & { connection?: NetworkInformation };

export function TestimonialVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const conn = (navigator as NavigatorWithConnection).connection;
    const slow =
      conn?.saveData ||
      (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType));
    if (slow) setLoadVideo(false);
  }, []);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    setPlaying(true);
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: "16 / 9",
        borderRadius: "var(--radius-media)",
        background: "rgba(0,19,22,0.04)",
      }}
    >
      {loadVideo ? (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          preload="metadata"
          playsInline
          controls={playing}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          aria-label="HealthPort hospital testimonial"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={POSTER_SRC}
          alt="Hospital testimonial preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {!playing && (
        <>
          {/* Soft ink overlay so the play pill stays legible on any poster */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,19,22,0.1) 0%, rgba(0,19,22,0.4) 100%)",
            }}
          />
          <button
            type="button"
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center group"
            aria-label="Play hospital testimonial video"
          >
            <span
              className="inline-flex items-center gap-3 px-4 py-2.5 group-hover:-translate-y-px group-hover:scale-[1.02]"
              style={{
                background: "rgba(0,19,22,0.75)",
                color: "var(--color-parchment)",
                borderRadius: "999px",
                border: "1px solid rgba(242,239,234,0.18)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "13px",
                letterSpacing: "0.01em",
                transition: "transform 300ms var(--ease-out-brand)",
              }}
            >
              <span
                aria-hidden
                className="inline-flex items-center justify-center"
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "var(--color-teagreen)",
                  color: "var(--color-ink)",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                  <path d="M3 2.2v5.6l4-2.8-4-2.8z" fill="currentColor" />
                </svg>
              </span>
              Watch the story · 2:50
            </span>
          </button>
        </>
      )}
    </div>
  );
}
