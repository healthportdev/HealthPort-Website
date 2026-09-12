/**
 * About §5 — Leadership.
 *
 * White polaroid cards in a continuous horizontal ticker. The whole
 * row auto-slides left; the reader can also drag/scroll horizontally
 * to move it themselves. Ticker pauses on hover so cards stay
 * readable and the reader has full control while inspecting.
 *
 * Photos: portrait-oriented Unsplash placeholders — flagged for
 * client replacement with real headshots. The constitution normally
 * bans stock, but the client explicitly requested Unsplash here
 * until real portraits land.
 */
import Image from "next/image";

type TeamMember = {
  key: string;
  name: string;
  role: string;
  image: string;
  tilt: string;
  pin: string;
};

// Portrait Unsplash photos — stable direct URLs. `?fit=crop&crop=faces&w=800&h=1200`
// gives us a 3:4 portrait crop centred on the face.
const IMG =
  "https://images.unsplash.com/photo-";

const team: TeamMember[] = [
  {
    key: "founder-ceo",
    name: "Dr. Emmanuel Adeyemi",
    role: "Founder & CEO",
    image: `${IMG}1500648767791-00dcc994a43e?fit=crop&crop=faces&w=800&h=1200`,
    tilt: "-3.5deg",
    pin: "var(--color-coral)",
  },
  {
    key: "head-operations",
    name: "Adaeze Nnamdi",
    role: "Head of Operations",
    image: `${IMG}1573496359142-b8d87734a5a2?fit=crop&crop=faces&w=800&h=1200`,
    tilt: "2.5deg",
    pin: "var(--color-violet)",
  },
  {
    key: "head-engineering",
    name: "Tunde Bakare",
    role: "Head of Engineering",
    image: `${IMG}1507003211169-0a1dd7228f2d?fit=crop&crop=faces&w=800&h=1200`,
    tilt: "-2deg",
    pin: "var(--color-teal)",
  },
  {
    key: "head-oxyintel",
    name: "Dr. Chidinma Okonkwo",
    role: "Head of OxyIntel",
    image: `${IMG}1580489944761-15a19d654956?fit=crop&crop=faces&w=800&h=1200`,
    tilt: "3deg",
    pin: "var(--color-sky-deep)",
  },
];

export function Leadership() {
  return (
    <section
      className="w-full"
      aria-label="Leadership"
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <div className="container-page">
        <div className="max-w-3xl mb-12 md:mb-16" data-parallax="-0.06">
          <p
            className="eyebrow mb-5"
            style={{ color: "var(--color-violet)" }}
          >
            Leadership
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 1.5rem + 1.8vw, 3rem)",
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "var(--color-heading)",
              margin: 0,
              marginBottom: "1rem",
              textWrap: "balance",
            }}
          >
            The people building this.
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1vw, 17px)",
              lineHeight: 1.6,
              color: "var(--color-muted)",
              margin: 0,
            }}
          >
            A small, deliberate team of engineers, operators, and
            clinicians building oxygen infrastructure for a continent.
          </p>
        </div>
      </div>

      {/* Ticker — full-viewport-width; the track continuously slides
          left on a CSS animation. Doubled team array in JSX so the
          translateX(-50%) loop wraps seamlessly. The container also
          allows manual horizontal scroll, so the reader can drag or
          swipe past the auto-motion. */}
      <div className="team-ticker">
        <ul className="team-ticker__track">
          {[...team, ...team].map((m, i) => (
            <li
              key={`${m.key}-${i}`}
              className="team-ticker__item"
              aria-hidden={i >= team.length}
            >
              <PolaroidCard member={m} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------- PolaroidCard ---------------------------- */

function PolaroidCard({ member }: { member: TeamMember }) {
  return (
    <article
      className="flex-shrink-0"
      style={
        {
          width: "clamp(220px, 20vw, 280px)",
          background: "var(--color-white)",
          border: "1px solid var(--color-keyline)",
          borderRadius: "10px",
          padding: "14px 14px 20px",
          transform: `rotate(${member.tilt})`,
          position: "relative",
        } as React.CSSProperties
      }
      role="group"
      aria-label={`${member.name}, ${member.role}`}
    >
      {/* Thumbtack — bigger colored disc with an inner highlight so
          it reads as a physical pin head, not just a dot. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "-12px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: member.pin,
          border: "2px solid var(--color-white)",
          zIndex: 2,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "3px",
            left: "3px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.55)",
          }}
        />
      </span>

      {/* Portrait photo — 3:4 aspect, cropped to face by the Unsplash
          `crop=faces` param. */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "3 / 4",
          borderRadius: "4px",
          background: "var(--color-ink)",
          marginBottom: "14px",
        }}
      >
        <Image
          src={member.image}
          alt=""
          fill
          sizes="(min-width: 768px) 20vw, 60vw"
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>

      {/* Caption */}
      <div className="flex flex-col items-center text-center">
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(14px, 1vw, 16px)",
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "-0.005em",
            color: "var(--color-heading)",
            margin: 0,
            marginBottom: "2px",
          }}
        >
          {member.name}
        </p>
        <p
          className="eyebrow"
          style={{
            fontSize: "10px",
            color: "var(--color-muted)",
            letterSpacing: "0.14em",
          }}
        >
          {member.role}
        </p>
      </div>
    </article>
  );
}
