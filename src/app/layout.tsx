import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
// import { OxygenThread } from "@/components/OxygenThread"; // hidden — re-enable with the JSX below
import { SectionReveal } from "@/components/motion/SectionReveal";
import { StatReveal } from "@/components/motion/StatReveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Parallax } from "@/components/motion/Parallax";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://healthportafrica.com"),
  title: {
    default: "HealthPort: Never worry about oxygen again",
    template: "%s · HealthPort",
  },
  description:
    "HealthPort is a healthcare infrastructure company delivering Oxygen as a Service to hospitals across Africa. You focus on patient care. We make sure oxygen is always available.",
  openGraph: {
    title: "HealthPort: Never worry about oxygen again",
    description:
      "Healthcare infrastructure delivering Oxygen as a Service to hospitals across Africa.",
    type: "website",
    locale: "en_NG",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-[var(--color-violet)] focus:text-[var(--color-parchment)] focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="relative">
          {/* <OxygenThread /> — hidden per current direction. Re-enable to restore the signature left-rail thread. */}
          {children}
        </main>
        <SectionReveal />
        <StatReveal />
        <ImageReveal />
        <Parallax />
        <SmoothScroll />
        <Footer />
      </body>
    </html>
  );
}
