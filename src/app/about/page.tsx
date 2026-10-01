import type { Metadata } from "next";
import { MissionVision } from "@/components/about/MissionVision";
import { WhyWeExistReprise } from "@/components/about/WhyWeExistReprise";
import { CoreValues } from "@/components/about/CoreValues";
import { Story } from "@/components/about/Story";
import { Leadership } from "@/components/about/Leadership";
import { Licenses } from "@/components/about/Licenses";
import { AirUpMention } from "@/components/about/AirUpMention";
import { Press } from "@/components/about/Press";
import { SHOW_STANDARDS } from "@/lib/flags";

export const metadata: Metadata = {
  title: "About",
  description:
    "HealthPort is a healthcare infrastructure company delivering Oxygen as a Service across sub-Saharan African hospitals. Our mission: no patient dies from lack of oxygen.",
  openGraph: {
    title: "About · HealthPort",
    description:
      "The people, values, and mission behind HealthPort.",
    type: "website",
  },
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <MissionVision />
      <WhyWeExistReprise />
      <CoreValues />
      <Story />
      <Leadership />
      {SHOW_STANDARDS && <Licenses />}
      <AirUpMention />
      <Press />
    </>
  );
}
