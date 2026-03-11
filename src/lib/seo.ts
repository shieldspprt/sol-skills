import type { Metadata } from "next";
import type { Skill } from "@/lib/skills";

export const siteName = "SOL Skills";
export const siteDescription =
  "Open registry of implementation-ready Solana protocol skills for agents and developers.";
export const siteLocale = "en_US";

const defaultKeywords = [
  "Solana skills",
  "Solana agents",
  "protocol skills",
  "AI agent registry",
  "Solana developer tools",
  "LLM docs",
  "MCP skills",
];

function normalizeUrl(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function getSiteUrl(): string {
  return (
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeUrl(process.env.SITE_URL) ??
    normalizeUrl(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeUrl(process.env.NEXT_PUBLIC_VERCEL_URL) ??
    normalizeUrl(process.env.VERCEL_URL) ??
    "http://localhost:3000"
  );
}

export function absoluteUrl(path = "/"): string {
  return new URL(path, getSiteUrl()).toString();
}

export function dedupeKeywords(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
}: {
  title?: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  const pageTitle = title ?? siteName;
  const openGraphImage = absoluteUrl("/logo.png");

  return {
    title,
    description,
    keywords: dedupeKeywords([...defaultKeywords, ...keywords]),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: absoluteUrl(path),
      siteName,
      locale: siteLocale,
      type,
      images: [
        {
          url: openGraphImage,
          width: 512,
          height: 512,
          alt: `${siteName} logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description,
      images: [openGraphImage],
    },
  };
}

export function skillKeywords(skill: Skill): string[] {
  return dedupeKeywords([
    ...defaultKeywords,
    ...skill.tags,
    skill.title,
    `${skill.title} skill`,
    `${skill.author} Solana`,
    `${skill.level} Solana guide`,
  ]);
}

export function topSkillTags(skills: Skill[], limit = 8): string[] {
  const counts = new Map<string, number>();

  for (const skill of skills) {
    for (const tag of skill.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);
}
