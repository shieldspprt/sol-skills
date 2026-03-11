"use client";

import { useState } from "react";

export function CopyInstallCommandButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 hover:border-zinc-500"
      aria-label="Copy install command"
      title="Copy install command"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
