import { getAllSkills } from "@/lib/skills";
import { absoluteUrl, siteDescription, siteName } from "@/lib/seo";

function buildLlmsText() {
  return getAllSkills().then((skills) => {
    const lines = [
      `# ${siteName}`,
      "",
      `> ${siteDescription}`,
      "",
      "## Overview",
      `- Canonical site: ${absoluteUrl("/")}`,
      "- Purpose: discover, compare, and install Solana protocol skills for coding agents.",
      "- Primary audience: developers, agent builders, and protocol teams publishing implementation guides.",
      "",
      "## Priority URLs",
      `- Home: ${absoluteUrl("/")}`,
      `- Docs: ${absoluteUrl("/docs")}`,
      `- Submit: ${absoluteUrl("/submit")}`,
      `- Full index: ${absoluteUrl("/llms-full.txt")}`,
      `- JSON registry: ${absoluteUrl("/registry.json")}`,
      "",
      "## Skills",
      ...skills.map(
        (skill) =>
          `- ${skill.title}: ${absoluteUrl(`/skills/${skill.slug}`)}${skill.publisherVerified ? " (verified publisher)" : ""}`,
      ),
    ];

    return `${lines.join("\n")}\n`;
  });
}

export async function GET() {
  const body = await buildLlmsText();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
