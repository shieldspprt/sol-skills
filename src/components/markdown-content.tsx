import type { ReactNode } from "react";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

type Block =
  | { type: "heading"; depth: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullet-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "code"; lang: string; content: string }
  | { type: "rule" };

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const value = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }

    if (value.startsWith("`")) {
      parts.push(
        <code
          key={`${index}-code`}
          className="rounded bg-zinc-900 px-1 py-0.5 text-[0.95em] text-zinc-100"
        >
          {value.slice(1, -1)}
        </code>,
      );
    } else if (value.startsWith("**")) {
      parts.push(<strong key={`${index}-strong`}>{value.slice(2, -2)}</strong>);
    } else {
      const linkMatch = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        parts.push(
          <a
            key={`${index}-link`}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-violet-300"
          >
            {linkMatch[1]}
          </a>,
        );
      } else {
        parts.push(value);
      }
    }

    lastIndex = index + value.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function parseMarkdown(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let bulletItems: string[] = [];
  let orderedItems: string[] = [];
  let codeLines: string[] = [];
  let codeLang = "";
  let inCode = false;

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  }

  function flushBulletList() {
    if (bulletItems.length > 0) {
      blocks.push({ type: "bullet-list", items: bulletItems });
      bulletItems = [];
    }
  }

  function flushOrderedList() {
    if (orderedItems.length > 0) {
      blocks.push({ type: "ordered-list", items: orderedItems });
      orderedItems = [];
    }
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      flushParagraph();
      flushBulletList();
      flushOrderedList();

      if (inCode) {
        blocks.push({
          type: "code",
          lang: codeLang,
          content: codeLines.join("\n"),
        });
        inCode = false;
        codeLang = "";
        codeLines = [];
      } else {
        inCode = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushBulletList();
      flushOrderedList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushBulletList();
      flushOrderedList();
      blocks.push({
        type: "heading",
        depth: headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6,
        text: headingMatch[2].trim(),
      });
      continue;
    }

    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      flushParagraph();
      flushBulletList();
      flushOrderedList();
      blocks.push({ type: "rule" });
      continue;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      flushOrderedList();
      bulletItems.push(bulletMatch[1].trim());
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      flushBulletList();
      orderedItems.push(orderedMatch[1].trim());
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushBulletList();
  flushOrderedList();

  return blocks;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const blocks = parseMarkdown(content);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          if (block.depth === 1) {
            return (
              <h1 key={index} className="mt-8 text-3xl font-semibold first:mt-0">
                {block.text}
              </h1>
            );
          }

          if (block.depth === 2) {
            return (
              <h2
                key={index}
                className="mt-8 border-t border-zinc-800 pt-6 text-2xl font-semibold first:mt-0 first:border-t-0 first:pt-0"
              >
                {block.text}
              </h2>
            );
          }

          return (
            <h3 key={index} className="mt-6 text-xl font-semibold">
              {block.text}
            </h3>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p key={index} className="mt-3 leading-7 text-zinc-300">
              {renderInline(block.text)}
            </p>
          );
        }

        if (block.type === "bullet-list") {
          return (
            <ul key={index} className="mt-3 list-disc space-y-2 pl-6 text-zinc-300">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ordered-list") {
          return (
            <ol key={index} className="mt-3 list-decimal space-y-2 pl-6 text-zinc-300">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              key={index}
              className="mt-4 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-200"
            >
              <code>{block.content}</code>
            </pre>
          );
        }

        return <hr key={index} className="mt-6 border-zinc-800" />;
      })}
    </div>
  );
}
