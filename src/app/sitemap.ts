import type { MetadataRoute } from "next";
import { getAllSkills } from "@/lib/skills";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const skills = await getAllSkills();
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/docs"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/submit"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/llms.txt"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/llms-full.txt"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/registry.json"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  const skillPages: MetadataRoute.Sitemap = skills.map((skill) => ({
    url: absoluteUrl(`/skills/${skill.slug}`),
    lastModified: skill.lastModified ? new Date(skill.lastModified) : now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...skillPages];
}
