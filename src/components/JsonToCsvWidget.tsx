"use client";

import { useMemo, useState } from "react";

type DelimiterOption = "," | ";" | "\t" | "|";

const DELIMITERS: { label: string; value: DelimiterOption }[] = [
  { label: "Comma (,)", value: "," },
  { label: "Semicolon (;)", value: ";" },
  { label: "Tab", value: "\t" },
  { label: "Pipe (|)", value: "|" },
];

const SAMPLE = `[
  {
    "id": 1,
    "name": "JSON Formatter",
    "free": true,
    "stats": { "users": 1200, "rating": 4.8 },
    "tags": ["json", "developer"]
  },
  {
    "id": 2,
    "name": "XML to JSON Converter",
    "free": true,
    "stats": { "users": 640, "rating": 4.7 },
    "tags": ["xml", "json"],
    "notes": "Runs in your browser, \\"private\\" by design"
  }
]`;

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type Row = Record<string, JsonValue>;

export type JsonToCsvOptions = {
  delimiter: DelimiterOption;
  flatten: boolean;
  includeHeader: boolean;
  quoteAll: boolean;
};

function isPlainObject(value: unknown): value is { [key: string]: JsonValue } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function flattenObject(obj: { [key: string]: JsonValue }, prefix = "", out: Row = {}): Row {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value) && Object.keys(value).length > 0) {
      flattenObject(value, path, out);
    } else {
      out[path] = value;
    }
  }
  return out;
}

/** Find the array of records to convert: top-level array, a single object, or the first array property. */
function extractRecords(data: JsonValue): JsonValue[] {
  if (Array.isArray(data)) return data;
  if (isPlainObject(data)) {
    const arrayProp = Object.values(data).find(
      (v) => Array.isArray(v) && v.length > 0 && v.every(isPlainObject),
    );
    if (arrayProp && Object.keys(data).length === 1) return arrayProp as JsonValue[];
    return [data];
  }
  return [data];
}

function cellToString(value: JsonValue | undefined): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value) && value.every((v) => v === null || typeof v !== "object")) {
    return value.map((v) => (v === null ? "" : String(v))).join(", ");
  }
  return JSON.stringify(value);
}

function escapeCell(text: string, delimiter: string, quoteAll: boolean): string {
  const needsQuotes =
    quoteAll ||
    text.includes(delimiter) ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r") ||
    /^\s|\s$/.test(text);
  const escaped = text.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function convertJsonToCsv(
  input: string,
  opts: JsonToCsvOptions,
): { output: string; error: string | null; rows: number; columns: number } {
  if (input.trim() === "") return { output: "", error: null, rows: 0, columns: 0 };
  let data: JsonValue;
  try {
    data = JSON.parse(input) as JsonValue;
  } catch (err) {
    return {
      output: "",
      error: err instanceof Error ? err.message : String(err),
      rows: 0,
      columns: 0,
    };
  }

  const records = extractRecords(data);
  const rows: Row[] = records.map((record) => {
    if (isPlainObject(record)) {
      return opts.flatten ? flattenObject(record) : { ...record };
    }
    return { value: record };
  });

  const headers: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        headers.push(key);
      }
    }
  }

  const d = opts.delimiter;
  const lines: string[] = [];
  if (opts.includeHeader) {
    lines.push(headers.map((h) => escapeCell(h, d, opts.quoteAll)).join(d));
  }
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCell(cellToString(row[h]), d, opts.quoteAll)).join(d));
  }

  return { output: lines.join("\r\n"), error: null, rows: rows.length, columns: headers.length };
}

export function JsonToCsvWidget() {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState<DelimiterOption>(",");
  const [flatten, setFlatten] = useState(true);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [quoteAll, setQuoteAll] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => convertJsonToCsv(input, { delimiter, flatten, includeHeader, quoteAll }),
    [input, delimiter, flatten, includeHeader, quoteAll],
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
    const isTab = delimiter === "\t";
    // BOM so Excel opens UTF-8 correctly.
    const blob = new Blob(["\uFEFF" + result.output], {
      type: isTab ? "text/tab-separated-values" : "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isTab ? "converted.tsv" : "converted.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setInput(await file.text());
  };

  const areaClass =
    "w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-3 font-mono text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";
  const buttonClass =
    "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:border-zinc-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200";
  const labelClass = "flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300";

  const status =
    input.trim() === ""
      ? null
      : result.error
        ? { ok: false, text: `Invalid JSON: ${result.error}` }
        : {
            ok: true,
            text: `Converted · ${result.rows.toLocaleString()} row${result.rows === 1 ? "" : "s"} × ${result.columns.toLocaleString()} column${result.columns === 1 ? "" : "s"}`,
          };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className={labelClass}>
          Delimiter
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value as DelimiterOption)}
            className="rounded-lg border border-zinc-300 bg-zinc-50 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {DELIMITERS.map((o) => (
              <option key={o.label} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <input type="checkbox" checked={flatten} onChange={(e) => setFlatten(e.target.checked)} />
          Flatten nested objects
        </label>
        <label className={labelClass}>
          <input type="checkbox" checked={includeHeader} onChange={(e) => setIncludeHeader(e.target.checked)} />
          Include header row
        </label>
        <label className={labelClass}>
          <input type="checkbox" checked={quoteAll} onChange={(e) => setQuoteAll(e.target.checked)} />
          Quote all fields
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setInput(SAMPLE)}>
          Load sample
        </button>
        <label className={`${buttonClass} cursor-pointer`}>
          Upload .json
          <input
            type="file"
            accept=".json,application/json,text/plain"
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
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
            placeholder='Paste JSON here, e.g. [{"name":"Ada","age":36}]'
            rows={16}
            spellCheck={false}
            className={`mt-1 ${areaClass}`}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="csv-output" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              CSV output
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
            id="csv-output"
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
