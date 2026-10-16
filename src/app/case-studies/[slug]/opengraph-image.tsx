import { notFound } from "next/navigation";
import { getCaseStudy } from "@/data/case-studies";
import { OG_CONTENT_TYPE, OG_SIZE, renderOGCard } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "HealthPort hospital story";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return renderOGCard({ eyebrow: `Hospital stories · ${study.category}`, title: study.title, subtitle: study.summary });
}
