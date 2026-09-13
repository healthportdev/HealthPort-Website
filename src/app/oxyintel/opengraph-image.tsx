import { OG_CONTENT_TYPE, OG_SIZE, renderOGCard } from "@/lib/og";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return renderOGCard({
    eyebrow: "OxyIntel",
    title: "The intelligence layer behind HealthPort.",
    subtitle:
      "Real-time visibility, demand forecasting, and clinical decision support.",
    accent: "intelligence",
  });
}
