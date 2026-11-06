"use client";

import { useMemo, useState } from "react";

/** International inch definition: 1 in = 2.54 cm exactly. */
export const CM_PER_INCH = 2.54;

export function cmToInches(cm: number) {
  return cm / CM_PER_INCH;
}

export function inchesToCm(inches: number) {
  return inches * CM_PER_INCH;
}

/** Split decimal inches into whole inches + fractional inches (for display). */
export function inchesParts(inches: number) {
  if (!Number.isFinite(inches)) return { whole: NaN, fraction: NaN };
  const sign = inches < 0 ? -1 : 1;
  const abs = Math.abs(inches);
  const whole = Math.floor(abs);
  const fraction = abs - whole;
  return { whole: whole * sign, fraction: fraction * sign };
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

const QUICK = [
  { cm: 1, label: "1 cm" },
  { cm: 2.54, label: "2.54 cm" },
  { cm: 5, label: "5 cm" },
  { cm: 10, label: "10 cm" },
  { cm: 15, label: "15 cm" },
  { cm: 30, label: "30 cm" },
  { cm: 50, label: "50 cm" },
  { cm: 100, label: "100 cm (1 m)" },
];

export function CmToInchesWidget() {
  const [cm, setCm] = useState("30");
  const [inches, setInches] = useState("12");
  const [feet, setFeet] = useState("5");
  const [extraIn, setExtraIn] = useState("10");

  const cmVal = num(cm);
  const inFromCm = cmToInches(cmVal);
  const parts = inchesParts(inFromCm);

  const inVal = num(inches);
  const cmFromIn = inchesToCm(inVal);

  const ftVal = num(feet);
  const extraVal = num(extraIn);
  const totalInches = ftVal * 12 + extraVal;
  const cmFromFtIn = inchesToCm(totalInches);

  const quickRows = useMemo(
    () =>
      QUICK.map((row) => ({
        ...row,
        inches: cmToInches(row.cm),
      })),
    [],
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className={titleClass}>Centimeters to inches</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Convert any length in cm to inches using the exact factor 1 in = 2.54 cm.
        </p>
        <div className="mt-4">
          <Field label="Centimeters" value={cm} onChange={setCm} suffix="cm" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat
            label="Inches"
            value={`${fmt(inFromCm)} in`}
            formula="inches = cm ÷ 2.54"
          />
          <Stat
            label="Feet + inches"
            value={
              Number.isFinite(inFromCm)
                ? `${Math.floor(Math.abs(inFromCm) / 12) * (inFromCm < 0 ? -1 : 1)} ft ${fmt(
                    Math.abs(inFromCm) % 12,
                    2,
                  )} in`
                : "—"
            }
            formula="ft = floor(in ÷ 12); rem = in mod 12"
          />
        </div>
        <p className="mt-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          Whole inches: {Number.isFinite(parts.whole) ? parts.whole : "—"}; fractional:{" "}
          {fmt(Math.abs(parts.fraction), 4)}
        </p>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Inches to centimeters</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Convert inches back to centimeters. Multiply by 2.54 for an exact result.
        </p>
        <div className="mt-4">
          <Field label="Inches" value={inches} onChange={setInches} suffix="in" />
        </div>
        <div className="mt-3">
          <Stat
            label="Centimeters"
            value={`${fmt(cmFromIn)} cm`}
            formula="cm = inches × 2.54"
          />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat label="Millimeters" value={`${fmt(cmFromIn * 10)} mm`} formula="mm = cm × 10" />
          <Stat label="Meters" value={`${fmt(cmFromIn / 100, 6)} m`} formula="m = cm ÷ 100" />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Feet and inches to centimeters</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Enter height or length as feet plus leftover inches, then get the metric total.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Field label="Feet" value={feet} onChange={setFeet} suffix="ft" />
          <Field label="Inches" value={extraIn} onChange={setExtraIn} suffix="in" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Stat
            label="Total inches"
            value={`${fmt(totalInches)} in`}
            formula="total in = ft × 12 + in"
          />
          <Stat
            label="Centimeters"
            value={`${fmt(cmFromFtIn)} cm`}
            formula="cm = (ft × 12 + in) × 2.54"
          />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Quick reference</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Common centimeter values and their inch equivalents.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[240px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-3 font-medium">Centimeters</th>
                <th className="py-2 font-medium">Inches</th>
              </tr>
            </thead>
            <tbody>
              {quickRows.map((row) => (
                <tr
                  key={row.cm}
                  className="border-b border-zinc-100 tabular-nums text-zinc-800 dark:border-zinc-900 dark:text-zinc-200"
                >
                  <td className="py-2 pr-3">{row.label}</td>
                  <td className="py-2">{fmt(row.inches, 4)} in</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
