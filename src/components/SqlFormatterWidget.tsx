"use client";

import { useMemo, useState } from "react";

type IndentOption = "2" | "4" | "tab";
type CaseOption = "upper" | "lower" | "keep";
type Mode = "beautify" | "minify";

const SAMPLE = `select u.id, u.name, count(o.id) as orders, sum(o.total) as revenue from users u left join orders o on o.user_id = u.id and o.status = 'paid' where u.created_at >= '2026-01-01' and u.country in ('US','CA') group by u.id, u.name having count(o.id) > 2 order by revenue desc limit 50;`;

const KEYWORDS = new Set(
  `select from where and or not in is null as on join inner left right full outer cross natural group by order having limit offset union all intersect except distinct insert into values update set delete create table alter drop index view with case when then else end like ilike between exists asc desc using over partition returning primary key foreign references default unique check if true false`.split(
    " ",
  ),
);

// Clauses that start a new line at the base indentation.
const CLAUSES = [
  "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
  "UNION ALL", "UNION", "INTERSECT", "EXCEPT", "INSERT INTO", "VALUES", "UPDATE",
  "SET", "DELETE FROM", "RETURNING",
];
const JOINS = [
  "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN", "LEFT JOIN", "RIGHT JOIN",
  "FULL JOIN", "INNER JOIN", "CROSS JOIN", "NATURAL JOIN", "JOIN",
];

type Token = { type: "word" | "string" | "comment" | "punct" | "space"; text: string };

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < sql.length) {
    const ch = sql[i];
    const two = sql.slice(i, i + 2);
    if (/\s/.test(ch)) {
      let j = i;
      while (j < sql.length && /\s/.test(sql[j])) j++;
      tokens.push({ type: "space", text: " " });
      i = j;
    } else if (two === "--") {
      let j = i;
      while (j < sql.length && sql[j] !== "\n") j++;
      tokens.push({ type: "comment", text: sql.slice(i, j) });
      i = j;
    } else if (two === "/*") {
      const end = sql.indexOf("*/", i + 2);
      const j = end === -1 ? sql.length : end + 2;
      tokens.push({ type: "comment", text: sql.slice(i, j) });
      i = j;
    } else if (ch === "'" || ch === '"' || ch === "`") {
      let j = i + 1;
      while (j < sql.length) {
        if (sql[j] === ch) {
          if (sql[j + 1] === ch) { j += 2; continue; }
          break;
        }
        j++;
      }
      tokens.push({ type: "string", text: sql.slice(i, j + 1) });
      i = j + 1;
    } else if (/[A-Za-z0-9_$@:.#]/.test(ch)) {
      let j = i;
      while (j < sql.length && /[A-Za-z0-9_$@:.#]/.test(sql[j])) j++;
      tokens.push({ type: "word", text: sql.slice(i, j) });
      i = j;
    } else {
      const multi = ["<>", "<=", ">=", "!=", "||", "::"].includes(two) ? two : ch;
      tokens.push({ type: "punct", text: multi });
      i += multi.length;
    }
  }
  return tokens;
}

export function formatSql(
  sql: string,
  opts: { mode: Mode; indent: IndentOption; keywordCase: CaseOption },
): string {
  const tokens = tokenize(sql.trim()).filter((t, idx, arr) => !(t.type === "space" && (idx === 0 || idx === arr.length - 1)));
  const unit = opts.indent === "tab" ? "\t" : " ".repeat(Number(opts.indent));
  const applyCase = (w: string) =>
    KEYWORDS.has(w.toLowerCase())
      ? opts.keywordCase === "upper" ? w.toUpperCase() : opts.keywordCase === "lower" ? w.toLowerCase() : w
      : w;

  if (opts.mode === "minify") {
    let out = "";
    for (const t of tokens) {
      if (t.type === "comment") continue;
      if (t.type === "word") out += applyCase(t.text);
      else if (t.type === "space") out += " ";
      else out += t.text;
    }
    return out.replace(/ ?([,;=<>+\-*/]) ?/g, "$1").replace(/\( /g, "(").replace(/ \)/g, ")").replace(/\s+/g, " ").trim();
  }

  // Merge adjacent keyword words into phrases (GROUP BY, LEFT JOIN, ...).
  const words: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === "space") { words.push(t); continue; }
    words.push(t);
  }

  let out = "";
  let depth = 0; // parenthesis depth
  let lineStart = true;
  let inSelectList = false;
  const parenStack: boolean[] = []; // true if paren opened a subquery
  const pad = () => unit.repeat(Math.max(0, depth));
  const newline = (extra = 0) => {
    out = out.replace(/[ \t]+$/, "");
    out += "\n" + pad() + unit.repeat(extra);
    lineStart = true;
  };
  const emit = (s: string) => {
    out += s;
    lineStart = false;
  };

  const upperAt = (idx: number): string => {
    // collect up to 3 following word tokens (skipping spaces), uppercase
    const parts: string[] = [];
    let j = idx;
    while (j < words.length && parts.length < 3) {
      if (words[j].type === "word") parts.push(words[j].text.toUpperCase());
      else if (words[j].type !== "space") break;
      j++;
    }
    return parts.join(" ");
  };
  const consumeWords = (idx: number, count: number): number => {
    let seen = 0;
    let j = idx;
    while (j < words.length && seen < count) {
      if (words[j].type === "word") seen++;
      j++;
    }
    return j;
  };

  for (let i = 0; i < words.length; i++) {
    const t = words[i];
    if (t.type === "space") {
      if (!lineStart && !out.endsWith(" ") && !out.endsWith("(") && !out.endsWith("\n")) emit(" ");
      continue;
    }
    if (t.type === "comment") {
      if (!lineStart) emit(" ");
      emit(t.text);
      if (t.text.startsWith("--")) newline(inSelectList ? 1 : 0);
      continue;
    }
    if (t.type === "word") {
      const phrase = upperAt(i);
      const join = JOINS.find((j) => phrase === j || phrase.startsWith(j + " ") || phrase === j);
      const clause = CLAUSES.find((c) => phrase === c || phrase.startsWith(c + " "));
      const matched = join ?? clause;
      if (matched) {
        const count = matched.split(" ").length;
        const end = consumeWords(i, count);
        if (out.trim() !== "" && !lineStart && !out.endsWith("(")) newline();
        emit(applyCase(matched.toLowerCase()).split(" ").map((w) => applyCase(w)).join(" "));
        inSelectList = matched === "SELECT";
        if (inSelectList) { /* columns follow on same line after first, break on commas */ }
        i = end - 1;
        continue;
      }
      const up = t.text.toUpperCase();
      if ((up === "AND" || up === "OR") && depth >= 0) {
        newline(1);
        emit(applyCase(t.text));
        continue;
      }
      if (up === "ON" && !lineStart) {
        newline(1);
        emit(applyCase(t.text));
        continue;
      }
      emit(applyCase(t.text));
      continue;
    }
    if (t.type === "punct") {
      if (t.text === ",") {
        out = out.replace(/ +$/, "");
        emit(",");
        if (inSelectList && parenStack.length === 0) newline(1);
        else emit(" ");
        continue;
      }
      if (t.text === "(") {
        const nextWord = words.slice(i + 1).find((w) => w.type !== "space");
        const sub = nextWord?.type === "word" && nextWord.text.toUpperCase() === "SELECT";
        const prev = out.replace(/ +$/, "");
        const afterWord = /[A-Za-z0-9_`"]$/.test(prev) && !/\b(IN|AS|ON|AND|OR|FROM|JOIN|EXISTS)$/i.test(prev);
        out = afterWord ? prev : out;
        emit("(");
        parenStack.push(sub);
        if (sub) { depth++; newline(); }
        continue;
      }
      if (t.text === ")") {
        const sub = parenStack.pop();
        if (sub) { depth = Math.max(0, depth - 1); newline(); }
        else out = out.replace(/ +$/, "");
        emit(")");
        continue;
      }
      if (t.text === ";") {
        out = out.replace(/ +$/, "");
        emit(";");
        depth = 0;
        inSelectList = false;
        if (i < words.length - 1) { out += "\n\n"; lineStart = true; }
        continue;
      }
      if (t.text === ".") { emit("."); continue; }
      emit(t.text);
      continue;
    }
    emit(t.text);
  }
  return out.replace(/[ \t]+\n/g, "\n").trim();
}

export function SqlFormatterWidget() {
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<Mode>("beautify");
  const [indent, setIndent] = useState<IndentOption>("2");
  const [keywordCase, setKeywordCase] = useState<CaseOption>("upper");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return formatSql(input, { mode, indent, keywordCase });
  }, [input, mode, indent, keywordCase]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const select = "rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900";
  const btn = "rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">
          <span className="mr-2 text-zinc-600 dark:text-zinc-400">Mode</span>
          <select className={select} value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="beautify">Beautify</option>
            <option value="minify">Minify</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mr-2 text-zinc-600 dark:text-zinc-400">Indent</span>
          <select className={select} value={indent} onChange={(e) => setIndent(e.target.value as IndentOption)} disabled={mode === "minify"}>
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mr-2 text-zinc-600 dark:text-zinc-400">Keywords</span>
          <select className={select} value={keywordCase} onChange={(e) => setKeywordCase(e.target.value as CaseOption)}>
            <option value="upper">UPPERCASE</option>
            <option value="lower">lowercase</option>
            <option value="keep">Keep as typed</option>
          </select>
        </label>
        <button type="button" className={btn} onClick={() => setInput(SAMPLE)}>Sample</button>
        <button type="button" className={btn} onClick={() => setInput("")}>Clear</button>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="sql-input" className="mb-1 block text-sm font-medium">SQL input</label>
          <textarea
            id="sql-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="h-72 w-full rounded-md border border-zinc-300 bg-white p-3 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Paste your SQL query here"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="sql-output" className="text-sm font-medium">Formatted SQL</label>
            <button type="button" className={btn} onClick={copy} disabled={!output}>{copied ? "Copied" : "Copy"}</button>
          </div>
          <textarea
            id="sql-output"
            readOnly
            value={output}
            spellCheck={false}
            className="h-72 w-full rounded-md border border-zinc-300 bg-zinc-50 p-3 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">Formatting runs in your browser. Your SQL is never uploaded.</p>
    </div>
  );
}
