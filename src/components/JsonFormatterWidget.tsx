"use client";

import { useMemo, useState } from "react";

type IndentOption = "2" | "4" | "tab";

const INDENTS: { label: string; value: IndentOption }[] = [
  { label: "2 spaces", value: "2" },
  { label: "4 spaces", value: "4" },
  { label: "Tab", value: "tab" },
];

const SAMPLE = '{"name":"Tool Factory","tools":["word counter","fd calculator","json formatter"],"free":true,"version":1.2,"meta":{"private":true,"signup":null}}';

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

/** Translate a JSON.parse error position into line/column for friendlier messages. */
function describeError(input: string, err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  const posMatch = message.match(/position (\d+)/i);
  if (posMatch) {
    const pos = Number(posMatch[1]);
    const before = input.slice(0, pos);
    const line = before.split("\n").length;
    const column = pos - before.lastIndexOf("\n");
    return `${message} (line ${line}, column ${column})`;
  }
  return message;
}

export function formatJson(
  input: string,
  mode: "beautify" | "minify",
  indent: IndentOption,
  sortKeys: boolean,
): { output: string; error: string | null } {
  if (input.trim() === "") return { output: "", error: null };
  try {
    let parsed: unknown = JSON.parse(input);
    if (sortKeys) parsed = sortKeysDeep(parsed);
    const space = mode === "minify" ? undefined : indent === "tab" ? "\t" : Number(indent);
    return { output: JSON.stringify(parsed, null, space), error: null };
  } catch (err) {
    return { output: "", error: describeError(input, err) };
  }
}

export function JsonFormatterWidget() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"beautify" | "minify">("beautify");
  const [indent, setIndent] = useState<IndentOption>("2");
  const [sortKeys, setSortKeys] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => formatJson(input, mode, indent, sortKeys),
    [input, mode, indent, sortKeys],
  );

  const copy = async () => {
    if (!result.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const download = () => {
    if (!result.output) return;
    const blob = new Blob([result.output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "minify" ? "formatted.min.json" : "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const areaClass =
    "w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-3 font-mono text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";
  const buttonClass =
    "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:border-zinc-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200";
  const activeClass =
    "rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900";

  const status = input.trim() === ""
    ? null
    : result.error
      ? { ok: false, text: `Invalid JSON: ${result.error}` }
      : { ok: true, text: `Valid JSON · ${result.output.length.toLocaleString()} characters` };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={mode === "beautify" ? activeClass : buttonClass} onClick={() => setMode("beautify")}>
          Beautify
        </button>
        <button type="button" className={mode === "minify" ? activeClass : buttonClass} onClick={() => setMode("minify")}>
          Minify
        </button>
        <label className="ml-1 flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          Indent
          <select
            value={indent}
            disabled={mode === "minify"}
            onChange={(e) => setIndent(e.target.value as IndentOption)}
            className="rounded-lg border border-zinc-300 bg-zinc-50 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {INDENTS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} />
          Sort keys
        </label>
        <button type="button" className={buttonClass} onClick={() => setInput(SAMPLE)}>
          Load sample
        </button>
        <button type="button" className={buttonClass} onClick={() => setInput("")} disabled={!input}>
          Clear
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="json-input" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Input JSON
          </label>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON here, e.g. {"hello":"world"}'
            rows={16}
            spellCheck={false}
            className={`mt-1 ${areaClass}`}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="json-output" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Formatted output
            </label>
            <div className="flex gap-2">
              <button type="button" className={buttonClass} onClick={copy} disabled={!result.output}>
                {copied ? "Copied!" : "Copy"}
              </button>
              <button type="button" className={buttonClass} onClick={download} disabled={!result.output}>
                Download
              </button>
            </div>
          </div>
          <textarea
            id="json-output"
            value={result.output}
            readOnly
            rows={16}
            spellCheck={false}
            className={`mt-1 ${areaClass}`}
          />
        </div>
      </div>

      {status && (
        <p
          role="status"
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            status.ok
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {status.text}
        </p>
      )}
    </div>
  );
}
