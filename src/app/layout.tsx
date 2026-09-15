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
// SmoothScroll (Lenis) removed — it wraps the body in a transform which
// breaks `position: sticky` and hurts first-paint time. Native scroll is
// used site-wide instead; `scroll-behavior: smooth` on <html> in
// globals.css gives us smooth anchor scrolls without the perf cost.

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

const SITE_URL = "https://healthportafrica.com";
const SITE_NAME = "HealthPort";
const SITE_TAGLINE = "HealthPort: Never worry about oxygen again";
const SITE_DESCRIPTION =
  "HealthPort is a healthcare infrastructure company delivering Oxygen as a Service to hospitals across Africa. You focus on patient care. We make sure oxygen is always available.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TAGLINE,
    template: "%s · HealthPort",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "HealthPort", url: SITE_URL }],
  keywords: [
    "medical oxygen",
    "oxygen supply Nigeria",
    "oxygen as a service",
    "hospital oxygen infrastructure",
    "medical gas Africa",
    "healthcare infrastructure",
    "OxyIntel",
    "reliable oxygen",
  ],
  openGraph: {
    title: SITE_TAGLINE,
    description:
      "Healthcare infrastructure delivering Oxygen as a Service to hospitals across Africa.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TAGLINE,
    description:
      "Healthcare infrastructure delivering Oxygen as a Service to hospitals across Africa.",
    creator: "@healthport",
    site: "@healthport",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
  category: "Healthcare",
};

/**
 * JSON-LD structured data. Two schemas ship at the root:
 *
 *   1. Organization — the brand, its logo, and social profile links
 *      (populate `sameAs` when the client shares social URLs).
 *   2. WebSite — the site itself, with SearchAction so Google can
 *      offer a sitelinks search box in results.
 *
 * The LocalBusiness schema lives on /contact where the office
 * address makes more sense contextually.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo-horizontal-primary.svg`,
  description: SITE_DESCRIPTION,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@healthportafrica.com",
      telephone: "+234-806-412-4356",
      areaServed: "NG",
      availableLanguage: ["English"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "The Phillipi Centre, Plot A, Awolowo Way",
    addressLocality: "Ikeja",
    addressRegion: "Lagos",
    addressCountry: "NG",
  },
  // Populate with real social URLs when supplied.
  sameAs: [] as string[],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en-NG",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <head>
        {/* JSON-LD — inlined so Google reads it on first render. */}
        <script
          type="application/ld+json"
          // Safe: content is a compile-time constant, not user data.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
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
        <Footer />
      </body>
    </html>
  );
}
