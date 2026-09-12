import type { Metadata } from "next";
import { OxyIntelHero } from "@/components/oxyintel/OxyIntelHero";
import { Modules } from "@/components/oxyintel/Modules";
import { WhatItDoes } from "@/components/oxyintel/WhatItDoes";
import { WhatsComing } from "@/components/oxyintel/WhatsComing";
import { MLApproach } from "@/components/oxyintel/MLApproach";

export const metadata: Metadata = {
  title: "OxyIntel",
  description:
    "OxyIntel is HealthPort's intelligence platform for medical oxygen: real-time cylinder tracking (OxyTrack), demand forecasting (OxyFlow), and AI clinical support (RespiraAI).",
  openGraph: {
    title: "OxyIntel · HealthPort",
    description:
      "The intelligence layer behind reliable oxygen infrastructure.",
    type: "website",
  },
  alternates: { canonical: "/oxyintel" },
};

export default function OxyIntelPage() {
  return (
    <>
      <OxyIntelHero />
      <Modules />
      <WhatItDoes />
      <WhatsComing />
      <MLApproach />
    </>
  );
}
