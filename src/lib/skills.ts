import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import { skillsDirectory } from "@/lib/project";

export type Skill = {
  slug: string;
  title: string;
  summary: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  author: string;
  installs?: number;
  publisherVerified?: boolean;
  repository?: string;
  lastModified?: string;
  links?: Array<{ label: string; href: string }>;
  guide: {
    markdown: string;
    executionFlow?: Array<{ title: string; content: string }>;
    landingGuidance?: Array<{ title: string; content: string }>;
    failureHandling?: Array<{ title: string; content: string }>;
  };
};

function getSkillsPath(): string {
  return path.join(process.cwd(), skillsDirectory);
}

async function readSkillFile(filePath: string): Promise<Skill | null> {
  try {
    const [raw, stats] = await Promise.all([
      fs.readFile(filePath, "utf8"),
      fs.stat(filePath),
    ]);
    const parsed = JSON.parse(raw) as Skill;
    if (
      !parsed.slug ||
      !parsed.title ||
      !parsed.summary ||
      !parsed.level ||
      !Array.isArray(parsed.tags) ||
      !parsed.author ||
      !parsed.guide ||
      typeof parsed.guide.markdown !== "string"
    ) {
      return null;
    }
    return {
      ...parsed,
      lastModified: stats.mtime.toISOString(),
    };
  } catch {
    return null;
  }
}

export const getAllSkills = cache(async (): Promise<Skill[]> => {
  const dir = getSkillsPath();
  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  const skills = await Promise.all(
    jsonFiles.map((file) => readSkillFile(path.join(dir, file))),
  );

  return skills
    .filter((skill): skill is Skill => skill !== null)
    .sort((a, b) => a.title.localeCompare(b.title));
});

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  const skills = await getAllSkills();
  return skills.find((skill) => skill.slug === slug) ?? null;
}

export async function getSkillSlugs(): Promise<string[]> {
  const skills = await getAllSkills();
  return skills.map((skill) => skill.slug);
}
