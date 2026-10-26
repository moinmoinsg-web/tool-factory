"use client";

import { useMemo, useState } from "react";

const FREQUENCIES = [
  { label: "Monthly", value: 12 },
  { label: "Quarterly", value: 4 },
  { label: "Half-yearly", value: 2 },
  { label: "Yearly", value: 1 },
] as const;

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Fixed deposit maturity: A = P × (1 + r/n)^(n × t). */
export function calculateFd(
  principal: number,
  annualRatePct: number,
  years: number,
  compoundsPerYear: number,
) {
  if (principal <= 0 || years <= 0 || annualRatePct < 0 || compoundsPerYear <= 0) {
    return { maturity: NaN, interest: NaN, effectiveRate: NaN };
  }
  const r = annualRatePct / 100;
  const maturity = principal * Math.pow(1 + r / compoundsPerYear, compoundsPerYear * years);
  const effectiveRate = (Math.pow(1 + r / compoundsPerYear, compoundsPerYear) - 1) * 100;
  return { maturity, interest: maturity - principal, effectiveRate };
}

export function FdCalculatorWidget() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("3");
  const [months, setMonths] = useState("0");
  const [frequency, setFrequency] = useState<number>(4);

  const result = useMemo(() => {
    const totalYears = (Number(years) || 0) + (Number(months) || 0) / 12;
    return calculateFd(Number(principal), Number(rate), totalYears, frequency);
  }, [principal, rate, years, months, frequency]);

  const inputClass =
    "mt-1 w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";
  const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Deposit amount
          <input type="number" min="0" inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={inputClass} />
        </label>
        <label className={labelClass}>
          Annual interest rate (%)
          <input type="number" min="0" step="0.01" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={labelClass}>
            Years
            <input type="number" min="0" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>
            Months
            <input type="number" min="0" max="11" value={months} onChange={(e) => setMonths(e.target.value)} className={inputClass} />
          </label>
        </div>
        <label className={labelClass}>
          Compounding
          <select value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className={inputClass}>
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </label>
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(
          [
            ["Maturity amount", formatMoney(result.maturity)],
            ["Interest earned", formatMoney(result.interest)],
            ["Effective annual yield", Number.isFinite(result.effectiveRate) ? `${result.effectiveRate.toFixed(2)}%` : "—"],
          ] as const
        ).map(([label, value]) => (
          <li key={label} className="rounded-lg bg-zinc-100 px-3 py-3 text-center dark:bg-zinc-900">
            <div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">{value}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
