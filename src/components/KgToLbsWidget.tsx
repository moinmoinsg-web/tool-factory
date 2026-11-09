"use client";

import { useMemo, useState } from "react";

/** International avoirdupois pound: 1 lb = 0.45359237 kg exactly. */
export const KG_PER_LB = 0.45359237;

export function kgToLbs(kg: number) {
  return kg / KG_PER_LB;
}

export function lbsToKg(lbs: number) {
  return lbs * KG_PER_LB;
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

const QUICK = [1, 2, 5, 10, 20, 50, 70, 100];

export function KgToLbsWidget() {
  const [kg, setKg] = useState("70");
  const [lbs, setLbs] = useState("150");

  const lbsFromKg = kgToLbs(num(kg));
  const kgFromLbs = lbsToKg(num(lbs));
  const oz = lbsFromKg * 16;
  const stoneTotal = kgFromLbs / 6.35029318;

  const quickRows = useMemo(() => QUICK.map((k) => ({ kg: k, lbs: kgToLbs(k) })), []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className={titleClass}>Kilograms to pounds</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Convert kg to lbs using the exact factor 1 lb = 0.45359237 kg.
        </p>
        <div className="mt-4">
          <Field label="Kilograms" value={kg} onChange={setKg} suffix="kg" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat label="Pounds" value={`${fmt(lbsFromKg)} lb`} formula="lbs = kg ÷ 0.45359237" />
          <Stat
            label="Pounds + ounces"
            value={
              Number.isFinite(lbsFromKg)
                ? `${Math.floor(lbsFromKg)} lb ${fmt(oz - Math.floor(lbsFromKg) * 16, 2)} oz`
                : "—"
            }
            formula="oz = (lbs − whole lbs) × 16"
          />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Pounds to kilograms</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Convert lbs back to kg by multiplying by 0.45359237.</p>
        <div className="mt-4">
          <Field label="Pounds" value={lbs} onChange={setLbs} suffix="lb" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat label="Kilograms" value={`${fmt(kgFromLbs)} kg`} formula="kg = lbs × 0.45359237" />
          <Stat label="Grams" value={`${fmt(kgFromLbs * 1000, 1)} g`} formula="g = kg × 1000" />
          <Stat label="Stone" value={`${fmt(stoneTotal, 3)} st`} formula="st = kg ÷ 6.35029318" />
        </div>
      </div>

      <div className={`${cardClass} md:col-span-2`}>
        <h2 className={titleClass}>Quick reference</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Common kilogram values and their pound equivalents.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[240px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-3 font-medium">Kilograms</th>
                <th className="py-2 font-medium">Pounds</th>
              </tr>
            </thead>
            <tbody>
              {quickRows.map((row) => (
                <tr key={row.kg} className="border-b border-zinc-100 tabular-nums text-zinc-800 dark:border-zinc-900 dark:text-zinc-200">
                  <td className="py-2 pr-3">{row.kg} kg</td>
                  <td className="py-2">{fmt(row.lbs, 4)} lb</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
