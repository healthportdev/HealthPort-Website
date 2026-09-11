/**
 * TrustBar — real partner logos in a continuous single-line marquee.
 * Files extracted from the Partners.pptx (Sept 2026). Full colour, larger
 * sizing, scrolling horizontally so all logos share one line at any width.
 * Pauses on hover so a user can inspect any logo.
 */
import Image from "next/image";

type Partner = {
  name: string;
  file: string;
  w: number;
  h: number;
};

const partners: Partner[] = [
  { name: "Lagos State Ministry of Health",              file: "lagos-state-moh.png",             w: 600, h: 460 },
  { name: "Edo State Primary Healthcare Development Agency", file: "edo-state-phcda.png",         w: 600, h: 600 },
  { name: "Aig-Imoukhuede Foundation",                    file: "aig-imoukhuede-foundation.png", w: 1000, h: 700 },
  { name: "MIT Solve",                                    file: "mit-solve.png",                 w: 600, h: 240 },
  { name: "D-Prize",                                      file: "d-prize.png",                   w: 500, h: 280 },
  { name: "Every Breath Counts",                          file: "every-breath-counts.png",       w: 2000, h: 543 },
  { name: "AFRIMED",                                      file: "afrimed.png",                   w: 320, h: 320 },
  { name: "LEANMED",                                      file: "leanmed.png",                   w: 320, h: 120 },
  { name: "Ultra Philanthropy",                           file: "ultra-philanthropy.png",        w: 400, h: 400 },
  { name: "Better Futures CoLab",                         file: "better-futures-colab.png",      w: 800, h: 700 },
];

export function TrustBar() {
  return (
    <section
      aria-label="Trusted by hospitals, governments, and partners across Nigeria"
      style={{
        paddingBlock: "clamp(2.5rem, 1.75rem + 3vw, 5rem)",
        borderTop: "1px solid var(--color-keyline)",
        borderBottom: "1px solid var(--color-keyline)",
      }}
    >
      <div className="flex flex-col gap-8">
        {/* Eyebrow stays inside the container width so the label sits with
            the rest of the page's typographic rhythm. */}
        <div className="container-page">
          <p
            className="eyebrow text-center"
            style={{ color: "var(--color-muted)" }}
          >
            Trusted by partners across Nigeria
          </p>
        </div>

        {/* Marquee escapes the container and runs the full viewport width so
            the logos sweep edge-to-edge. Track scrolls left continuously and
            is duplicated (2×) in JSX so the loop wraps seamlessly. */}
        <div className="partner-marquee">
          <ul className="partner-marquee__track">
            {[...partners, ...partners].map((p, i) => (
              <li
                key={`${p.name}-${i}`}
                className="partner-marquee__item"
                aria-hidden={i >= partners.length}
              >
                <Image
                  src={`/partners/${p.file}`}
                  alt={i < partners.length ? p.name : ""}
                  width={p.w}
                  height={p.h}
                  className="w-auto h-16 md:h-20 object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
