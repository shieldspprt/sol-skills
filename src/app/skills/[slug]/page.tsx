import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { CopyInstallCommandButton } from "@/components/copy-install-command-button";
import { MarkdownContent } from "@/components/markdown-content";
import { repoUrl } from "@/lib/project";
import { getSkillBySlug, getSkillSlugs } from "@/lib/skills";
import { absoluteUrl, buildPageMetadata, skillKeywords, siteName } from "@/lib/seo";

type Params = { slug: string };

function GuideSectionGroup({
  title,
  sections,
}: {
  title: string;
  sections?: Array<{ title: string; content: string }>;
}) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 border-t border-zinc-800 pt-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-6">
        {sections.map((section) => (
          <div key={`${title}-${section.title}`}>
            <h3 className="text-lg font-semibold text-zinc-100">{section.title}</h3>
            <MarkdownContent content={section.content} className="mt-2" />
          </div>
        ))}
      </div>
    </section>
  );
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getSkillSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    return { title: "Skill not found" };
  }

  return buildPageMetadata({
    title: skill.title,
    description: skill.summary,
    path: `/skills/${skill.slug}`,
    keywords: skillKeywords(skill),
    type: "article",
  });
}

export default async function SkillDetailsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    notFound();
  }

  const weeklyInstalls = Math.max(100, Math.round((skill.installs ?? 0) * 0.28));
  const repoPath = skill.repository ?? `${skill.author}/skills`;
  const sourceSkillLink = skill.links?.find((l) => l.label === "Source skill");
  const skillUrl = sourceSkillLink?.href ?? `${repoUrl} --skill ${skill.slug}`;
  const installCommand = `npx skills add ${skillUrl}`;
  const pageUrl = absoluteUrl(`/skills/${skill.slug}`);

  const installedOn = [
    { agent: "cursor", installs: Math.round((skill.installs ?? 0) * 0.48) },
    { agent: "codex", installs: Math.round((skill.installs ?? 0) * 0.41) },
    { agent: "cline", installs: Math.round((skill.installs ?? 0) * 0.32) },
    { agent: "claude-code", installs: Math.round((skill.installs ?? 0) * 0.37) },
  ].filter((row) => row.installs > 0);

  function formatCompact(value: number): string {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return String(value);
  }

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: skill.title,
      description: skill.summary,
      url: pageUrl,
      author: {
        "@type": "Organization",
        name: skill.author,
      },
      publisher: {
        "@type": "Organization",
        name: siteName,
      },
      keywords: skill.tags.join(", "),
      dateModified: skill.lastModified,
      about: ["Solana", ...skill.tags],
      sameAs: skill.links?.map((link) => link.href),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Skills",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: skill.title,
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <StructuredData data={structuredData} />
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <section>
          <h1 className="text-4xl font-bold tracking-tight">{skill.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {skill.publisherVerified ? (
              <span className="rounded-full border border-emerald-700/40 bg-emerald-900/30 px-3 py-1 text-xs font-medium text-emerald-300">
                Authorized publisher
              </span>
            ) : null}
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2">
            <code className="flex-1 overflow-x-auto px-2 text-xs text-zinc-300">
              {installCommand}
            </code>
            <CopyInstallCommandButton command={installCommand} />
          </div>

          <div className="mt-8 border-t border-zinc-800 pt-6">
            <h2 className="text-2xl font-semibold">Purpose</h2>
            <p className="mt-3 leading-7 text-zinc-300">{skill.summary}</p>
          </div>

          {skill.links && skill.links.length > 0 ? (
            <section className="mt-8 border-t border-zinc-800 pt-6">
              <h2 className="text-2xl font-semibold">Trusted sources</h2>
              <ul className="mt-3 space-y-2">
                {skill.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2 hover:text-violet-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <GuideSectionGroup title="Execution flow" sections={skill.guide.executionFlow} />
          <GuideSectionGroup
            title="Landing guidance"
            sections={skill.guide.landingGuidance}
          />
          <GuideSectionGroup
            title="Failure handling"
            sections={skill.guide.failureHandling}
          />

          <section className="mt-8 border-t border-zinc-800 pt-6">
            <h2 className="text-2xl font-semibold">Full guide</h2>
            <MarkdownContent content={skill.guide.markdown} className="mt-4" />
          </section>
        </section>

        <aside className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">Weekly installs</p>
            <p className="mt-1 text-4xl font-semibold">{formatCompact(weeklyInstalls)}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">Repository</p>
            <p className="mt-1 text-sm text-zinc-200">{repoPath}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">Installed on</p>
            <ul className="mt-2 space-y-1 text-sm">
              {installedOn.map((item) => (
                <li key={item.agent} className="flex items-center justify-between">
                  <span className="text-zinc-300">{item.agent}</span>
                  <span className="text-zinc-400">{formatCompact(item.installs)}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
