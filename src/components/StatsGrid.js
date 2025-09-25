"use client";
import React from "react";

export default function StatsGrid({ stats }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.title}
          className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60"
        >
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {s.title}
          </p>
          <p className="mt-2 text-2xl font-extrabold">{s.value}</p>
        </div>
      ))}
    </section>
  );
}
