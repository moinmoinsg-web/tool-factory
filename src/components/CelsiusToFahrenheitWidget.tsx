"use client";

import { useMemo, useState } from "react";

export function cToF(c: number) {
  return (c * 9) / 5 + 32;
}

export function fToC(f: number) {
  return ((f - 32) * 5) / 9;
}

function num(value: string) {
  if (value.trim() === "") return NaN;
  return Number(value.replace(/,/g, ""));
}

function fmt(value: number, digits = 4) {
  if (!Number.isFinite(value)) return "—";
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

const QUICK = [-40, -18, 0, 10, 20, 25, 30, 37, 100];

export function CelsiusToFahrenheitWidget() {
  const [c, setC] = useState("25");
  const [f, setF] = useState("77");

  const fFromC = cToF(num(c));
  const cFromF = fToC(num(f));

  const quickRows = useMemo(() => QUICK.map((k) => ({ c: k, f: cToF(k) })), []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className={titleClass}>Celsius to Fahrenheit</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Convert °C to °F with the formula °F = °C × 9/5 + 32.
        </p>
        <div className="mt-4">
          <Field label="Celsius" value={c} onChange={setC} suffix="°C" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat label="Fahrenheit" value={`${fmt(fFromC, 2)} °F`} formula="°F = °C × 9/5 + 32" />
          <Stat label="Kelvin" value={`${fmt(num(c) + 273.15, 2)} K`} formula="K = °C + 273.15" />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Fahrenheit to Celsius</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Convert °F back to °C with °C = (°F − 32) × 5/9.</p>
        <div className="mt-4">
          <Field label="Fahrenheit" value={f} onChange={setF} suffix="°F" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat label="Celsius" value={`${fmt(cFromF, 2)} °C`} formula="°C = (°F − 32) × 5/9" />
          <Stat label="Kelvin" value={`${fmt(cFromF + 273.15, 2)} K`} formula="K = °C + 273.15" />
        </div>
      </div>

      <div className={`${cardClass} md:col-span-2`}>
        <h2 className={titleClass}>Quick reference</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Common temperatures in Celsius and their Fahrenheit equivalents.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[240px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-3 font-medium">Celsius</th>
                <th className="py-2 font-medium">Fahrenheit</th>
              </tr>
            </thead>
            <tbody>
              {quickRows.map((row) => (
                <tr key={row.c} className="border-b border-zinc-100 tabular-nums text-zinc-800 dark:border-zinc-900 dark:text-zinc-200">
                  <td className="py-2 pr-3">{row.c} °C</td>
                  <td className="py-2">{fmt(row.f, 1)} °F</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
