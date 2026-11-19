"use client";

import { useState } from "react";
import {
  markupFromCostPrice,
  marginFromCostPrice,
  markupToMargin,
} from "@/components/MarginCalculatorWidget";

function num(value: string) {
  if (value.trim() === "") return NaN;
  return Number(value.replace(/[,$\s]/g, ""));
}

function money(value: number) {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pct(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${Number(value.toFixed(2)).toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;
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

export function MarkupCalculatorWidget() {
  const [cost1, setCost1] = useState("60");
  const [price1, setPrice1] = useState("100");
  const [cost2, setCost2] = useState("60");
  const [markup2, setMarkup2] = useState("50");
  const [price3, setPrice3] = useState("150");
  const [markup3, setMarkup3] = useState("50");

  const c1 = num(cost1);
  const p1 = num(price1);
  const profit1 = p1 - c1;
  const mu1 = markupFromCostPrice(c1, p1);
  const mg1 = marginFromCostPrice(c1, p1);

  const c2 = num(cost2);
  const mu2 = num(markup2);
  const p2 = c2 * (1 + mu2 / 100);
  const mg2 = markupToMargin(mu2);

  const p3 = num(price3);
  const mu3 = num(markup3);
  const c3 = mu3 <= -100 ? NaN : p3 / (1 + mu3 / 100);

  return (
    <div className="flex flex-col gap-6">
      <section className={cardClass}>
        <h2 className={titleClass}>Markup from cost and selling price</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <Field label="Cost" value={cost1} onChange={setCost1} suffix="$" />
          <Field label="Selling price" value={price1} onChange={setPrice1} suffix="$" />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Markup" value={pct(mu1)} />
          <Stat label="Profit" value={Number.isFinite(profit1) ? money(profit1) : "—"} />
          <Stat label="Gross margin" value={pct(mg1)} />
        </div>
        <Formula>Markup % = (Price − Cost) ÷ Cost × 100</Formula>
      </section>

      <section className={cardClass}>
        <h2 className={titleClass}>Selling price from cost and markup</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <Field label="Cost" value={cost2} onChange={setCost2} suffix="$" />
          <Field label="Markup" value={markup2} onChange={setMarkup2} suffix="%" />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Selling price" value={money(p2)} />
          <Stat label="Profit" value={money(p2 - c2)} />
          <Stat label="Gross margin" value={pct(mg2)} />
        </div>
        <Formula>Price = Cost × (1 + Markup ÷ 100)</Formula>
      </section>

      <section className={cardClass}>
        <h2 className={titleClass}>Cost from selling price and markup</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <Field label="Selling price" value={price3} onChange={setPrice3} suffix="$" />
          <Field label="Markup" value={markup3} onChange={setMarkup3} suffix="%" />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Stat label="Cost" value={money(c3)} />
          <Stat label="Profit" value={money(p3 - c3)} />
        </div>
        <Formula>Cost = Price ÷ (1 + Markup ÷ 100)</Formula>
      </section>
    </div>
  );
}
