import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/data/case-studies";
import styles from "./CaseStudies.module.css";

/** Client-supplied stories, with native horizontal scrolling and internal links. */
export function CaseStudies() {
  const edge = "max(var(--container-pad-x), calc((100vw - var(--container-max)) / 2 + var(--container-pad-x)))";
  return (
    <section id="case-studies" aria-label="Hospital stories" className="w-full scroll-mt-24" style={{ paddingBlock: "var(--spacing-section)" }}>
      <div className="container-page mb-10 md:mb-14">
        <p className="eyebrow mb-5" style={{ color: "var(--color-violet)" }}>Stories</p>
        <h2 className="mb-4">Hospital stories</h2>
        <p className="max-w-2xl text-[var(--color-muted)] leading-relaxed">From bedside access to ongoing support: five stories about the systems and people behind oxygen care.</p>
      </div>
      <div className={`${styles.scroller} w-full overflow-x-auto`} role="region" aria-label="Browse five hospital stories" tabIndex={0} style={{ scrollSnapType: "x mandatory", scrollPaddingInline: edge }}>
        <ul className="flex items-stretch gap-5 md:gap-6 list-none py-2" style={{ paddingInline: edge }}>
          {caseStudies.map(study => (
            <li key={study.slug} className="shrink-0" style={{ width: "min(85vw, 380px)", scrollSnapAlign: "start" }}>
              <article className="h-full overflow-hidden rounded-[20px] border border-[var(--color-keyline)] bg-white">
                <Link href={`/case-studies/${study.slug}`} aria-label={`Read case study: ${study.title}`} className="flex flex-col h-full group">
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-[var(--color-parchment)]">
                    <Image src={study.image} alt={study.imageAlt} fill sizes="(max-width: 448px) 85vw, 380px" className="object-cover" style={{ objectPosition: study.imagePosition }} />
                  </div>
                  <div className="flex flex-col flex-1 p-6 md:p-7">
                    <p className="eyebrow mb-4" style={{ color: "var(--color-teal)", fontSize: "11px" }}>{study.category}</p>
                    <h3 className="mb-4" style={{ fontSize: "clamp(1.2rem, 1rem + 0.4vw, 1.5rem)", lineHeight: 1.25 }}>{study.title}</h3>
                    <p className="text-[15px] leading-relaxed text-[var(--color-muted)] mb-6">{study.summary}</p>
                    <span className="mt-auto pt-5 border-t border-[var(--color-keyline)] text-sm font-semibold text-[var(--color-violet)] group-hover:underline underline-offset-4">Read case study <span aria-hidden="true">→</span></span>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
