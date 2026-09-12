import type { Metadata } from "next";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { HeroWash } from "@/components/shared/HeroWash";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact HealthPort, the healthcare infrastructure company delivering Oxygen as a Service to hospitals across Africa. Routed inquiry form for hospitals, partners, media, and careers.",
  openGraph: {
    title: "Contact · HealthPort",
    description:
      "Tell us about your facility. We'll route it to the right person on the team.",
    type: "website",
  },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section
      className="relative w-full overflow-hidden isolate"
      aria-label="Contact"
      style={{
        paddingTop: "clamp(5rem, 4rem + 4vw, 8rem)",
        paddingBottom: "clamp(4rem, 3rem + 4vw, 7rem)",
      }}
    >
      {/* Atmospheric wash — same brand ramp used on the other page
          hero moments. Sits behind the editorial title and the
          form/channels grid below. */}
      <HeroWash />

      <div className="container-page relative">
        {/* Editorial title — compact, matches cross-page grammar:
            Violet eyebrow → h1 with Violet punchline → muted sub. */}
        <div className="max-w-3xl mb-12 md:mb-16" data-parallax="-0.06">
          <p
            className="eyebrow mb-4"
            style={{ color: "var(--color-violet)" }}
          >
            Contact
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 1.6rem + 2.2vw, 3.5rem)",
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              color: "var(--color-heading)",
              margin: 0,
              marginBottom: "1rem",
              textWrap: "balance",
            }}
          >
            Reliable oxygen.{" "}
            <span style={{ color: "var(--color-violet)" }}>Always.</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(15px, 1vw, 17px)",
              lineHeight: 1.6,
              color: "var(--color-muted)",
              margin: 0,
              maxWidth: "50ch",
            }}
          >
            Whether you&rsquo;re a hospital, partner, or journalist,
            we&rsquo;ll respond within 24 hours.
          </p>
        </div>

        {/* Two-column form + channels */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-6 md:gap-8 items-start">
          <InquiryForm />
          <ContactChannels />
        </div>
      </div>
    </section>
  );
}
