"use client";

import { useMemo, useState } from "react";

function countStats(text: string) {
  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences =
    trimmed === ""
      ? 0
      : (trimmed.match(/[.!?]+(?:\s|$)/g) || []).length ||
        (trimmed.length > 0 ? 1 : 0);
  const paragraphs =
    trimmed === ""
      ? 0
      : trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  return { words, characters, charactersNoSpaces, sentences, paragraphs };
}

/** Sample interactive shell for the word-counter tool. */
export function WordCounterWidget() {
  const [text, setText] = useState("");
  const stats = useMemo(() => countStats(text), [text]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <label htmlFor="word-counter-input" className="sr-only">
        Text to count
      </label>
      <textarea
        id="word-counter-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        rows={10}
        className="w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
      />
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(
          [
            ["Words", stats.words],
            ["Characters", stats.characters],
            ["No spaces", stats.charactersNoSpaces],
            ["Sentences", stats.sentences],
            ["Paragraphs", stats.paragraphs],
          ] as const
        ).map(([label, value]) => (
          <li
            key={label}
            className="rounded-lg bg-zinc-100 px-3 py-2 text-center dark:bg-zinc-900"
          >
            <div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {value}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {label}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
