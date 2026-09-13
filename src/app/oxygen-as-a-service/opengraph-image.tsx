import { OG_CONTENT_TYPE, OG_SIZE, renderOGCard } from "@/lib/og";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return renderOGCard({
    eyebrow: "Oxygen as a Service",
    title: "Oxygen, delivered as a service.",
    subtitle:
      "Managed cylinders, reticulation, monitoring, and continuous optimisation. Pay only for what you use.",
    accent: "service",
  });
}
