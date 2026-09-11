import type { Metadata } from "next";
import { OaasIntro } from "@/components/oaas/OaasIntro";
import { ProcessTeaser } from "@/components/oaas/ProcessTeaser";
import { WhyOaas } from "@/components/oaas/WhyOaas";
import { WhatsIncluded } from "@/components/oaas/WhatsIncluded";
import { OaasJourney } from "@/components/oaas/OaasJourney";
import { HospitalGetsHealthPortTakes } from "@/components/oaas/HospitalGetsHealthPortTakes";
import { Eligibility } from "@/components/oaas/Eligibility";

export const metadata: Metadata = {
  title: "Oxygen as a Service",
  description:
    "HealthPort delivers Oxygen as a Service — a managed model that takes cylinders, reticulation, monitoring, and continuous optimisation off the hospital's plate. Pay only for what you use.",
  openGraph: {
    title: "Oxygen as a Service · HealthPort",
    description:
      "A managed model that takes oxygen off the hospital's plate. Pay only for what you use.",
    type: "website",
  },
  alternates: { canonical: "/oxygen-as-a-service" },
};

export default function OaaSPage() {
  return (
    <>
      <OaasIntro />
      {/* ProcessTeaser replaces the previous InfrastructureVideo panel
          directly under "What is Oxygen as a Service?" — per client
          direction the video slot became this animated teaser. */}
      <ProcessTeaser />
      <WhyOaas />
      <WhatsIncluded />
      <OaasJourney />
      <HospitalGetsHealthPortTakes />
      <Eligibility />
    </>
  );
}
