"use client";

import { useMemo, useState } from "react";

const areaClass =
  "w-full rounded-lg border border-zinc-300 bg-white p-2 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

function textToBinary(s: string): string {
  return Array.from(new TextEncoder().encode(s))
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryToText(s: string): { out?: string; error?: string } {
  const clean = s.replace(/[^01]/g, "");
  if (s.trim() === "") return { out: "" };
  if (/[^01\s]/.test(s)) return { error: "Binary input may only contain 0, 1 and spaces." };
  if (clean.length % 8 !== 0) return { error: "Binary length must be a multiple of 8 bits (" + clean.length + " bits entered)." };
  const bytes = new Uint8Array(clean.length / 8);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 8, i * 8 + 8), 2);
  try {
    return { out: new TextDecoder("utf-8", { fatal: true }).decode(bytes) };
  } catch {
    return { error: "These bytes are not valid UTF-8 text." };
  }
}

export function BinaryTranslatorWidget() {
  const [mode, setMode] = useState<"toBinary" | "toText">("toBinary");
  const [input, setInput] = useState("Hello");
  const [copied, setCopied] = useState(false);

  const res = useMemo(() => {
    if (mode === "toBinary") return { out: textToBinary(input) } as { out?: string; error?: string };
    return binaryToText(input);
  }, [mode, input]);

  const copy = async () => {
    if (!res.out) return;
    try {
      await navigator.clipboard.writeText(res.out);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const tab = (active: boolean) =>
    "rounded-lg border px-3 py-1 text-sm " +
    (active ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900" : "border-zinc-300 dark:border-zinc-700");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={tab(mode === "toBinary")} onClick={() => { setMode("toBinary"); setInput("Hello"); }}>
          Text to binary
        </button>
        <button type="button" className={tab(mode === "toText")} onClick={() => { setMode("toText"); setInput("01001000 01100101 01101100 01101100 01101111"); }}>
          Binary to text
        </button>
      </div>
      <label className="block text-sm">
        {mode === "toBinary" ? "Text" : "Binary (8-bit groups)"}
        <textarea className={areaClass} rows={5} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div>
        <div className="mb-1 flex items-center justify-between text-sm">
          <span>{mode === "toBinary" ? "Binary" : "Text"}</span>
          <button type="button" onClick={copy} className="rounded-lg border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700">
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        {res.error ? (
          <p className="text-sm text-red-600">{res.error}</p>
        ) : (
          <textarea className={areaClass} rows={5} readOnly value={res.out ?? ""} aria-label="Result" />
        )}
      </div>
    </div>
  );
}
