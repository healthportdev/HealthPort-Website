import { OG_CONTENT_TYPE, OG_SIZE, renderOGCard } from "@/lib/og";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return renderOGCard({
    eyebrow: "For Partners",
    title: "Expanding oxygen access at scale.",
    subtitle:
      "Partnering with governments, NGOs, and global organisations to improve oxygen access in hospitals.",
    accent: "scale",
  });
}
