"use client";

import { useMemo, useState } from "react";

export function epley(w: number, r: number) {
  return r === 1 ? w : w * (1 + r / 30);
}
export function brzycki(w: number, r: number) {
  return r === 1 ? w : (w * 36) / (37 - r);
}
export function lombardi(w: number, r: number) {
  return w * Math.pow(r, 0.1);
}
export function oconner(w: number, r: number) {
  return w * (1 + r / 40);
}
export function mayhew(w: number, r: number) {
  return (w * 100) / (52.2 + 41.9 * Math.exp(-0.055 * r));
}
export function wathan(w: number, r: number) {
  return (w * 100) / (48.8 + 53.8 * Math.exp(-0.075 * r));
}

function num(value: string) {
  if (value.trim() === "") return NaN;
  return Number(value.replace(/,/g, ""));
}

function fmt(value: number, digits = 1) {
  if (!Number.isFinite(value)) return "\u2014";
  const rounded = Number(value.toFixed(digits));
  return rounded.toLocaleString(undefined, { maximumFractionDigits: digits });
}

const inputClass =
  "w-32 rounded-lg border border-zinc-300 bg-zinc-50 p-2 text-base tabular-nums text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";
const cardClass =
  "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5";
const titleClass = "text-base font-semibold text-zinc-900 dark:text-zinc-50";
const labelClass = "flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300";

function Field({ label, value, onChange, suffix }: { label: string; value: string; onChange: (v: string) => void; suffix?: string }) {
  return (
    <label className={labelClass}>
      <span>
        {label}
        {suffix ? ` (${suffix})` : ""}
      </span>
      <input type="text" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    </label>
  );
}

function Stat({ label, value, formula }: { label: string; value: string; formula?: string }) {
  return (
    <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-900" aria-live="polite">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">{value}</div>
      {formula ? <div className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">{formula}</div> : null}
    </div>
  );
}

const PERCENTS = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

export function OneRepMaxWidget() {
  const [weight, setWeight] = useState("200");
  const [reps, setReps] = useState("5");
  const [unit, setUnit] = useState("lb");

  const w = num(weight);
  const r = num(reps);
  const valid = Number.isFinite(w) && w > 0 && Number.isInteger(r) && r >= 1 && r <= 30;

  const methods = useMemo(
    () => [
      { name: "Epley", formula: "1RM = w × (1 + r ÷ 30)", fn: epley },
      { name: "Brzycki", formula: "1RM = w × 36 ÷ (37 − r)", fn: brzycki },
      { name: "Lombardi", formula: "1RM = w × r^0.10", fn: lombardi },
      { name: "O'Conner", formula: "1RM = w × (1 + r ÷ 40)", fn: oconner },
      { name: "Mayhew", formula: "1RM = 100w ÷ (52.2 + 41.9e^(−0.055r))", fn: mayhew },
      { name: "Wathan", formula: "1RM = 100w ÷ (48.8 + 53.8e^(−0.075r))", fn: wathan },
    ],
    [],
  );

  const results = methods.map((m) => ({ ...m, value: valid ? m.fn(w, r) : NaN }));
  const avg = valid ? results.reduce((s, m) => s + m.value, 0) / results.length : NaN;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className={titleClass}>Your lift</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Enter the weight lifted and the reps you completed (1 to 30).</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Field label="Weight lifted" value={weight} onChange={setWeight} suffix={unit} />
          <Field label="Reps" value={reps} onChange={setReps} />
          <label className={labelClass}>
            <span>Unit</span>
            <select value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClass}>
              <option value="lb">lb</option>
              <option value="kg">kg</option>
            </select>
          </label>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat label="Estimated 1RM (average of 6 formulas)" value={valid ? `${fmt(avg, 1)} ${unit}` : "\u2014"} />
          <Stat label="Epley estimate" value={valid ? `${fmt(epley(w, r), 1)} ${unit}` : "\u2014"} formula="1RM = w × (1 + r ÷ 30)" />
        </div>
        {!valid ? <p className="mt-3 text-sm text-amber-600">Enter a positive weight and a whole number of reps from 1 to 30.</p> : null}
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Formula comparison</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[260px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-3 font-medium">Formula</th>
                <th className="py-2 font-medium">1RM</th>
              </tr>
            </thead>
            <tbody>
              {results.map((m) => (
                <tr key={m.name} className="border-b border-zinc-100 tabular-nums text-zinc-800 dark:border-zinc-900 dark:text-zinc-200">
                  <td className="py-2 pr-3">
                    {m.name}
                    <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{m.formula}</div>
                  </td>
                  <td className="py-2">{valid ? `${fmt(m.value, 1)} ${unit}` : "\u2014"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`${cardClass} md:col-span-2`}>
        <h2 className={titleClass}>Training percentages of your 1RM</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Based on the average estimate above.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[240px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-3 font-medium">% of 1RM</th>
                <th className="py-2 font-medium">Weight</th>
              </tr>
            </thead>
            <tbody>
              {PERCENTS.map((p) => (
                <tr key={p} className="border-b border-zinc-100 tabular-nums text-zinc-800 dark:border-zinc-900 dark:text-zinc-200">
                  <td className="py-2 pr-3">{p}%</td>
                  <td className="py-2">{valid ? `${fmt((avg * p) / 100, 1)} ${unit}` : "\u2014"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
