import { getAllSkills } from "@/lib/skills";
import { absoluteUrl, siteDescription, siteName } from "@/lib/seo";

export async function GET() {
  const skills = await getAllSkills();

  return Response.json(
    {
      site: {
        name: siteName,
        description: siteDescription,
        url: absoluteUrl("/"),
      },
      generatedAt: new Date().toISOString(),
      count: skills.length,
      skills: skills.map((skill) => ({
        slug: skill.slug,
        title: skill.title,
        summary: skill.summary,
        author: skill.author,
        level: skill.level,
        tags: skill.tags,
        installs: skill.installs ?? null,
        publisherVerified: skill.publisherVerified ?? false,
        url: absoluteUrl(`/skills/${skill.slug}`),
        lastModified: skill.lastModified ?? null,
        links: skill.links ?? [],
      })),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
