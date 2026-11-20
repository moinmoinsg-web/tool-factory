"use client";

import { useMemo, useState } from "react";

type Row = { type: "same" | "add" | "del"; text: string; a?: number; b?: number };

function norm(s: string, ignoreCase: boolean, ignoreWs: boolean) {
  let t = s;
  if (ignoreWs) t = t.replace(/\s+/g, " ").trim();
  if (ignoreCase) t = t.toLowerCase();
  return t;
}

export function diffLines(a: string, b: string, ignoreCase: boolean, ignoreWs: boolean): Row[] {
  const A = a === "" ? [] : a.split(/\r?\n/);
  const B = b === "" ? [] : b.split(/\r?\n/);
  const nA = A.map((x) => norm(x, ignoreCase, ignoreWs));
  const nB = B.map((x) => norm(x, ignoreCase, ignoreWs));
  const n = A.length;
  const m = B.length;
  const dp: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = nA[i] === nB[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const rows: Row[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (nA[i] === nB[j]) {
      rows.push({ type: "same", text: B[j], a: i + 1, b: j + 1 });
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: "del", text: A[i], a: i + 1 });
      i++;
    } else {
      rows.push({ type: "add", text: B[j], b: j + 1 });
      j++;
    }
  }
  while (i < n) { rows.push({ type: "del", text: A[i], a: i + 1 }); i++; }
  while (j < m) { rows.push({ type: "add", text: B[j], b: j + 1 }); j++; }
  return rows;
}

const SAMPLE_A = `name: Tool Factory
version: 1.0
features:
  - word counter
  - json formatter
license: MIT`;
const SAMPLE_B = `name: Tool Factory
version: 1.1
features:
  - word counter
  - json formatter
  - diff checker
license: MIT`;

const areaClass =
  "h-56 w-full rounded-lg border border-zinc-300 bg-zinc-50 p-3 font-mono text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export function DiffCheckerWidget() {
  const [left, setLeft] = useState(SAMPLE_A);
  const [right, setRight] = useState(SAMPLE_B);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWs, setIgnoreWs] = useState(false);

  const rows = useMemo(() => {
    if ((left.split("\n").length + right.split("\n").length) > 6000) return null;
    return diffLines(left, right, ignoreCase, ignoreWs);
  }, [left, right, ignoreCase, ignoreWs]);

  const added = rows ? rows.filter((r) => r.type === "add").length : 0;
  const removed = rows ? rows.filter((r) => r.type === "del").length : 0;
  const identical = rows ? added === 0 && removed === 0 : false;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Original text
          <textarea className={areaClass} value={left} onChange={(e) => setLeft(e.target.value)} spellCheck={false} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Changed text
          <textarea className={areaClass} value={right} onChange={(e) => setRight(e.target.value)} spellCheck={false} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-700 dark:text-zinc-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} /> Ignore case
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={ignoreWs} onChange={(e) => setIgnoreWs(e.target.checked)} /> Ignore whitespace
        </label>
        <button
          type="button"
          className="rounded-lg border border-zinc-300 px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          onClick={() => { const l = left; setLeft(right); setRight(l); }}
        >
          Swap sides
        </button>
        <button
          type="button"
          className="rounded-lg border border-zinc-300 px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          onClick={() => { setLeft(""); setRight(""); }}
        >
          Clear
        </button>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {rows === null ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Inputs are too large to compare in the browser. Try fewer than 3,000 lines per side.</p>
        ) : (
          <>
            <p className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50" aria-live="polite">
              {identical ? "The texts are identical." : `${added} line${added === 1 ? "" : "s"} added, ${removed} line${removed === 1 ? "" : "s"} removed`}
            </p>
            <div className="max-h-96 overflow-auto rounded-lg border border-zinc-200 font-mono text-sm dark:border-zinc-800">
              {rows.length === 0 ? (
                <p className="p-3 text-zinc-500">Paste text on both sides to see differences.</p>
              ) : (
                rows.map((r, k) => (
                  <div
                    key={k}
                    className={
                      r.type === "add"
                        ? "flex bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200"
                        : r.type === "del"
                          ? "flex bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200"
                          : "flex text-zinc-800 dark:text-zinc-200"
                    }
                  >
                    <span className="w-10 shrink-0 select-none px-1 text-right text-xs text-zinc-500">{r.a ?? ""}</span>
                    <span className="w-10 shrink-0 select-none px-1 text-right text-xs text-zinc-500">{r.b ?? ""}</span>
                    <span className="w-5 shrink-0 select-none text-center">{r.type === "add" ? "+" : r.type === "del" ? "-" : ""}</span>
                    <span className="whitespace-pre-wrap break-all pr-2">{r.text === "" ? "\u00a0" : r.text}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
