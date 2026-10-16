import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/data/case-studies";

export const dynamic = "force-static";
export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const shareImage = { url: `/case-studies/${study.slug}/opengraph-image`, width: 1200, height: 630, alt: study.title };
  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      type: "article", title: study.title, description: study.summary,
      url: `/case-studies/${study.slug}`,
      images: [shareImage],
    },
    twitter: { card: "summary_large_image", title: study.title, description: study.summary, images: [shareImage] },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const index = caseStudies.findIndex(item => item.slug === slug);
  const next = caseStudies[(index + 1) % caseStudies.length];
  return (
    <>
      <section aria-label="Case study introduction" className="container-page pt-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <Link href="/hospital-solutions#case-studies" className="link-quiet"><span aria-hidden="true">← </span> Hospital stories</Link>
        </nav>
        <figure className="m-0">
          <div className="relative isolate overflow-hidden rounded-[28px] bg-[var(--color-ink)]">
            <Image src={study.image} alt={study.imageAlt} fill priority sizes="(max-width: 1280px) 100vw, 1200px" className="object-cover" style={{ objectPosition: study.imagePosition }} />
            <div aria-hidden="true" className="absolute inset-0 bg-[var(--color-ink)]/85" />
            <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-24 text-[var(--color-parchment)]">
              <p className="eyebrow mb-5" style={{ color: "var(--color-teagreen)" }}>Case study · {study.category}</p>
              <h1 className="max-w-4xl mb-6" style={{ fontSize: "clamp(2rem, 1.25rem + 3vw, 3.75rem)", lineHeight: 1.08, color: "var(--color-parchment)", textWrap: "balance" }}>{study.title}</h1>
              <p className="max-w-2xl" style={{ fontSize: "clamp(1rem, 0.9rem + 0.3vw, 1.125rem)", lineHeight: 1.65 }}>{study.summary}</p>
            </div>
          </div>
        </figure>
      </section>
      <section aria-label="Case study details" className="container-page pt-12 pb-16 md:pt-16 md:pb-32">
          <article className="mx-auto min-w-0 max-w-[45rem]">
            {study.sections.map(section => (
              <section key={section.id} id={section.id} className="scroll-mt-28 mb-12 md:mb-16">
                <h2 className="mb-5" style={{ fontSize: "clamp(1.5rem, 1.1rem + 1.2vw, 2rem)", lineHeight: 1.2, textWrap: "wrap" }}>{section.title}</h2>
                <div className="space-y-5 leading-[1.75] text-[var(--color-fg)]">
                  {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {section.points && <ul className="mt-6 space-y-3 list-disc pl-5 marker:text-[var(--color-teal)] leading-relaxed">{section.points.map(point => <li key={point} className="pl-1">{point}</li>)}</ul>}
              </section>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/contact" className="btn-primary">Book an assessment</Link>
              <Link href="/hospital-solutions#case-studies" className="btn-secondary">Back to hospital stories</Link>
            </div>
            <div className="mt-12 md:mt-16 flex flex-col items-start gap-4 border-t border-[var(--color-keyline)] pt-8">
              <p className="eyebrow text-[var(--color-muted)]">Next story</p>
              <Link href={`/case-studies/${next.slug}`} className="block text-[var(--color-violet)] font-semibold leading-relaxed underline underline-offset-4">{next.title} <span aria-hidden="true">→</span></Link>
            </div>
          </article>
      </section>
    </>
  );
}
