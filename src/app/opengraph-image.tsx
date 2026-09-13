import { ImageResponse } from "next/og";

/**
 * Root Open Graph image — the default social-share card used when a
 * link to any page unfurls in Slack, Twitter/X, LinkedIn, WhatsApp,
 * etc. Per-page overrides can drop their own `opengraph-image.tsx`
 * beside their `page.tsx` to swap this out.
 *
 * Design: Violet Parchment card, wordmark top-left, tagline centered
 * huge, secondary line below. No gradients (constitution rule).
 */
export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Brand color tokens (mirrored from tokens.css for edge-runtime use).
const VIOLET = "#801078";
const PARCHMENT = "#F2EFEA";
const INK = "#001316";
const MUTED = "rgba(0, 19, 22, 0.62)";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: PARCHMENT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Wordmark row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: VIOLET,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: PARCHMENT,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            H
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: -0.5,
              color: INK,
            }}
          >
            HealthPort
          </div>
        </div>

        {/* Big headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: INK,
              maxWidth: 900,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Never worry about{" "}
            <span style={{ color: VIOLET }}>oxygen</span> again.
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: MUTED,
              maxWidth: 780,
            }}
          >
            Healthcare infrastructure delivering Oxygen as a Service to
            hospitals across Africa.
          </div>
        </div>

        {/* Bottom row — URL */}
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: VIOLET,
            fontWeight: 700,
          }}
        >
          healthportafrica.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
