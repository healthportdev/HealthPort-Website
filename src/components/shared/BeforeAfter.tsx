/**
 * Shared two-column comparison. Restrained: text and keylines, no card grid.
 * Used on Home (Why hospitals choose HealthPort — before/after), OaaS §2
 * (Traditional model vs OaaS) and OaaS §7 (Hospital gets vs HealthPort
 * takes on).
 *
 * By default the left column reads muted (that's the "before" tone).
 * Pass `leftMuted={false}` when both columns are equally weighted.
 *
 * The tabbed toggle variant used on Hospital Solutions lives in
 * shared/BeforeAfterToggle.tsx.
 */
export type ColumnData = {
  eyebrow: string;
  items: string[];
};

export type BeforeAfterIconVariant = "dot" | "cross-check";

export function BeforeAfter({
  eyebrow,
  headline,
  left,
  right,
  leftMuted = true,
  iconVariant = "dot",
  eyebrowColor,
}: {
  eyebrow: string;
  headline: string;
  left: ColumnData;
  right: ColumnData;
  leftMuted?: boolean;
  /** `dot` (default) keeps the quiet dot bullet used on OaaS. `cross-check`
   *  swaps in an X on the muted column and a check on the highlighted column —
   *  used on Home where the semantic is clearly before → after. */
  iconVariant?: BeforeAfterIconVariant;
  /** Optional inline color override for the top eyebrow. Falls back to the
   *  default muted color when not provided. Used by OaaS sections to sync
   *  the section-marker rhythm (Violet on light surfaces). */
  eyebrowColor?: string;
}) {
  return (
    <section className="chapter" aria-label={eyebrow}>
      <div className="chapter-inner">
        <p
          className="eyebrow mb-8"
          style={eyebrowColor ? { color: eyebrowColor } : undefined}
        >
          {eyebrow}
        </p>
        <h2 className="max-w-4xl mb-16">{headline}</h2>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            borderTop: "1px solid var(--color-keyline)",
            borderBottom: "1px solid var(--color-keyline)",
          }}
        >
          <Column
            data={left}
            muted={leftMuted}
            iconVariant={iconVariant}
            side="left"
            style={{
              paddingBlock: "3rem",
              paddingRight: "2.5rem",
            }}
          />
          <Column
            data={right}
            muted={false}
            iconVariant={iconVariant}
            side="right"
            style={{
              paddingBlock: "3rem",
              paddingLeft: "2.5rem",
              borderLeft: "1px solid var(--color-keyline)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function Column({
  data,
  muted,
  iconVariant,
  side,
  style,
}: {
  data: ColumnData;
  muted: boolean;
  iconVariant: BeforeAfterIconVariant;
  side: "left" | "right";
  style?: React.CSSProperties;
}) {
  return (
    <div style={style}>
      <p
        className="eyebrow mb-6"
        style={muted ? { color: "var(--color-muted)" } : undefined}
      >
        {data.eyebrow}
      </p>
      <ul className="flex flex-col gap-4 list-none">
        {data.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3"
            style={{
              fontSize: "var(--text-p1)",
              color: muted ? "var(--color-muted)" : "var(--color-fg)",
              lineHeight: 1.45,
            }}
          >
            <BulletIcon variant={iconVariant} muted={muted} side={side} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BulletIcon({
  variant,
  muted,
  side,
}: {
  variant: BeforeAfterIconVariant;
  muted: boolean;
  side: "left" | "right";
}) {
  if (variant === "cross-check") {
    const isCheck = side === "right";
    const color = isCheck ? "var(--color-teal)" : "var(--color-muted)";
    const bg = isCheck
      ? "color-mix(in srgb, var(--color-teagreen) 55%, transparent)"
      : "color-mix(in srgb, var(--color-muted) 12%, transparent)";
    return (
      <span
        aria-hidden="true"
        className="flex items-center justify-center"
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: bg,
          color,
          flexShrink: 0,
          marginTop: "0.2rem",
        }}
      >
        {isCheck ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6.5l2.5 2.5 4.5-5.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 2l6 6M8 2l-6 6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: "0.5rem",
        height: "0.5rem",
        borderRadius: "50%",
        background: muted ? "var(--color-muted)" : "var(--color-teal)",
        flexShrink: 0,
        marginTop: "0.6rem",
      }}
    />
  );
}
