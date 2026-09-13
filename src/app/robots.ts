import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API routes are for the contact form, not for crawling.
        // Blocking them keeps them out of search indices and stops
        // bots from probing the endpoint.
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://healthportafrica.com/sitemap.xml",
    host: "https://healthportafrica.com",
  };
}
