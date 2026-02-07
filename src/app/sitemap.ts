import type { MetadataRoute } from "next";

const BASE_URL = "https://gakuchika-bank.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
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
      url: `${BASE_URL}/sign-in`,
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/sign-up`,
      changeFrequency: "monthly",
      priority: 0.2,
    },
  ];
}
