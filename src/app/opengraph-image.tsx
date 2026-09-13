import { OG_CONTENT_TYPE, OG_SIZE, renderOGCard } from "@/lib/og";

/**
 * Root Open Graph image — the default social-share card used when a
 * link to the home page unfurls in Slack, Twitter/X, LinkedIn,
 * WhatsApp, etc. Per-page files override this on their own routes.
 */
export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return renderOGCard({
    title: "Never worry about oxygen again.",
    subtitle:
      "Healthcare infrastructure delivering Oxygen as a Service to hospitals across Africa.",
    accent: "oxygen",
  });
}
