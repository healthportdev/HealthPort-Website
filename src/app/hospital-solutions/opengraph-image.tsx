import { OG_CONTENT_TYPE, OG_SIZE, renderOGCard } from "@/lib/og";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return renderOGCard({
    eyebrow: "Hospital Solutions",
    title: "For hospitals that can't afford oxygen failures.",
    subtitle:
      "We own, monitor, and guarantee your oxygen supply so your clinical team stays focused on care.",
    accent: "failures",
  });
}
