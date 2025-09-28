"use client";
import React from "react";

export default function RecentArticlesSkeleton({ count = 5 }) {
  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-5 w-32 skeleton shimmer rounded" />
        <div className="h-4 w-16 skeleton shimmer rounded" />
      </div>

      <ul className="grid gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <li
            key={i}
            className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex flex-1 items-center gap-2">
              <div className="h-4 w-4 skeleton shimmer rounded" />
              <div className="h-4 w-40 skeleton shimmer rounded" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-5 w-12 skeleton shimmer rounded-full" />
              <div className="h-5 w-5 skeleton shimmer rounded" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
