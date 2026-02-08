import type { MetadataRoute } from "next";
import { getAllGuideSlugs } from "./guides/[slug]/guide-data";

const BASE_URL = "https://gakuchika-bank.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const guidePages = getAllGuideSlugs().map((slug) => ({
    url: `${BASE_URL}/guides/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...guidePages,
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/tokushoho`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/beta`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/sign-up`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
