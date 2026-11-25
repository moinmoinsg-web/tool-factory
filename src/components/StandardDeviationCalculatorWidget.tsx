"use client";

import { useMemo, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white p-2 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

function f(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return Number(n.toPrecision(12)).toLocaleString("en-US", { maximumFractionDigits: 10 });
}

export function StandardDeviationCalculatorWidget() {
  const [text, setText] = useState("4, 8, 15, 16, 23, 42");
  const [mode, setMode] = useState<"sample" | "population">("sample");

  const res = useMemo(() => {
    const tokens = text.split(/[\s,;]+/).filter(Boolean);
    const nums = tokens.map(Number);
    const bad = tokens.filter((_, i) => !Number.isFinite(nums[i]));
    if (tokens.length === 0) return { error: "Enter some numbers separated by commas, spaces or new lines." };
    if (bad.length) return { error: `Not a number: ${bad.slice(0, 5).join(", ")}` };
    const n = nums.length;
    if (mode === "sample" && n < 2) return { error: "Sample standard deviation needs at least 2 values." };
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const ss = nums.reduce((a, b) => a + (b - mean) ** 2, 0);
    const div = mode === "sample" ? n - 1 : n;
    const variance = ss / div;
    const sd = Math.sqrt(variance);
    return {
      nums, n, sum, mean, ss, div, variance, sd,
      min: Math.min(...nums), max: Math.max(...nums),
    };
  }, [text, mode]);

  const btn = (m: "sample" | "population", label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={`rounded-lg border px-3 py-1.5 text-sm ${
        mode === m
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
          : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Numbers (separated by commas, spaces or new lines)
        <textarea className={inputClass} rows={5} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <div className="flex gap-2">
        {btn("sample", "Sample (n − 1)")}
        {btn("population", "Population (N)")}
      </div>
      {"error" in res ? (
        <p className="text-sm text-red-600">{res.error}</p>
      ) : (
        <>
          <dl className="grid gap-px overflow-hidden rounded-lg border border-zinc-300 bg-zinc-300 text-sm dark:border-zinc-700 dark:bg-zinc-700 sm:grid-cols-2">
            {[
              [mode === "sample" ? "Sample standard deviation (s)" : "Population standard deviation (σ)", f(res.sd)],
              [mode === "sample" ? "Sample variance (s²)" : "Population variance (σ²)", f(res.variance)],
              ["Mean", f(res.mean)],
              ["Count", String(res.n)],
              ["Sum", f(res.sum)],
              ["Minimum", f(res.min)],
              ["Maximum", f(res.max)],
              ["Range", f(res.max - res.min)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 bg-white p-2 dark:bg-zinc-950">
                <dt className="text-zinc-600 dark:text-zinc-400">{k}</dt>
                <dd className="break-all text-right font-mono text-zinc-900 dark:text-zinc-100">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="rounded-lg border border-zinc-300 p-3 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            <p className="mb-2 font-medium">Steps</p>
            <ol className="list-decimal space-y-1 pl-5 font-mono text-xs">
              <li>Mean = {f(res.sum)} / {res.n} = {f(res.mean)}</li>
              <li>
                Squared differences (x − mean)²:{" "}
                {res.nums.slice(0, 20).map((x) => f((x - res.mean) ** 2)).join(", ")}
                {res.nums.length > 20 ? ", …" : ""}
              </li>
              <li>Sum of squares = {f(res.ss)}</li>
              <li>Variance = {f(res.ss)} / {res.div} = {f(res.variance)}</li>
              <li>Standard deviation = √{f(res.variance)} = {f(res.sd)}</li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
