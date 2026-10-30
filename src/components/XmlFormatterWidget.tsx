"use client";

import { useMemo, useState } from "react";

type IndentOption = "2" | "4" | "tab";
type Mode = "beautify" | "minify";

const INDENTS: { label: string; value: IndentOption }[] = [
  { label: "2 spaces", value: "2" },
  { label: "4 spaces", value: "4" },
  { label: "Tab", value: "tab" },
];

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?><catalog name="Tool Factory"><!-- free developer tools --><tool id="1" free="true"><title>JSON Formatter</title><tags><tag>json</tag><tag>developer</tag></tags></tool><tool id="2" free="true"><title>XML Formatter</title><tags><tag>xml</tag></tags><notes><![CDATA[Runs in your browser & keeps data private]]></notes><empty></empty></tool></catalog>`;

export type XmlFormatOptions = {
  mode: Mode;
  indent: IndentOption;
  selfClose: boolean;
  keepComments: boolean;
};

function escapeText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "&#10;")
    .replace(/\t/g, "&#9;");
}

function serializeAttributes(el: Element): string {
  return Array.from(el.attributes)
    .map((attr) => ` ${attr.name}="${escapeAttr(attr.value)}"`)
    .join("");
}

function significantChildren(el: Node, keepComments: boolean): ChildNode[] {
  return Array.from(el.childNodes).filter((node) => {
    if (node.nodeType === Node.TEXT_NODE) return (node.nodeValue ?? "").trim() !== "";
    if (node.nodeType === Node.COMMENT_NODE) return keepComments;
    return true;
  });
}

function serializeNode(node: Node, opts: XmlFormatOptions, depth: number, unit: string): string {
  const pretty = opts.mode === "beautify";
  const pad = pretty ? unit.repeat(depth) : "";
  const nl = pretty ? "\n" : "";

  switch (node.nodeType) {
    case Node.TEXT_NODE:
      return pad + escapeText((node.nodeValue ?? "").trim());
    case Node.CDATA_SECTION_NODE:
      return `${pad}<![CDATA[${node.nodeValue ?? ""}]]>`;
    case Node.COMMENT_NODE:
      return `${pad}<!--${node.nodeValue ?? ""}-->`;
    case Node.PROCESSING_INSTRUCTION_NODE: {
      const pi = node as ProcessingInstruction;
      return `${pad}<?${pi.target}${pi.data ? " " + pi.data : ""}?>`;
    }
    case Node.ELEMENT_NODE: {
      const el = node as Element;
      const open = `<${el.nodeName}${serializeAttributes(el)}`;
      const children = significantChildren(el, opts.keepComments);
      if (children.length === 0) {
        return pad + (opts.selfClose ? `${open}/>` : `${open}></${el.nodeName}>`);
      }
      const inlineOnly = children.every(
        (c) => c.nodeType === Node.TEXT_NODE || c.nodeType === Node.CDATA_SECTION_NODE,
      );
      if (inlineOnly) {
        const inner = children
          .map((c) =>
            c.nodeType === Node.TEXT_NODE
              ? escapeText((c.nodeValue ?? "").trim())
              : `<![CDATA[${c.nodeValue ?? ""}]]>`,
          )
          .join("");
        return `${pad}${open}>${inner}</${el.nodeName}>`;
      }
      const inner = children.map((c) => serializeNode(c, opts, depth + 1, unit)).join(nl);
      return `${pad}${open}>${nl}${inner}${nl}${pad}</${el.nodeName}>`;
    }
    default:
      return "";
  }
}

export function formatXml(
  input: string,
  opts: XmlFormatOptions,
): { output: string; error: string | null; elements: number } {
  if (input.trim() === "") return { output: "", error: null, elements: 0 };
  try {
    const doc = new DOMParser().parseFromString(input, "application/xml");
    const parserError = doc.getElementsByTagName("parsererror")[0];
    if (parserError) {
      const message = (parserError.textContent ?? "Invalid XML")
        .replace(/\s+/g, " ")
        .replace(/^This page contains the following errors:\s*/i, "")
        .replace(/Below is a rendering of the page.*$/i, "")
        .trim();
      return { output: "", error: message || "Invalid XML", elements: 0 };
    }
    const unit = opts.indent === "tab" ? "\t" : " ".repeat(Number(opts.indent));
    const nl = opts.mode === "beautify" ? "\n" : "";
    const parts: string[] = [];
    const decl = input.trimStart().match(/^<\?xml[\s\S]*?\?>/);
    if (decl) parts.push(decl[0]);
    if (doc.doctype) {
      const dt = doc.doctype;
      let s = `<!DOCTYPE ${dt.name}`;
      if (dt.publicId) s += ` PUBLIC "${dt.publicId}"`;
      if (dt.systemId) s += `${dt.publicId ? "" : " SYSTEM"} "${dt.systemId}"`;
      parts.push(s + ">");
    }
    for (const node of significantChildren(doc, opts.keepComments)) {
      if (node.nodeType === Node.DOCUMENT_TYPE_NODE) continue;
      parts.push(serializeNode(node, opts, 0, unit));
    }
    return {
      output: parts.join(nl),
      error: null,
      elements: doc.getElementsByTagName("*").length,
    };
  } catch (err) {
    return { output: "", error: err instanceof Error ? err.message : String(err), elements: 0 };
  }
}

export function XmlFormatterWidget() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("beautify");
  const [indent, setIndent] = useState<IndentOption>("2");
  const [selfClose, setSelfClose] = useState(true);
  const [keepComments, setKeepComments] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => formatXml(input, { mode, indent, selfClose, keepComments }),
    [input, mode, indent, selfClose, keepComments],
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
    const blob = new Blob([result.output], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "minify" ? "minified.xml" : "formatted.xml";
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
  const modeClass = (active: boolean) =>
    `px-3 py-2 text-sm font-medium ${
      active
        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
        : "bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-300"
    }`;

  const status =
    input.trim() === ""
      ? null
      : result.error
        ? { ok: false, text: `Invalid XML: ${result.error}` }
        : {
            ok: true,
            text: `Valid XML · ${result.elements.toLocaleString()} elements · ${result.output.length.toLocaleString()} characters`,
          };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700" role="group" aria-label="Mode">
          <button type="button" className={modeClass(mode === "beautify")} onClick={() => setMode("beautify")} aria-pressed={mode === "beautify"}>
            Beautify
          </button>
          <button type="button" className={modeClass(mode === "minify")} onClick={() => setMode("minify")} aria-pressed={mode === "minify"}>
            Minify
          </button>
        </div>
        <label className={labelClass}>
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
        <label className={labelClass}>
          <input type="checkbox" checked={selfClose} onChange={(e) => setSelfClose(e.target.checked)} />
          Self-close empty tags
        </label>
        <label className={labelClass}>
          <input type="checkbox" checked={keepComments} onChange={(e) => setKeepComments(e.target.checked)} />
          Keep comments
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
            accept=".xml,.svg,.rss,.xsd,.xsl,.config,text/xml,application/xml"
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
            placeholder="Paste XML here, e.g. <note><to>you</to><body>Hello</body></note>"
            rows={16}
            spellCheck={false}
            className={`mt-1 ${areaClass}`}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="xml-output" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {mode === "minify" ? "Minified XML" : "Formatted XML"}
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
            id="xml-output"
            value={result.output}
            readOnly
            rows={16}
            spellCheck={false}
            wrap="off"
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
