import { OG_CONTENT_TYPE, OG_SIZE, renderOGCard } from "@/lib/og";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return renderOGCard({
    eyebrow: "Contact",
    title: "Reliable oxygen. Always.",
    subtitle:
      "Whether you're a hospital, partner, or journalist, we'll respond within 24 hours.",
    accent: "Always",
  });
}
