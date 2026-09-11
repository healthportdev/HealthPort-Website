import Link from "next/link";
import { HeroVideo } from "@/components/home/HeroVideo";
import { HeroWash } from "@/components/shared/HeroWash";

export function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden isolate"
      style={{
        paddingTop: "clamp(4rem, 3rem + 5vw, 7rem)",
        paddingBottom: "clamp(4rem, 3rem + 6vw, 8rem)",
      }}
      aria-label="Never worry about oxygen again"
    >
      {/* Atmospheric wash — parallax'd client leaf. */}
      <HeroWash />

      <div className="container-page relative">
        {/* Parallax on the whole hero copy block so eyebrow, headline,
            sub-line and CTAs move as one unit (no per-element overlap). */}
        <div className="flex flex-col items-center text-center" data-parallax="-0.1">
          <p className="eyebrow mb-6">Oxygen as a Service</p>
          <h1 className="max-w-4xl mb-8">
            Never worry about
            <br />
            <span className="oxygen-word">oxygen</span>{" "}
            again.
          </h1>
          <p
            className="mx-auto mb-10 max-w-2xl"
            style={{
              fontSize: "clamp(1rem, 0.9rem + 0.4vw, 1.25rem)",
              lineHeight: 1.55,
              color: "var(--color-muted)",
            }}
          >
            HealthPort delivers reliable medical oxygen infrastructure to
            hospitals across Africa. You focus on patient care. We make sure
            oxygen is always available.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-16 md:mb-20">
            <Link href="/contact" className="btn-primary">
              Book an assessment
              <ArrowRight />
            </Link>
            <Link href="/oxygen-as-a-service" className="btn-secondary">
              How OaaS works
            </Link>
          </div>

          <HeroVideo />
        </div>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
