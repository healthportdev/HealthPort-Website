import { ImageResponse } from "next/og";

/**
 * Shared Open Graph card renderer used by every page's
 * `opengraph-image.tsx`. Keeps per-page files short — they only
 * declare the runtime/size/contentType exports and call
 * `renderOGCard({ title, subtitle })` with the page's messaging.
 *
 * Design keeps the brand's editorial calm: Parchment card, wordmark
 * top-left, big title with a Violet accent word, muted subtitle,
 * URL row at the bottom. Constitution-clean — no gradients, no
 * decoration.
 */

// Brand color tokens (mirrored from tokens.css for the edge runtime,
// which can't import CSS).
const VIOLET = "#801078";
const PARCHMENT = "#F2EFEA";
const INK = "#001316";
const MUTED = "rgba(0, 19, 22, 0.62)";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

type OGCardProps = {
  title: string;
  subtitle: string;
  // A single word or short phrase from `title` that should render in
  // Violet as the punchline. Case-sensitive substring match. If
  // omitted or not found in the title, no word is highlighted.
  accent?: string;
  // Small label above the title (e.g. "OxyIntel", "For Partners").
  // Renders in Violet uppercase. Optional.
  eyebrow?: string;
};

/**
 * Splits `title` around the first occurrence of `accent` and returns
 * an array of segments: leading text, then the accent word (marked),
 * then trailing text. If the accent isn't found the array has one
 * plain segment.
 */
type Segment = { text: string; accent: boolean };

function splitTitle(title: string, accent?: string): Segment[] {
  if (!accent) return [{ text: title, accent: false }];
  const idx = title.indexOf(accent);
  if (idx < 0) return [{ text: title, accent: false }];
  const before = title.slice(0, idx);
  const after = title.slice(idx + accent.length);
  return [
    { text: before, accent: false },
    { text: accent, accent: true },
    { text: after, accent: false },
  ];
}

export function renderOGCard({ title, subtitle, accent, eyebrow }: OGCardProps) {
  const segments = splitTitle(title, accent);

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

        {/* Middle — optional eyebrow + big title + subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {eyebrow ? (
            <div
              style={{
                fontSize: 20,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: VIOLET,
                fontWeight: 700,
              }}
            >
              {eyebrow}
            </div>
          ) : null}

          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: INK,
              maxWidth: 1000,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {segments.map((seg, i) => (
              <span
                key={i}
                style={{
                  color: seg.accent ? VIOLET : INK,
                }}
              >
                {seg.text}
              </span>
            ))}
          </div>

          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: MUTED,
              maxWidth: 900,
            }}
          >
            {subtitle}
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
      ...OG_SIZE,
    }
  );
}
