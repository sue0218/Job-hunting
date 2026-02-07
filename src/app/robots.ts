import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/admin/",
        "/es/",
        "/experiences/",
        "/interview/",
        "/billing/",
        "/settings/",
      ],
    },
    sitemap: "https://gakuchika-bank.com/sitemap.xml",
    host: "https://gakuchika-bank.com",
  };
}
