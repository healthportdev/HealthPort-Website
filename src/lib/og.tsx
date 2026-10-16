import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const VIOLET = "#801078";
const INK = "#001316";
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

// Local assets make social crawlers independent of external image/font services.
const assets = Promise.all([
  readFile(join(process.cwd(), "src/assets/og/logo.png")),
  readFile(join(process.cwd(), "src/assets/og/installation.jpg")),
  readFile(join(process.cwd(), "src/assets/og/Manrope-Bold.ttf")),
]);

type OGCardProps = { title: string; subtitle: string; accent?: string; eyebrow?: string };

export async function renderOGCard({ title, subtitle, accent, eyebrow }: OGCardProps) {
  const [logo, photo, font] = await assets;
  const accentStart = accent ? title.indexOf(accent) : -1;
  let offset = 0;
  const words = title.split(" ").map(word => {
    const highlighted = accentStart >= 0 && offset >= accentStart && offset < accentStart + (accent?.length ?? 0);
    offset += word.length + 1;
    return { word, highlighted };
  });
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#F7F6F2", color: INK, fontFamily: "Manrope" }}>
      <div style={{ width: 820, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 56px" }}>
        {/* Brand artwork is the actual wordmark, not reconstructed type. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders embedded assets. */}
        <img src={`data:image/png;base64,${logo.toString("base64")}`} width={270} height={58} alt="HealthPort" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 16, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#155362", marginBottom: 20 }}>{eyebrow ?? "Oxygen as a Service"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: title.length > 46 ? 60 : 68, fontWeight: 700, lineHeight: 1.12, letterSpacing: -2.6, marginBottom: 24 }}>
            {words.map(({ word, highlighted }, i) => <span key={i} style={{ color: highlighted ? VIOLET : INK, marginRight: 15 }}>{word}</span>)}
          </div>
          <div style={{ display: "flex", fontSize: 23, lineHeight: 1.5, color: "#576064" }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #DCDDD7", paddingTop: 20 }}>
          <span style={{ fontSize: 17, fontWeight: 600 }}>Here for every breath.</span>
          <span style={{ fontSize: 16, color: "#576064" }}>healthportafrica.com</span>
        </div>
      </div>
      <div style={{ display: "flex", width: 380, height: 630, borderLeft: "1px solid #DCDDD7" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders embedded assets. */}
        <img src={`data:image/jpeg;base64,${photo.toString("base64")}`} width={380} height={630} alt="HealthPort oxygen infrastructure installation" style={{ objectFit: "cover" }} />
      </div>
    </div>,
    { ...OG_SIZE, fonts: [{ name: "Manrope", data: font, weight: 700, style: "normal" }] }
  );
}
