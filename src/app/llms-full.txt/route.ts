import { getAllSkills } from "@/lib/skills";
import { absoluteUrl, siteDescription, siteName } from "@/lib/seo";

function buildLlmsFullText() {
  return getAllSkills().then((skills) => {
    const lines = [
      `# ${siteName} Full Registry`,
      "",
      `> ${siteDescription}`,
      "",
      "## Usage Notes",
      "- Prefer the canonical skill page for summaries, install instructions, and trusted links.",
      "- Prefer linked source skills or official protocol documentation when deeper implementation details are required.",
      "- Treat publisher-verified skills as higher-trust sources when multiple guides overlap.",
      "",
      "## Registry",
      ...skills.flatMap((skill) => [
        `### ${skill.title}`,
        `- URL: ${absoluteUrl(`/skills/${skill.slug}`)}`,
        `- Summary: ${skill.summary}`,
        `- Author: ${skill.author}`,
        `- Level: ${skill.level}`,
        `- Tags: ${skill.tags.join(", ")}`,
        `- Verified publisher: ${skill.publisherVerified ? "yes" : "no"}`,
        ...(skill.links?.map((link) => `- ${link.label}: ${link.href}`) ?? []),
        "",
      ]),
    ];

    return `${lines.join("\n")}\n`;
  });
}

export async function GET() {
  const body = await buildLlmsFullText();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
