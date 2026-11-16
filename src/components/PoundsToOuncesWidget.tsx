"use client";

import { useMemo, useState } from "react";

export const OZ_PER_LB = 16;
const G_PER_OZ = 28.349523125;

export function poundsToOunces(lb: number) {
  return lb * OZ_PER_LB;
}

export function ouncesToPounds(oz: number) {
  return oz / OZ_PER_LB;
}

function num(value: string) {
  if (value.trim() === "") return NaN;
  return Number(value.replace(/,/g, ""));
}

function fmt(value: number, digits = 4) {
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

const QUICK = [0.25, 0.5, 1, 1.5, 2, 5, 10, 25, 50, 100];

export function PoundsToOuncesWidget() {
  const [lb, setLb] = useState("1");
  const [oz, setOz] = useState("40");

  const lbVal = num(lb);
  const ozFromLb = poundsToOunces(lbVal);
  const ozVal = num(oz);
  const lbFromOz = ouncesToPounds(ozVal);
  const wholeLb = Math.floor(lbFromOz);
  const remOz = ozVal - wholeLb * OZ_PER_LB;

  const rows = useMemo(() => QUICK.map((p) => ({ p, oz: poundsToOunces(p) })), []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className={titleClass}>Pounds to ounces</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Multiply pounds by 16 to get ounces.</p>
        <div className="mt-4">
          <Field label="Pounds" value={lb} onChange={setLb} suffix="lb" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat label="Ounces" value={`${fmt(ozFromLb, 4)} oz`} formula="oz = lb × 16" />
          <Stat label="Grams" value={`${fmt(ozFromLb * G_PER_OZ, 2)} g`} formula="g = oz × 28.3495" />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Ounces to pounds</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Divide ounces by 16 to get pounds.</p>
        <div className="mt-4">
          <Field label="Ounces" value={oz} onChange={setOz} suffix="oz" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat label="Pounds" value={`${fmt(lbFromOz, 4)} lb`} formula="lb = oz ÷ 16" />
          <Stat
            label="Pounds and ounces"
            value={Number.isFinite(remOz) && ozVal >= 0 ? `${wholeLb} lb ${fmt(remOz, 2)} oz` : "\u2014"}
          />
        </div>
      </div>

      <div className={`${cardClass} md:col-span-2`}>
        <h2 className={titleClass}>Quick reference</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Common weights in ounces.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[240px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-3 font-medium">Pounds</th>
                <th className="py-2 font-medium">Ounces</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.p} className="border-b border-zinc-100 tabular-nums text-zinc-800 dark:border-zinc-900 dark:text-zinc-200">
                  <td className="py-2 pr-3">{row.p}</td>
                  <td className="py-2">{fmt(row.oz, 2)} oz</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
