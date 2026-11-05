"use client";

import { useMemo, useState } from "react";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Parse YYYY-MM-DD as a local calendar date (noon to avoid DST edge cases). */
export function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 12, 0, 0, 0);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

export function formatDate(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatLong(dt: Date): string {
  return dt.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Inclusive calendar-day difference: same day = 0. */
export function daysBetween(start: Date, end: Date): number {
  const a = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const b = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((b - a) / MS_PER_DAY);
}

/** Weekdays between two dates, excluding weekends. Direction-aware. */
export function businessDaysBetween(start: Date, end: Date): number {
  const sign = daysBetween(start, end) >= 0 ? 1 : -1;
  const from = sign >= 0 ? start : end;
  const to = sign >= 0 ? end : start;
  let count = 0;
  const cur = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 12);
  const last = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 12);
  while (cur < last) {
    cur.setDate(cur.getDate() + 1);
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) count += 1;
  }
  return count * sign;
}

export function addDuration(
  base: Date,
  amount: number,
  unit: "days" | "weeks" | "months" | "years",
): Date {
  const dt = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 12);
  if (unit === "days") dt.setDate(dt.getDate() + amount);
  else if (unit === "weeks") dt.setDate(dt.getDate() + amount * 7);
  else if (unit === "months") {
    const day = dt.getDate();
    dt.setDate(1);
    dt.setMonth(dt.getMonth() + amount);
    const dim = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();
    dt.setDate(Math.min(day, dim));
  } else {
    const day = dt.getDate();
    dt.setFullYear(dt.getFullYear() + amount);
    const dim = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();
    dt.setDate(Math.min(day, dim));
  }
  return dt;
}

/** Full years / months / days from birthdate to as-of date (non-negative when asOf >= birth). */
export function ageParts(birth: Date, asOf: Date) {
  let years = asOf.getFullYear() - birth.getFullYear();
  let months = asOf.getMonth() - birth.getMonth();
  let days = asOf.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    const prev = new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
    days += prev;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days, totalDays: daysBetween(birth, asOf) };
}

function todayIso() {
  return formatDate(new Date());
}

const inputClass =
  "rounded-lg border border-zinc-300 bg-zinc-50 p-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";
const cardClass =
  "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5";
const titleClass = "text-base font-semibold text-zinc-900 dark:text-zinc-50";
const labelClass = "flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-900">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">{value}</div>
    </div>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">{children}</p>;
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className={labelClass}>
      <span>{label}</span>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass + " w-44"} />
    </label>
  );
}

export function DateCalculatorWidget() {
  const [start, setStart] = useState("2026-01-01");
  const [end, setEnd] = useState(todayIso());

  const [base, setBase] = useState(todayIso());
  const [amount, setAmount] = useState("30");
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">("days");
  const [direction, setDirection] = useState<"add" | "sub">("add");

  const [lookup, setLookup] = useState(todayIso());

  const [birth, setBirth] = useState("2000-01-15");
  const [asOf, setAsOf] = useState(todayIso());

  const startDt = useMemo(() => parseDate(start), [start]);
  const endDt = useMemo(() => parseDate(end), [end]);
  const baseDt = useMemo(() => parseDate(base), [base]);
  const lookupDt = useMemo(() => parseDate(lookup), [lookup]);
  const birthDt = useMemo(() => parseDate(birth), [birth]);
  const asOfDt = useMemo(() => parseDate(asOf), [asOf]);

  const diffDays = startDt && endDt ? daysBetween(startDt, endDt) : NaN;
  const bizDays = startDt && endDt ? businessDaysBetween(startDt, endDt) : NaN;
  const weeks = Number.isFinite(diffDays) ? diffDays / 7 : NaN;

  const amt = Number(amount.replace(/[,\s]/g, ""));
  const signed = direction === "add" ? amt : -amt;
  const resultDt =
    baseDt && Number.isFinite(signed) ? addDuration(baseDt, signed, unit) : null;

  const age =
    birthDt && asOfDt && daysBetween(birthDt, asOfDt) >= 0 ? ageParts(birthDt, asOfDt) : null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass + " md:col-span-2"}>
        <h2 className={titleClass}>Days between two dates</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <DateField label="Start date" value={start} onChange={setStart} />
          <DateField label="End date" value={end} onChange={setEnd} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
          <Stat
            label="Calendar days"
            value={Number.isFinite(diffDays) ? String(diffDays) : "—"}
          />
          <Stat
            label="Weeks (exact)"
            value={Number.isFinite(weeks) ? weeks.toFixed(2) : "—"}
          />
          <Stat
            label="Business days"
            value={Number.isFinite(bizDays) ? String(bizDays) : "—"}
          />
          <Stat
            label="Same day?"
            value={diffDays === 0 ? "Yes" : Number.isFinite(diffDays) ? "No" : "—"}
          />
        </div>
        <Formula>
          Days = End − Start (calendar days; same date = 0). Business days skip Saturdays and Sundays.
        </Formula>
        {Number.isFinite(diffDays) && diffDays < 0 && (
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
            End is before start, so the difference is negative.
          </p>
        )}
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Add or subtract days, weeks, months, years</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <DateField label="Starting date" value={base} onChange={setBase} />
          <label className={labelClass}>
            <span>Direction</span>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as "add" | "sub")}
              className={inputClass + " w-36"}
            >
              <option value="add">Add</option>
              <option value="sub">Subtract</option>
            </select>
          </label>
          <label className={labelClass}>
            <span>Amount</span>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass + " w-24 tabular-nums"}
            />
          </label>
          <label className={labelClass}>
            <span>Unit</span>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as typeof unit)}
              className={inputClass + " w-32"}
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </label>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-live="polite">
          <Stat label="Result date" value={resultDt ? formatDate(resultDt) : "—"} />
          <Stat label="Weekday" value={resultDt ? formatLong(resultDt) : "—"} />
        </div>
        <Formula>
          New date = Start {direction === "add" ? "+" : "−"} Amount × Unit (months/years clamp to the last valid day)
        </Formula>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>What day of the week?</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <DateField label="Date" value={lookup} onChange={setLookup} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-live="polite">
          <Stat label="Weekday" value={lookupDt ? lookupDt.toLocaleDateString(undefined, { weekday: "long" }) : "—"} />
          <Stat label="Full date" value={lookupDt ? formatLong(lookupDt) : "—"} />
        </div>
        <Formula>Uses the Gregorian calendar for the selected local date.</Formula>
      </div>

      <div className={cardClass + " md:col-span-2"}>
        <h2 className={titleClass}>Age / duration from a birth date</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <DateField label="Birth date (or start)" value={birth} onChange={setBirth} />
          <DateField label="As of date" value={asOf} onChange={setAsOf} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
          <Stat label="Years" value={age ? String(age.years) : "—"} />
          <Stat label="Months" value={age ? String(age.months) : "—"} />
          <Stat label="Days" value={age ? String(age.days) : "—"} />
          <Stat label="Total days" value={age ? String(age.totalDays) : "—"} />
        </div>
        {age && (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            {age.years} years, {age.months} months, and {age.days} days
            {asOfDt ? ` as of ${formatLong(asOfDt)}` : ""}.
          </p>
        )}
        <Formula>
          Age = years, then remaining months, then remaining days between the two calendar dates.
        </Formula>
        {birthDt && asOfDt && daysBetween(birthDt, asOfDt) < 0 && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            As-of date is before the birth date.
          </p>
        )}
      </div>
    </div>
  );
}
