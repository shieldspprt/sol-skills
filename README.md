# Sol Skills

Sol Skills is a Next.js directory for Solana-focused agent skills. It presents protocol and tooling guides as structured JSON records, renders them as browsable skill pages, and gives contributors a simple way to publish new skills through pull requests.

The project is modeled as a lightweight registry:

- `skills/*.json` stores the source of truth for each skill
- the homepage lists skills in a searchable leaderboard
- each skill page renders a structured guide with trusted sources and operational guidance
- `/docs` defines the writing standard for high-quality protocol skills

## What the app does

- Lists skills by title, summary, author, and install stats
- Renders individual skill pages from local JSON files
- Supports full embedded guides for each skill, not just metadata
- Encourages protocol-specific documentation patterns:
  - purpose
  - trusted sources
  - execution flow
  - landing guidance
  - failure handling
  - full guide markdown

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

## Project layout

```text
src/
  app/
    page.tsx                # homepage
    docs/page.tsx           # skill writing guide
    submit/page.tsx         # submission instructions and template
    skills/[slug]/page.tsx  # skill detail page
  components/
    skills-leaderboard.tsx
    markdown-content.tsx
    copy-install-command-button.tsx
  lib/
    skills.ts               # skill type + loader
    project.ts              # repo URL and skills directory config

skills/
  *.json                    # one JSON file per skill
```

## Local development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Other useful commands:

```bash
npm run lint
npm run build
npm run start
```

## Environment

The app uses `NEXT_PUBLIC_GITHUB_REPO` to build contributor links and install commands.

Create `.env.local` if you want those links to point at your real repository:

```bash
NEXT_PUBLIC_GITHUB_REPO=https://github.com/your-org/sol-skills
```

If unset, the app falls back to:

```text
https://github.com/your-org/sol-skills
```

## Skill format

Each skill is a JSON file in `skills/`.

Required top-level fields:

- `slug`
- `title`
- `summary`
- `level`
- `tags`
- `author`
- `guide.markdown`

Common optional fields:

- `installs`
- `publisherVerified`
- `repository`
- `links`
- `guide.executionFlow`
- `guide.landingGuidance`
- `guide.failureHandling`

Example:

```json
{
  "slug": "build-a-solana-escrow-program",
  "title": "Build a Solana escrow program",
  "summary": "Write an Anchor escrow contract with tests and PDA-based vault authority.",
  "level": "advanced",
  "tags": ["anchor", "programs", "pdas", "testing"],
  "author": "your-name",
  "installs": 1200,
  "repository": "your-org/escrow-skill",
  "links": [
    {
      "label": "GitHub Repo",
      "href": "https://github.com/your-org/escrow-skill"
    }
  ],
  "guide": {
    "markdown": "# Build a Solana escrow program\n\n## When to Apply\n- Use for escrow transaction flows.\n\n## Trusted Endpoints\n- Anchor docs\n\n## Flow\n1. Validate accounts\n2. Derive PDAs\n3. Simulate and send\n\n## Failure Modes\n- Missing signer\n- PDA mismatch",
    "executionFlow": [
      {
        "title": "Core flow",
        "content": "1. Validate accounts\n2. Build instructions\n3. Simulate before send"
      }
    ],
    "landingGuidance": [
      {
        "title": "Transaction landing",
        "content": "- Set compute budget when needed\n- Retry with fresh blockhash"
      }
    ],
    "failureHandling": [
      {
        "title": "Common failures",
        "content": "- Handle simulation errors\n- Check PDA seed mismatches"
      }
    ]
  }
}
```

## Writing standard

The canonical writing guide lives in:

- [src/app/docs/page.tsx](/Users/amir/development/sol-skills/src/app/docs/page.tsx)

The standard is intentionally opinionated. Strong skills should answer:

1. What problem does this skill solve?
2. Which docs, endpoints, and repos are trusted?
3. What order should the agent execute work in?
4. How should transactions or requests land safely?
5. What failure modes matter in production?

Avoid turning a skill into a raw SDK dump. The goal is operational clarity, not exhaustive API enumeration without flow control.

## Adding a new skill

1. Create `skills/<slug>.json`.
2. Follow the JSON schema above.
3. Include a real `guide.markdown`, not just metadata.
4. Add trusted source links.
5. Run:

```bash
npm run lint
```

6. Open a pull request.

## Updating imported skills

Some skills in this repo were imported from upstream protocol or ecosystem sources. When updating those, keep two things consistent:

- the short metadata used by the leaderboard
- the full guide content used by the skill page

If the upstream guide changes, update the local JSON instead of relying on runtime fetches. This repo is designed to serve a checked-in, reviewable copy of each skill.

## Rendering model

Skill pages are generated from local JSON via [src/lib/skills.ts](/Users/amir/development/sol-skills/src/lib/skills.ts). The detail page at [src/app/skills/[slug]/page.tsx](/Users/amir/development/sol-skills/src/app/skills/[slug]/page.tsx) renders:

- summary as the skill purpose
- `links` as trusted sources
- structured guide sections when present
- full embedded markdown via [src/components/markdown-content.tsx](/Users/amir/development/sol-skills/src/components/markdown-content.tsx)

## Notes

- The app currently reads skills from the local `skills/` directory only.
- Builds may require network access if `next/font` needs to fetch remote fonts.
- The repo may contain imported third-party skill content; review changes carefully before merging.
# sol-skills
