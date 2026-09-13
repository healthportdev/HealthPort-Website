import { OG_CONTENT_TYPE, OG_SIZE, renderOGCard } from "@/lib/og";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return renderOGCard({
    eyebrow: "About",
    title: "Oxygen supplier to healthcare infrastructure.",
    subtitle:
      "No patient should die from an oxygen shortage. We're building the infrastructure that makes that promise real.",
    accent: "infrastructure",
  });
}
