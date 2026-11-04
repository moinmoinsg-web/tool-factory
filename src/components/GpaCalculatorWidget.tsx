"use client";

import { useState } from "react";

/** Standard US unweighted 4.0 scale with plus/minus grades. */
export const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
};

export const LEVEL_BONUS: Record<string, number> = {
  regular: 0,
  honors: 0.5,
  ap: 1.0,
};

type Course = {
  id: number;
  name: string;
  grade: string;
  credits: string;
  level: keyof typeof LEVEL_BONUS;
};

function num(value: string) {
  if (value.trim() === "") return NaN;
  return Number(value.replace(/[,\s]/g, ""));
}

function fmt(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(digits);
}

export type GpaResult = {
  credits: number;
  unweightedPoints: number;
  weightedPoints: number;
  unweighted: number;
  weighted: number;
};

/** Credit-weighted GPA. F grades count; bonus points are never added to an F. */
export function calculateGpa(courses: { grade: string; credits: number; level: string }[]): GpaResult {
  let credits = 0;
  let unweightedPoints = 0;
  let weightedPoints = 0;
  for (const c of courses) {
    const gp = GRADE_POINTS[c.grade];
    if (gp === undefined || !Number.isFinite(c.credits) || c.credits <= 0) continue;
    const bonus = gp > 0 ? LEVEL_BONUS[c.level] ?? 0 : 0;
    credits += c.credits;
    unweightedPoints += gp * c.credits;
    weightedPoints += (gp + bonus) * c.credits;
  }
  return {
    credits,
    unweightedPoints,
    weightedPoints,
    unweighted: credits > 0 ? unweightedPoints / credits : NaN,
    weighted: credits > 0 ? weightedPoints / credits : NaN,
  };
}

/** Combine a prior cumulative GPA with this term. */
export function cumulativeGpa(priorGpa: number, priorCredits: number, termPoints: number, termCredits: number) {
  const total = priorCredits + termCredits;
  if (total <= 0) return NaN;
  return (priorGpa * priorCredits + termPoints) / total;
}

/** GPA needed over the remaining credits to reach a target cumulative GPA. */
export function requiredGpa(currentGpa: number, currentCredits: number, targetGpa: number, remainingCredits: number) {
  if (remainingCredits <= 0) return NaN;
  return (targetGpa * (currentCredits + remainingCredits) - currentGpa * currentCredits) / remainingCredits;
}

const inputClass =
  "rounded-lg border border-zinc-300 bg-zinc-50 p-2 text-base tabular-nums text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";
const cardClass =
  "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5";
const titleClass = "text-base font-semibold text-zinc-900 dark:text-zinc-50";
const labelClass = "flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300";

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className={labelClass}>
      <span>{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass + " w-32"}
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

const initialCourses: Course[] = [
  { id: 1, name: "English", grade: "A", credits: "3", level: "regular" },
  { id: 2, name: "Calculus", grade: "B+", credits: "4", level: "regular" },
  { id: 3, name: "Biology", grade: "A-", credits: "4", level: "regular" },
  { id: 4, name: "History", grade: "B", credits: "3", level: "regular" },
];

export function GpaCalculatorWidget() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [nextId, setNextId] = useState(5);
  const [priorGpa, setPriorGpa] = useState("");
  const [priorCredits, setPriorCredits] = useState("");
  const [curGpa, setCurGpa] = useState("3.2");
  const [curCredits, setCurCredits] = useState("60");
  const [targetGpa, setTargetGpa] = useState("3.5");
  const [remCredits, setRemCredits] = useState("30");

  const update = (id: number, patch: Partial<Course>) =>
    setCourses((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const remove = (id: number) => setCourses((list) => list.filter((c) => c.id !== id));
  const add = () => {
    setCourses((list) => [...list, { id: nextId, name: "", grade: "A", credits: "3", level: "regular" }]);
    setNextId((n) => n + 1);
  };

  const result = calculateGpa(courses.map((c) => ({ grade: c.grade, credits: num(c.credits), level: c.level })));
  const hasWeighting = courses.some((c) => c.level !== "regular");

  const pg = num(priorGpa);
  const pc = num(priorCredits);
  const cumulative =
    Number.isFinite(pg) && Number.isFinite(pc) && pc > 0
      ? cumulativeGpa(pg, pc, result.unweightedPoints, result.credits)
      : NaN;

  const needed = requiredGpa(num(curGpa), num(curCredits), num(targetGpa), num(remCredits));

  return (
    <div className="grid gap-4">
      <div className={cardClass}>
        <h2 className={titleClass}>Semester GPA</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="pb-2 pr-2 font-medium">Course (optional)</th>
                <th className="pb-2 pr-2 font-medium">Grade</th>
                <th className="pb-2 pr-2 font-medium">Credits</th>
                <th className="pb-2 pr-2 font-medium">Type</th>
                <th className="pb-2 font-medium">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr key={c.id}>
                  <td className="py-1 pr-2">
                    <input
                      type="text"
                      aria-label={`Course ${i + 1} name`}
                      value={c.name}
                      placeholder={`Course ${i + 1}`}
                      onChange={(e) => update(c.id, { name: e.target.value })}
                      className={inputClass + " w-full"}
                    />
                  </td>
                  <td className="py-1 pr-2">
                    <select
                      aria-label={`Course ${i + 1} grade`}
                      value={c.grade}
                      onChange={(e) => update(c.id, { grade: e.target.value })}
                      className={inputClass + " w-24"}
                    >
                      {Object.keys(GRADE_POINTS).map((g) => (
                        <option key={g} value={g}>
                          {g} ({GRADE_POINTS[g].toFixed(1)})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-1 pr-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      aria-label={`Course ${i + 1} credits`}
                      value={c.credits}
                      onChange={(e) => update(c.id, { credits: e.target.value })}
                      className={inputClass + " w-20"}
                    />
                  </td>
                  <td className="py-1 pr-2">
                    <select
                      aria-label={`Course ${i + 1} type`}
                      value={c.level}
                      onChange={(e) => update(c.id, { level: e.target.value as Course["level"] })}
                      className={inputClass + " w-32"}
                    >
                      <option value="regular">Regular</option>
                      <option value="honors">Honors (+0.5)</option>
                      <option value="ap">AP / IB (+1.0)</option>
                    </select>
                  </td>
                  <td className="py-1">
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                      aria-label={`Remove course ${i + 1}`}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={add}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            + Add course
          </button>
          <button
            type="button"
            onClick={() => setCourses([])}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Clear all
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
          <Stat label="Unweighted GPA" value={fmt(result.unweighted)} />
          <Stat label={hasWeighting ? "Weighted GPA" : "Weighted GPA (no honors/AP)"} value={fmt(result.weighted)} />
          <Stat label="Total credits" value={result.credits ? String(Number(result.credits.toFixed(2))) : "—"} />
          <Stat label="Quality points" value={fmt(result.unweightedPoints, 1)} />
        </div>
        <Formula>GPA = Σ(grade points × credits) ÷ Σ credits · Weighted adds +0.5 (Honors) or +1.0 (AP/IB) per passed course</Formula>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h2 className={titleClass}>Cumulative GPA</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Add your GPA and credits from previous terms to combine them with the courses above.
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <Field label="Previous GPA" value={priorGpa} onChange={setPriorGpa} />
            <Field label="Previous credits" value={priorCredits} onChange={setPriorCredits} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3" aria-live="polite">
            <Stat label="New cumulative GPA" value={fmt(cumulative)} />
            <Stat
              label="Total credits"
              value={Number.isFinite(cumulative) ? String(Number((pc + result.credits).toFixed(2))) : "—"}
            />
          </div>
          <Formula>Cumulative = (Prev GPA × Prev credits + Term points) ÷ (Prev credits + Term credits)</Formula>
        </div>

        <div className={cardClass}>
          <h2 className={titleClass}>GPA needed for a target</h2>
          <div className="mt-3 flex flex-wrap gap-4">
            <Field label="Current GPA" value={curGpa} onChange={setCurGpa} />
            <Field label="Credits completed" value={curCredits} onChange={setCurCredits} />
            <Field label="Target GPA" value={targetGpa} onChange={setTargetGpa} />
            <Field label="Remaining credits" value={remCredits} onChange={setRemCredits} />
          </div>
          <div className="mt-4" aria-live="polite">
            <Stat label="GPA needed on remaining credits" value={fmt(needed)} />
            {Number.isFinite(needed) && needed > 4 && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                Above 4.0, so the target is not reachable on an unweighted 4.0 scale with these credits.
              </p>
            )}
            {Number.isFinite(needed) && needed <= 0 && (
              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">You will stay at or above the target with any passing grades.</p>
            )}
          </div>
          <Formula>Needed = (Target × (Done + Remaining) − Current × Done) ÷ Remaining</Formula>
        </div>
      </div>
    </div>
  );
}
