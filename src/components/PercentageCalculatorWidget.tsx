"use client";

import { useState } from "react";

function fmt(value: number, digits = 4) {
  if (!Number.isFinite(value)) return "—";
  const rounded = Number(value.toFixed(digits));
  return rounded.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function num(value: string) {
  if (value.trim() === "") return NaN;
  return Number(value.replace(/,/g, ""));
}

/** What is X% of Y? */
export function percentOf(pct: number, base: number) {
  return (pct / 100) * base;
}

/** X is what percent of Y? */
export function whatPercent(part: number, whole: number) {
  if (whole === 0) return NaN;
  return (part / whole) * 100;
}

/** Percentage change from A to B. */
export function percentChange(from: number, to: number) {
  if (from === 0) return NaN;
  return ((to - from) / Math.abs(from)) * 100;
}

/** Percentage difference between A and B (relative to their average). */
export function percentDifference(a: number, b: number) {
  const avg = (Math.abs(a) + Math.abs(b)) / 2;
  if (avg === 0) return NaN;
  return (Math.abs(a - b) / avg) * 100;
}

/** Increase or decrease a value by X%. */
export function applyPercent(value: number, pct: number, increase: boolean) {
  return value * (1 + (increase ? pct : -pct) / 100);
}

/** X is P% of what number? */
export function reversePercent(part: number, pct: number) {
  if (pct === 0) return NaN;
  return part / (pct / 100);
}

const inputClass =
  "w-28 rounded-lg border border-zinc-300 bg-zinc-50 p-2 text-base tabular-nums text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";
const cardClass =
  "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5";
const titleClass = "text-base font-semibold text-zinc-900 dark:text-zinc-50";
const rowClass = "mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300";

function Result({ label, value, formula }: { label: string; value: string; formula?: string }) {
  return (
    <div className="mt-3 rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-900" aria-live="polite">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">{value}</div>
      {formula && <div className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">{formula}</div>}
    </div>
  );
}

function NumInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  );
}

export function PercentageCalculatorWidget() {
  const [a1, setA1] = useState("20");
  const [b1, setB1] = useState("150");
  const [a2, setA2] = useState("30");
  const [b2, setB2] = useState("120");
  const [a3, setA3] = useState("80");
  const [b3, setB3] = useState("100");
  const [a4, setA4] = useState("50");
  const [b4, setB4] = useState("15");
  const [inc, setInc] = useState(true);
  const [a5, setA5] = useState("45");
  const [b5, setB5] = useState("60");
  const [a6, setA6] = useState("10");
  const [b6, setB6] = useState("15");

  const r1 = percentOf(num(a1), num(b1));
  const r2 = whatPercent(num(a2), num(b2));
  const r3 = percentChange(num(a3), num(b3));
  const r4 = applyPercent(num(a4), num(b4), inc);
  const r5 = reversePercent(num(a5), num(b5));
  const r6 = percentDifference(num(a6), num(b6));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className={titleClass}>What is X% of Y?</h2>
        <div className={rowClass}>
          What is <NumInput label="Percent" value={a1} onChange={setA1} /> % of
          <NumInput label="Number" value={b1} onChange={setB1} /> ?
        </div>
        <Result label="Result" value={fmt(r1)} formula={`${a1 || "X"} ÷ 100 × ${b1 || "Y"} = ${fmt(r1)}`} />
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>X is what percent of Y?</h2>
        <div className={rowClass}>
          <NumInput label="Part" value={a2} onChange={setA2} /> is what % of
          <NumInput label="Whole" value={b2} onChange={setB2} /> ?
        </div>
        <Result label="Percentage" value={Number.isFinite(r2) ? `${fmt(r2)}%` : "—"} formula={`${a2 || "X"} ÷ ${b2 || "Y"} × 100 = ${fmt(r2)}%`} />
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Percentage increase / decrease</h2>
        <div className={rowClass}>
          From <NumInput label="Original value" value={a3} onChange={setA3} /> to
          <NumInput label="New value" value={b3} onChange={setB3} />
        </div>
        <Result
          label={Number.isFinite(r3) ? (r3 >= 0 ? "Percentage increase" : "Percentage decrease") : "Percentage change"}
          value={Number.isFinite(r3) ? `${r3 >= 0 ? "+" : "−"}${fmt(Math.abs(r3))}%` : "—"}
          formula={`(${b3 || "B"} − ${a3 || "A"}) ÷ |${a3 || "A"}| × 100`}
        />
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Add or subtract a percentage</h2>
        <div className={rowClass}>
          <select
            aria-label="Increase or decrease"
            value={inc ? "inc" : "dec"}
            onChange={(e) => setInc(e.target.value === "inc")}
            className={inputClass + " w-32"}
          >
            <option value="inc">Increase</option>
            <option value="dec">Decrease</option>
          </select>
          <NumInput label="Value" value={a4} onChange={setA4} /> by
          <NumInput label="Percent" value={b4} onChange={setB4} /> %
        </div>
        <Result
          label="Result"
          value={fmt(r4)}
          formula={`${a4 || "X"} × (1 ${inc ? "+" : "−"} ${b4 || "P"} ÷ 100) = ${fmt(r4)}`}
        />
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>X is P% of what number?</h2>
        <div className={rowClass}>
          <NumInput label="Part" value={a5} onChange={setA5} /> is
          <NumInput label="Percent" value={b5} onChange={setB5} /> % of what?
        </div>
        <Result label="Original number" value={fmt(r5)} formula={`${a5 || "X"} ÷ (${b5 || "P"} ÷ 100) = ${fmt(r5)}`} />
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Percentage difference</h2>
        <div className={rowClass}>
          Between <NumInput label="First value" value={a6} onChange={setA6} /> and
          <NumInput label="Second value" value={b6} onChange={setB6} />
        </div>
        <Result
          label="Percentage difference"
          value={Number.isFinite(r6) ? `${fmt(r6)}%` : "—"}
          formula={`|A − B| ÷ ((|A| + |B|) ÷ 2) × 100`}
        />
      </div>
    </div>
  );
}
