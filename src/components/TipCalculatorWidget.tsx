"use client";

import { useMemo, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white p-2 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function TipCalculatorWidget() {
  const [bill, setBill] = useState("85.00");
  const [tipPct, setTipPct] = useState(18);
  const [people, setPeople] = useState("2");
  const [roundUp, setRoundUp] = useState(false);

  const res = useMemo(() => {
    const b = Number(bill);
    const p = Math.floor(Number(people));
    if (!Number.isFinite(b) || b < 0 || bill.trim() === "") return { error: "Enter a bill amount of 0 or more." };
    if (!Number.isFinite(p) || p < 1) return { error: "Number of people must be at least 1." };
    let tip = (b * tipPct) / 100;
    let total = b + tip;
    if (roundUp) {
      total = Math.ceil(total);
      tip = total - b;
    }
    return { b, p, tip, total, perPerson: total / p, tipPer: tip / p, effective: b > 0 ? (tip / b) * 100 : 0 };
  }, [bill, tipPct, people, roundUp]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Bill amount ($)
          <input className={inputClass} inputMode="decimal" value={bill} onChange={(e) => setBill(e.target.value)} />
        </label>
        <label className="text-sm">
          Number of people
          <input className={inputClass} inputMode="numeric" value={people} onChange={(e) => setPeople(e.target.value)} />
        </label>
      </div>
      <div>
        <div className="mb-1 text-sm">Tip: {tipPct}%</div>
        <div className="flex flex-wrap gap-2">
          {[10, 15, 18, 20, 25].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipPct(t)}
              className={"rounded-lg border px-3 py-1 text-sm " + (tipPct === t ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900" : "border-zinc-300 dark:border-zinc-700")}
            >
              {t}%
            </button>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={50}
          value={tipPct}
          onChange={(e) => setTipPct(Number(e.target.value))}
          className="mt-3 w-full"
          aria-label="Tip percentage"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={roundUp} onChange={(e) => setRoundUp(e.target.checked)} />
        Round the total up to the next whole dollar
      </label>
      {"error" in res ? (
        <p className="text-sm text-red-600">{res.error}</p>
      ) : (
        <dl className="grid gap-2 rounded-lg border border-zinc-200 p-4 text-sm sm:grid-cols-2 dark:border-zinc-800">
          <div><dt className="text-zinc-500">Tip amount</dt><dd className="font-mono text-lg">{money(res.tip)}</dd></div>
          <div><dt className="text-zinc-500">Total with tip</dt><dd className="font-mono text-lg">{money(res.total)}</dd></div>
          <div><dt className="text-zinc-500">Total per person</dt><dd className="font-mono text-lg">{money(res.perPerson)}</dd></div>
          <div><dt className="text-zinc-500">Tip per person</dt><dd className="font-mono text-lg">{money(res.tipPer)}</dd></div>
          <div className="sm:col-span-2 text-zinc-500">Effective tip: {res.effective.toFixed(2)}%</div>
        </dl>
      )}
    </div>
  );
}
