import Link from "next/link";
import Image from "next/image";
import { FooterWatermark } from "@/components/FooterWatermark";

export function Footer() {
  return (
    <footer>
      {/* Single dark footer body — the promise line + CTA live at the top of
          this same block, so the closing beat and the footer read as one
          contiguous element (no separate parchment band above). */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "var(--color-ink)",
          color: "var(--color-parchment)",
        }}
      >
        {/* Atmospheric wash at the bottom — Coral · Violet · Sky ambient
            hues glowing up from the footer's bottom edge into Ink. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "55%",
            zIndex: 0,
            background: [
              "radial-gradient(ellipse 70% 60% at 12% 110%, rgba(239, 100, 97, 0.18), transparent 60%)",
              "radial-gradient(ellipse 80% 65% at 50% 115%, rgba(128, 16, 120, 0.30), transparent 60%)",
              "radial-gradient(ellipse 75% 60% at 88% 110%, rgba(93, 183, 222, 0.22), transparent 60%)",
            ].join(", "),
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.4) 75%, transparent 100%)",
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.4) 75%, transparent 100%)",
          }}
        />

        {/* Watermark — huge translucent HealthPort wordmark anchored to the
            bottom, fades + rises from below on scroll-in. */}
        <FooterWatermark />

        <div className="container-page relative" style={{ zIndex: 1, paddingTop: "clamp(64px, 7vw, 104px)", paddingBottom: "clamp(48px, 5vw, 72px)" }}>
          {/* Compact brand block on the left (logo → promise → CTA), link
              columns hard-right. Tea-Green on Ink for the button (Violet on
              Ink is banned by the brand guide). */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-start gap-14 md:gap-24 w-full">
            {/* Left: brand block */}
            <div className="flex flex-col items-start gap-4" style={{ maxWidth: "28rem" }}>
              <Image
                src="/brand/logo-horizontal-teagreen.svg"
                alt="HealthPort"
                width={600}
                height={128}
                className="h-11 w-auto"
                priority={false}
              />
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(16px, 1.1vw, 18px)",
                  lineHeight: 1.4,
                  letterSpacing: "-0.005em",
                  fontWeight: 600,
                  textWrap: "balance",
                  margin: 0,
                  color: "var(--color-parchment)",
                }}
              >
                You focus on patient care.<br />
                We make sure oxygen is always available.
              </h2>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 hover:opacity-90 transition-opacity"
                style={{
                  background: "var(--color-teagreen)",
                  color: "var(--color-ink)",
                  padding: "0.875rem 1.5rem",
                  borderRadius: "var(--radius-control)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Book an Assessment
                <Arrow />
              </Link>
            </div>

            {/* Right: 3 tightly-grouped link columns */}
            <div className="flex gap-10 md:gap-14 md:pt-1">
              <FooterCol title="Solutions">
                <FooterLink href="/oxygen-as-a-service">
                  Oxygen as a service
                </FooterLink>
                <FooterLink href="/oxyintel">OxyIntel</FooterLink>
              </FooterCol>
              <FooterCol title="Who it's for">
                <FooterLink href="/hospital-solutions">
                  Hospital Solutions
                </FooterLink>
                <FooterLink href="/for-partners">For Partners</FooterLink>
              </FooterCol>
              <FooterCol title="Company">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
              </FooterCol>
            </div>
          </div>

          {/* Watermark breathing space */}
          <div style={{ height: "clamp(120px, 16vw, 200px)" }} />

          {/* Bottom bar */}
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            style={{
              paddingTop: "20px",
              borderTop: "1px solid rgba(242,239,234,0.1)",
              fontSize: "13px",
              color: "rgba(242,239,234,0.5)",
            }}
          >
            <p>{new Date().getFullYear()} Healthport. Lagos, Nigeria.</p>
            <p>
              Community care by{" "}
              <Link
                href="/about"
                style={{
                  color: "var(--color-teagreen)",
                  textDecoration: "underline",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "3px",
                }}
              >
                AirUp
              </Link>{" "}
              &mdash; here for every breath.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p
        style={{
          color: "var(--color-parchment)",
          fontSize: "15px",
          fontWeight: 500,
          letterSpacing: "-0.005em",
        }}
      >
        {title}
      </p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="opacity-60 hover:opacity-100 transition-opacity"
      style={{
        color: "var(--color-parchment)",
        fontSize: "14px",
        lineHeight: 1.4,
      }}
    >
      {children}
    </Link>
  );
}

function Arrow() {
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
