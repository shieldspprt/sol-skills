import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Docs",
  description:
    "Documentation for writing high-quality Solana protocol skills with clear execution flow, trusted sources, and failure handling.",
  path: "/docs",
  keywords: ["Solana docs", "protocol skill authoring", "agent documentation"],
});

export default function DocsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Writing high-quality protocol skills</h1>
      <p className="mt-3 leading-7 text-zinc-300">
        This guide follows the same documentation style used by strong skills on
        skills.sh: clear scope, structured references, and actionable rules.
        Your job is not to expose every SDK detail. Your job is to teach the
        agent where to look, what to trust, and what sequence to execute.
      </p>
      <p className="mt-3 text-sm text-zinc-400">
        Reference anchor:{" "}
        <a
          href="https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-violet-300"
        >
          vercel-react-best-practices
        </a>
      </p>

      <section className="mt-8 border-t border-zinc-800 pt-6">
        <h2 className="text-xl font-semibold">When to apply</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-300">
          <li>
            Use protocol skills when implementation accuracy matters more than
            generic code generation.
          </li>
          <li>
            Use them for transaction flows, risk checks, endpoint selection, and
            production-ready defaults.
          </li>
          <li>
            Assume agents can handle common tasks, but nuanced protocol behavior
            needs explicit instruction.
          </li>
        </ul>
      </section>

      <section className="mt-8 border-t border-zinc-800 pt-6">
        <h2 className="text-xl font-semibold">Guide format (recommended)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
                <th className="pb-2">Section</th>
                <th className="pb-2">What it must include</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800/70">
                <td className="py-2 font-medium">Purpose</td>
                <td className="py-2">What this skill solves and when to invoke it</td>
              </tr>
              <tr className="border-b border-zinc-800/70">
                <td className="py-2 font-medium">Trusted sources</td>
                <td className="py-2">Official endpoints, verified docs, and repo links</td>
              </tr>
              <tr className="border-b border-zinc-800/70">
                <td className="py-2 font-medium">Execution flow</td>
                <td className="py-2">Ordered steps with validation checkpoints</td>
              </tr>
              <tr className="border-b border-zinc-800/70">
                <td className="py-2 font-medium">Landing guidance</td>
                <td className="py-2">Compute budget, fees, Jito path, retries</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Failure handling</td>
                <td className="py-2">Known failure modes and mitigations</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 border-t border-zinc-800 pt-6">
        <h2 className="text-xl font-semibold">Quick reference: Jupiter swap skill</h2>
        <p className="mt-3 leading-7 text-zinc-300">
          For a “build swap transaction with Jupiter API” skill, include the
          high-signal pieces below. This is the difference between a useful
          skill and “figure it out from SDK docs”.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-300">
          <li>Quote endpoint and swap endpoint with request/response expectations.</li>
          <li>Verified token source and required token-mint validation checks.</li>
          <li>
            Transaction landing context: compute unit strategy, priority fee
            defaults, and Jito guidance when useful.
          </li>
          <li>Failure handling for slippage limits, stale quote windows, and simulation errors.</li>
          <li>Security notes: signer assumptions, token allowlists, and replay-safe behavior.</li>
        </ul>
      </section>

      <section className="mt-8 border-t border-zinc-800 pt-6">
        <h2 className="text-xl font-semibold">How to use in your skill repo</h2>
        <p className="mt-3 text-zinc-300">
          Keep the top-level `SKILL.md` concise and link to focused rule files.
          Each rule file should include:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-300">
          <li>Why this rule exists</li>
          <li>Bad example (what to avoid)</li>
          <li>Good example (preferred approach)</li>
          <li>Links to official protocol references</li>
        </ul>
      </section>

      <section className="mt-8 border-t border-zinc-800 pt-6">
        <h2 className="text-xl font-semibold">Anti-patterns to avoid</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-300">
          <li>Dumping SDK methods without flow control and decision logic</li>
          <li>Forcing the agent to infer protocol-specific nuances from raw docs</li>
          <li>Skipping endpoint trust model and validation requirements</li>
          <li>Ignoring tx-landing strategy (compute budget, fees, and retries)</li>
        </ul>
      </section>

      <section className="mt-8 border-t border-zinc-800 pt-6">
        <h2 className="text-xl font-semibold">Minimal template</h2>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-200">
{`# <Protocol Skill Name>

## When to Apply
- ...

## Trusted Endpoints
- quote: ...
- swap: ...
- verified tokens: ...

## Flow
1. Validate inputs
2. Fetch quote
3. Build transaction
4. Simulate and verify
5. Send with landing strategy

## Failure Modes
- stale quote: ...
- slippage exceeded: ...
- simulation fail: ...`}
        </pre>
      </section>
    </main>
  );
}
