"use client";

import { useState } from "react";

function num(value: string) {
  if (value.trim() === "") return NaN;
  return Number(value.replace(/[,$\s]/g, ""));
}

function money(value: number) {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pct(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${Number(value.toFixed(2)).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
}

/** Gross margin % from cost and selling price (revenue). */
export function marginFromCostPrice(cost: number, price: number) {
  if (price === 0) return NaN;
  return ((price - cost) / price) * 100;
}

/** Markup % from cost and selling price. */
export function markupFromCostPrice(cost: number, price: number) {
  if (cost === 0) return NaN;
  return ((price - cost) / cost) * 100;
}

/** Selling price needed to hit a target margin % on a given cost. */
export function priceFromCostMargin(cost: number, margin: number) {
  if (margin >= 100) return NaN;
  return cost / (1 - margin / 100);
}

/** Maximum cost allowed to keep a target margin % at a given price. */
export function costFromPriceMargin(price: number, margin: number) {
  return price * (1 - margin / 100);
}

export function marginToMarkup(margin: number) {
  if (margin >= 100) return NaN;
  return (margin / (100 - margin)) * 100;
}

export function markupToMargin(markup: number) {
  if (markup <= -100) return NaN;
  return (markup / (100 + markup)) * 100;
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-900">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">{value}</div>
    </div>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">{children}</p>;
}

export function MarginCalculatorWidget() {
  const [cost1, setCost1] = useState("60");
  const [price1, setPrice1] = useState("100");
  const [cost2, setCost2] = useState("60");
  const [margin2, setMargin2] = useState("40");
  const [price3, setPrice3] = useState("100");
  const [margin3, setMargin3] = useState("40");
  const [conv, setConv] = useState("40");
  const [convMode, setConvMode] = useState<"margin" | "markup">("margin");

  const c1 = num(cost1);
  const p1 = num(price1);
  const profit1 = p1 - c1;
  const m1 = marginFromCostPrice(c1, p1);
  const mu1 = markupFromCostPrice(c1, p1);

  const c2 = num(cost2);
  const m2 = num(margin2);
  const p2 = priceFromCostMargin(c2, m2);

  const p3 = num(price3);
  const m3 = num(margin3);
  const c3 = costFromPriceMargin(p3, m3);

  const cv = num(conv);
  const converted = convMode === "margin" ? marginToMarkup(cv) : markupToMargin(cv);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass + " md:col-span-2"}>
        <h2 className={titleClass}>Margin from cost and selling price</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <Field label="Cost" suffix="$" value={cost1} onChange={setCost1} />
          <Field label="Selling price (revenue)" suffix="$" value={price1} onChange={setPrice1} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
          <Stat label="Gross margin" value={pct(m1)} />
          <Stat label="Markup" value={pct(mu1)} />
          <Stat label="Gross profit" value={Number.isFinite(profit1) ? `$${money(profit1)}` : "—"} />
          <Stat label="Cost as % of price" value={Number.isFinite(m1) ? pct(100 - m1) : "—"} />
        </div>
        <Formula>Margin = (Price − Cost) ÷ Price × 100 · Markup = (Price − Cost) ÷ Cost × 100</Formula>
        {Number.isFinite(m1) && m1 < 0 && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">Selling price is below cost, so this sale makes a loss.</p>
        )}
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Selling price for a target margin</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <Field label="Cost" suffix="$" value={cost2} onChange={setCost2} />
          <Field label="Target margin" suffix="%" value={margin2} onChange={setMargin2} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3" aria-live="polite">
          <Stat label="Selling price" value={Number.isFinite(p2) ? `$${money(p2)}` : "—"} />
          <Stat label="Gross profit" value={Number.isFinite(p2) ? `$${money(p2 - c2)}` : "—"} />
        </div>
        <Formula>Price = Cost ÷ (1 − Margin ÷ 100)</Formula>
      </div>

      <div className={cardClass}>
        <h2 className={titleClass}>Maximum cost for a target margin</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <Field label="Selling price" suffix="$" value={price3} onChange={setPrice3} />
          <Field label="Target margin" suffix="%" value={margin3} onChange={setMargin3} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3" aria-live="polite">
          <Stat label="Maximum cost" value={Number.isFinite(c3) ? `$${money(c3)}` : "—"} />
          <Stat label="Gross profit" value={Number.isFinite(c3) ? `$${money(p3 - c3)}` : "—"} />
        </div>
        <Formula>Cost = Price × (1 − Margin ÷ 100)</Formula>
      </div>

      <div className={cardClass + " md:col-span-2"}>
        <h2 className={titleClass}>Convert margin ↔ markup</h2>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <label className={labelClass}>
            <span>Convert from</span>
            <select
              value={convMode}
              onChange={(e) => setConvMode(e.target.value as "margin" | "markup")}
              className={inputClass + " w-40"}
            >
              <option value="margin">Margin → Markup</option>
              <option value="markup">Markup → Margin</option>
            </select>
          </label>
          <Field label={convMode === "margin" ? "Margin" : "Markup"} suffix="%" value={conv} onChange={setConv} />
          <div className="min-w-40" aria-live="polite">
            <Stat label={convMode === "margin" ? "Equivalent markup" : "Equivalent margin"} value={pct(converted)} />
          </div>
        </div>
        <Formula>
          {convMode === "margin" ? "Markup = Margin ÷ (100 − Margin) × 100" : "Margin = Markup ÷ (100 + Markup) × 100"}
        </Formula>
      </div>
    </div>
  );
}
