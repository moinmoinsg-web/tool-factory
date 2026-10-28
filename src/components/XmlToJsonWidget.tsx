"use client";

import { useMemo, useState } from "react";

type IndentOption = "2" | "4" | "tab";

const INDENTS: { label: string; value: IndentOption }[] = [
  { label: "2 spaces", value: "2" },
  { label: "4 spaces", value: "4" },
  { label: "Tab", value: "tab" },
];

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<catalog name="Tool Factory">
  <tool id="1" free="true">
    <title>JSON Formatter</title>
    <tags><tag>json</tag><tag>developer</tag></tags>
  </tool>
  <tool id="2" free="true">
    <title>XML to JSON Converter</title>
    <tags><tag>xml</tag></tags>
    <notes><![CDATA[Runs in your browser & keeps data private]]></notes>
  </tool>
</catalog>`;

export type XmlToJsonOptions = {
  attributePrefix: string;
  textKey: string;
  includeAttributes: boolean;
  inferTypes: boolean;
  alwaysArray: boolean;
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function coerce(value: string, inferTypes: boolean): JsonValue {
  if (!inferTypes) return value;
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed) && trimmed.length < 16) {
    return Number(trimmed);
  }
  return value;
}

function elementToJson(el: Element, opts: XmlToJsonOptions): JsonValue {
  const obj: { [key: string]: JsonValue } = {};
  let hasContent = false;

  if (opts.includeAttributes) {
    for (const attr of Array.from(el.attributes)) {
      obj[opts.attributePrefix + attr.name] = coerce(attr.value, opts.inferTypes);
      hasContent = true;
    }
  }

  let text = "";
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const child = node as Element;
      const value = elementToJson(child, opts);
      const key = child.nodeName;
      if (key in obj) {
        const existing = obj[key];
        obj[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      } else {
        obj[key] = opts.alwaysArray ? [value] : value;
      }
      hasContent = true;
    } else if (
      node.nodeType === Node.TEXT_NODE ||
      node.nodeType === Node.CDATA_SECTION_NODE
    ) {
      text += node.nodeValue ?? "";
    }
  }

  const trimmedText = text.trim();
  if (!hasContent) {
    return trimmedText === "" ? "" : coerce(trimmedText, opts.inferTypes);
  }
  if (trimmedText !== "") {
    obj[opts.textKey] = coerce(trimmedText, opts.inferTypes);
  }
  return obj;
}

export function convertXmlToJson(
  input: string,
  opts: XmlToJsonOptions,
  indent: IndentOption,
): { output: string; error: string | null } {
  if (input.trim() === "") return { output: "", error: null };
  try {
    const doc = new DOMParser().parseFromString(input, "application/xml");
    const parserError = doc.getElementsByTagName("parsererror")[0];
    if (parserError) {
      const message = (parserError.textContent ?? "Invalid XML")
        .replace(/\s+/g, " ")
        .replace(/^This page contains the following errors:\s*/i, "")
        .replace(/Below is a rendering of the page.*$/i, "")
        .trim();
      return { output: "", error: message || "Invalid XML" };
    }
    const root = doc.documentElement;
    const json = { [root.nodeName]: elementToJson(root, opts) };
    const space = indent === "tab" ? "\t" : Number(indent);
    return { output: JSON.stringify(json, null, space), error: null };
  } catch (err) {
    return { output: "", error: err instanceof Error ? err.message : String(err) };
  }
}

export function XmlToJsonWidget() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<IndentOption>("2");
  const [includeAttributes, setIncludeAttributes] = useState(true);
  const [inferTypes, setInferTypes] = useState(true);
  const [alwaysArray, setAlwaysArray] = useState(false);
  const [attributePrefix, setAttributePrefix] = useState("@");
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () =>
      convertXmlToJson(
        input,
        { attributePrefix, textKey: "#text", includeAttributes, inferTypes, alwaysArray },
        indent,
      ),
    [input, attributePrefix, includeAttributes, inferTypes, alwaysArray, indent],
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
    a.download = "converted.json";
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
        ? { ok: false, text: `Invalid XML: ${result.error}` }
        : { ok: true, text: `Converted · ${result.output.length.toLocaleString()} characters of JSON` };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className={labelClass}>
          Indent
          <select
            value={indent}
            onChange={(e) => setIndent(e.target.value as IndentOption)}
            className="rounded-lg border border-zinc-300 bg-zinc-50 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {INDENTS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <input type="checkbox" checked={includeAttributes} onChange={(e) => setIncludeAttributes(e.target.checked)} />
          Include attributes
        </label>
        <label className={labelClass}>
          Attribute prefix
          <input
            type="text"
            value={attributePrefix}
            disabled={!includeAttributes}
            onChange={(e) => setAttributePrefix(e.target.value)}
            className="w-14 rounded-lg border border-zinc-300 bg-zinc-50 p-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className={labelClass}>
          <input type="checkbox" checked={inferTypes} onChange={(e) => setInferTypes(e.target.checked)} />
          Detect numbers &amp; booleans
        </label>
        <label className={labelClass}>
          <input type="checkbox" checked={alwaysArray} onChange={(e) => setAlwaysArray(e.target.checked)} />
          Always use arrays
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setInput(SAMPLE)}>
          Load sample
        </button>
        <label className={`${buttonClass} cursor-pointer`}>
          Upload .xml
          <input
            type="file"
            accept=".xml,text/xml,application/xml"
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
          <label htmlFor="xml-input" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Input XML
          </label>
          <textarea
            id="xml-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste XML here, e.g. <note><to>you</to></note>"
            rows={16}
            spellCheck={false}
            className={`mt-1 ${areaClass}`}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="json-output" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              JSON output
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
