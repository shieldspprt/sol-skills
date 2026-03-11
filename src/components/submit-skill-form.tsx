"use client";

import { useMemo, useState } from "react";
import { buildNewSkillUrl } from "@/lib/project";
import { toSlug } from "@/lib/slug";

export function SubmitSkillForm() {
  const [title, setTitle] = useState("");
  const slug = useMemo(() => toSlug(title), [title]);
  const filename = slug ? `${slug}.json` : "my-skill.json";
  const createSkillUrl = useMemo(() => buildNewSkillUrl(filename), [filename]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
      <h2 className="text-xl font-semibold">Generate your skill file name</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Use your skill title, then click to open GitHub and create a new file
        in the skills folder.
      </p>

      <label className="mt-5 block text-sm font-medium" htmlFor="skill-title">
        Skill title
      </label>
      <input
        id="skill-title"
        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-violet-500"
        placeholder="Build a Solana escrow program"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <p className="mt-3 text-sm text-zinc-300">
        File name: <code className="rounded bg-zinc-950 px-1 py-0.5">{filename}</code>
      </p>

      <a
        href={createSkillUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
      >
        Create this file on GitHub
      </a>
    </div>
  );
}
