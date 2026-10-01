/**
 * OaaS — Frequently Asked Questions.
 *
 * Native <details>/<summary> accordion. Renders each Q/A as a
 * disclosure widget so the whole thing works without JavaScript,
 * respects prefers-reduced-motion by default, and remains fully
 * keyboard-operable.
 *
 * COPY NEEDED: bodies are stakeholder drafts pending confirmed
 * answers on onboarding timelines, billing structure, maintenance
 * SLA, and emergency cylinder refills — see
 * docs/REVIEW-BLOCKERS.md #7.
 */

type FAQItem = { q: string; a: string };

const faqs: FAQItem[] = [
  {
    q: "How long does onboarding take?",
    a: "Onboarding timing depends on your facility's existing infrastructure and the OaaS setup we design together. In most cases we're able to move from initial assessment to fully operational supply within a matter of weeks. We'll share a concrete timeline once your assessment is complete.",
  },
  {
    q: "How does billing work?",
    a: "You pay a predictable monthly amount tied to actual consumption at your facility, with no surge pricing during market scarcity. There's no capital expenditure and no surprise refill invoices. The specific structure is confirmed as part of your assessment.",
  },
  {
    q: "What does the maintenance SLA cover?",
    a: "HealthPort takes on ownership and upkeep of the oxygen infrastructure across the term of the partnership, which includes scheduled maintenance, monitoring, and refills. Response commitments for on-site incidents are agreed with your facility as part of the service agreement.",
  },
  {
    q: "What happens in an emergency refill situation?",
    a: "Our monitoring keeps supply ahead of demand under normal conditions, so emergency refills are the exception rather than the norm. If a genuine emergency does arise, HealthPort treats it as a priority delivery and dispatches from the nearest depot.",
  },
];

export function FAQ() {
  return (
    <section
      className="w-full"
      aria-label="Frequently asked questions"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        <div
          className="flex flex-col items-start mb-10 md:mb-14 max-w-3xl"
          data-parallax="-0.08"
        >
          <p
            className="eyebrow mb-4"
            style={{ color: "var(--color-violet)" }}
          >
            Frequently asked questions
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 1.4rem + 2.4vw, 3.25rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              color: "var(--color-heading)",
              margin: 0,
              textWrap: "balance",
            }}
          >
            Answers to the{" "}
            <span style={{ color: "var(--color-violet)" }}>
              questions we hear most
            </span>
            .
          </h2>
        </div>

        <div className="max-w-4xl">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              className="faq-item"
              style={{
                borderTop:
                  i === 0 ? "1px solid var(--color-keyline)" : "none",
                borderBottom: "1px solid var(--color-keyline)",
              }}
            >
              <summary
                className="faq-summary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                  padding: "1.25rem 0",
                  cursor: "pointer",
                  listStyle: "none",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(17px, 1.2vw, 20px)",
                  fontWeight: 600,
                  lineHeight: 1.35,
                  letterSpacing: "-0.01em",
                  color: "var(--color-heading)",
                }}
              >
                <span>{f.q}</span>
                <ChevronIcon />
              </summary>
              <div
                style={{
                  padding: "0 0 1.5rem",
                  fontSize: "clamp(15px, 1vw, 17px)",
                  lineHeight: 1.6,
                  color: "var(--color-fg)",
                  maxWidth: "62ch",
                }}
              >
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="faq-chevron"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={{
        flexShrink: 0,
        color: "var(--color-violet)",
        transition: "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <path
        d="M4 7l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
