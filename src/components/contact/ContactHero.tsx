/**
 * Contact §1 — page hero. The calmest page on the site per DESIGN-BRIEF.
 * Understated, no CTA — the form itself IS the CTA.
 */
export function ContactHero() {
  return (
    <section
      className="chapter pt-16 md:pt-24"
      style={{ paddingBottom: "clamp(3rem, 2rem + 4vw, 6rem)" }}
    >
      <div className="chapter-inner">
        <p className="eyebrow mb-8">Contact</p>
        <h1 className="max-w-4xl mb-8">
          Tell us about your facility.
        </h1>
        <p className="lead">
          Whether you&rsquo;re a hospital, a partner, or a funder, write
          us a few lines and we&rsquo;ll route it to the right person on
          the team.
        </p>
      </div>
    </section>
  );
}
