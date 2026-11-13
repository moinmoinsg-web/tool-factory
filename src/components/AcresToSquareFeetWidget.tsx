"use client";

import { useMemo, useState } from "react";

export const SQFT_PER_ACRE = 43560;
const SQM_PER_SQFT = 0.09290304;

export function acresToSqft(acres: number) {
  return acres * SQFT_PER_ACRE;
}

export function sqftToAcres(sqft: number) {
  return sqft / SQFT_PER_ACRE;
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

function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <label className={labelClass}>
      <span>
        {label}
        {suffix ? ` (${suffix})` : ""}
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

function Stat({ label, value, formula }: { label: string; value: string; formula?: string }) {
  return (
    <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-900" aria-live="polite">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">{value}</div>
      {formula ? (
        <div className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">{formula}</div>
      ) : null}
    </div>
  );
}


const QUICK = [0.1, 0.25, 0.5, 1, 2, 5, 10, 40, 100, 640];

export function AcresToSquareFeetWidget() {
  const [acres, setAcres] = useState("1");
  const [sqft, setSqft] = useState("10000");

  const acresVal = num(acres);
  const sqftFromAcres = acresToSqft(acresVal);
  const sqftVal = num(sqft);
  const acresFromSqft = sqftToAcres(sqftVal);

  const rows = useMemo(() => QUICK.map((a) => ({ a, sqft: acresToSqft(a) })), []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className={titleClass}>Acres to square feet</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Multiply acres by 43,560 to get square feet.
        </p>
        <div className="mt-4">
          <Field label="Acres" value={acres} onChange={setAcres} suffix="ac" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat label="Square feet" value={`${fmt(sqftFromAcres, 2)} sq ft`} formula="sq ft = acres \u00d7 43,560" />
          <Stat label="Square yards" value={`${fmt(sqftFromAcres / 9, 2)} sq yd`} formula="sq yd = sq ft \u00f7 9" />
          <Stat label="Square meters" value={`${fmt(sqftFromAcres * SQM_PER_SQFT, 2)} m\u00b2`} formula="m\u00b2 = sq ft \u00d7 0.09290304" />
          <Stat label="Hectares" value={`${fmt(sqftFromAcres * SQM_PER_SQFT / 10000, 4)} ha`} formula="ha = m\u00b2 \u00f7 10,000" />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Square feet to acres</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Divide square feet by 43,560 to get acres.
        </p>
        <div className="mt-4">
          <Field label="Square feet" value={sqft} onChange={setSqft} suffix="sq ft" />
        </div>
        <div className="mt-3">
          <Stat label="Acres" value={`${fmt(acresFromSqft, 6)} ac`} formula="acres = sq ft \u00f7 43,560" />
        </div>
      </div>

      <div className={`${cardClass} md:col-span-2`}>
        <h2 className={titleClass}>Quick reference</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Common acreages in square feet.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[240px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-3 font-medium">Acres</th>
                <th className="py-2 font-medium">Square feet</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.a} className="border-b border-zinc-100 tabular-nums text-zinc-800 dark:border-zinc-900 dark:text-zinc-200">
                  <td className="py-2 pr-3">{row.a}</td>
                  <td className="py-2">{fmt(row.sqft, 2)} sq ft</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
