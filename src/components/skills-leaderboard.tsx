"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Skill } from "@/lib/skills";

type Feed = "all-time" | "trending" | "hot";

const feeds: Array<{ id: Feed; label: string }> = [
  { id: "all-time", label: "All Time" },
  { id: "trending", label: "Trending (24h)" },
  { id: "hot", label: "Hot" },
];

function formatInstalls(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

export function SkillsLeaderboard({ skills }: { skills: Skill[] }) {
  const [query, setQuery] = useState("");
  const [feed, setFeed] = useState<Feed>("all-time");

  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const withInstalls = skills.map((skill) => ({
      ...skill,
      installs: skill.installs ?? 0,
    }));

    const feedAdjusted = [...withInstalls].sort((a, b) => {
      if (feed === "all-time") return b.installs - a.installs;
      if (feed === "trending") return b.installs * 0.65 - a.installs * 0.65;
      return b.installs * 0.45 - a.installs * 0.45;
    });

    if (!normalized) return feedAdjusted;

    return feedAdjusted.filter((skill) => {
      const haystack = `${skill.title} ${skill.summary} ${skill.tags.join(" ")}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [feed, query, skills]);

  return (
    <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Skills Leaderboard</h2>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search skills..."
          className="w-full max-w-xs rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-500"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {feeds.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFeed(item.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              feed === item.id
                ? "bg-violet-600 text-white"
                : "border border-zinc-700 text-zinc-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="pb-3">#</th>
              <th className="pb-3">Skill</th>
              <th className="pb-3">Author</th>
              <th className="pb-3 text-right">Installs</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((skill, index) => (
              <tr key={skill.slug} className="border-b border-zinc-800/80 align-top">
                <td className="py-3 pr-3 font-medium text-zinc-400">{index + 1}</td>
                <td className="py-3 pr-3">
                  <Link
                    href={`/skills/${skill.slug}`}
                    className="font-semibold text-zinc-100 hover:text-violet-300 hover:underline"
                  >
                    {skill.title}
                  </Link>
                  <p className="mt-1 max-w-xl text-xs text-zinc-400">{skill.summary}</p>
                </td>
                <td className="py-3 pr-3 text-zinc-400">{skill.author}</td>
                <td className="py-3 text-right font-medium">{formatInstalls(skill.installs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
