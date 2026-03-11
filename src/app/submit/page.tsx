import type { Metadata } from "next";
import { SubmitSkillForm } from "@/components/submit-skill-form";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Submit a Skill",
  description:
    "Submit a Solana protocol skill to the SOL Skills registry through a pull request and the required JSON guide format.",
  path: "/submit",
  keywords: ["submit Solana skill", "contribute protocol skill", "skill registry PR"],
});

export default function SubmitPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Submit a Solana skill</h1>
      <p className="mt-3 text-zinc-300">
        Contributions happen via pull request. Add a JSON file inside the
        <code className="mx-1 rounded bg-zinc-900 px-1 py-0.5">skills/</code>
        folder and open a PR.
      </p>

      <section className="mt-8">
        <SubmitSkillForm />
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
        <h2 className="text-xl font-semibold">JSON template</h2>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-zinc-200">
{`{
  "slug": "build-a-solana-escrow-program",
  "title": "Build a Solana escrow program",
  "summary": "Write an Anchor escrow contract with tests and PDA-based vault authority.",
  "level": "advanced",
  "tags": ["anchor", "programs", "pdas", "testing"],
  "author": "your-name",
  "installs": 1200,
  "guide": {
    "markdown": "# Build a Solana escrow program\\n\\n## When to Apply\\n- Use for escrow transaction flows.\\n\\n## Trusted Endpoints\\n- Anchor docs\\n\\n## Flow\\n1. Validate accounts\\n2. Derive PDAs\\n3. Simulate and send\\n\\n## Failure Modes\\n- Missing signer\\n- PDA mismatch",
    "executionFlow": [
      {
        "title": "Core flow",
        "content": "1. Validate accounts\\n2. Build instructions\\n3. Simulate before send"
      }
    ],
    "landingGuidance": [
      {
        "title": "Transaction landing",
        "content": "- Set compute budget when needed\\n- Retry with fresh blockhash"
      }
    ],
    "failureHandling": [
      {
        "title": "Common failures",
        "content": "- Handle simulation errors\\n- Check PDA seed mismatches"
      }
    ]
  },
  "links": [
    { "label": "GitHub Repo", "href": "https://github.com/your-user/escrow" }
  ]
}`}
        </pre>
      </section>
    </main>
  );
}
