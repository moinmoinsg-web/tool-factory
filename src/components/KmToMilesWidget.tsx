"use client";

import { useMemo, useState } from "react";

/** International mile: 1 mi = 1.609344 km exactly. */
export const KM_PER_MILE = 1.609344;

export function kmToMiles(km: number) {
  return km / KM_PER_MILE;
}

export function milesToKm(mi: number) {
  return mi * KM_PER_MILE;
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

const QUICK = [1, 5, 10, 21.0975, 42.195, 50, 100, 500];

export function KmToMilesWidget() {
  const [km, setKm] = useState("10");
  const [mi, setMi] = useState("26.2");

  const milesFromKm = kmToMiles(num(km));
  const kmFromMiles = milesToKm(num(mi));

  const quickRows = useMemo(() => QUICK.map((k) => ({ km: k, mi: kmToMiles(k) })), []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className={titleClass}>Kilometers to miles</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Convert km to miles using the exact factor 1 mile = 1.609344 km.
        </p>
        <div className="mt-4">
          <Field label="Kilometers" value={km} onChange={setKm} suffix="km" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat label="Miles" value={`${fmt(milesFromKm)} mi`} formula="mi = km ÷ 1.609344" />
          <Stat label="Feet" value={`${fmt(milesFromKm * 5280, 1)} ft`} formula="ft = mi × 5280" />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Miles to kilometers</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Convert miles back to km by multiplying by 1.609344.</p>
        <div className="mt-4">
          <Field label="Miles" value={mi} onChange={setMi} suffix="mi" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat label="Kilometers" value={`${fmt(kmFromMiles)} km`} formula="km = mi × 1.609344" />
          <Stat label="Meters" value={`${fmt(kmFromMiles * 1000, 1)} m`} formula="m = km × 1000" />
        </div>
      </div>

      <div className={`${cardClass} md:col-span-2`}>
        <h2 className={titleClass}>Quick reference</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Common distances in kilometers and their mile equivalents.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[240px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-3 font-medium">Kilometers</th>
                <th className="py-2 font-medium">Miles</th>
              </tr>
            </thead>
            <tbody>
              {quickRows.map((row) => (
                <tr key={row.km} className="border-b border-zinc-100 tabular-nums text-zinc-800 dark:border-zinc-900 dark:text-zinc-200">
                  <td className="py-2 pr-3">{row.km} km</td>
                  <td className="py-2">{fmt(row.mi, 4)} mi</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
