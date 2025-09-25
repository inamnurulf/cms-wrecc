"use client";
import React, { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { useGetArticleStatsQuery } from "@/services/articles.api";

export default function StatsGrid({ stats }) {
  const shouldFetch = !stats || stats.length === 0 || stats.every((s) => s?.value == null);

  const filters = useAppSelector((s) => s.article?.filters) || {};

  const params = useMemo(
    () => ({
      q: filters.q ?? undefined,
      tag_id: filters.tag_id ?? undefined,
      category_id: filters.category_id ?? undefined,
    }),
    [filters.q, filters.tag_id, filters.category_id]
  );

  const { data: fetched, isFetching } = useGetArticleStatsQuery(params, {
    skip: !shouldFetch,
  });

  const autoStats =
    fetched
      ? [
          { title: "Published Articles", value: fetched.data?.published ?? 0 },
          { title: "Drafts", value: fetched.data?.drafts ?? 0 },
          { title: "Pending Review", value: fetched.data?.pending ?? 0 },
        ]
      : undefined;

  const finalStats =
    stats && stats.length
      ? stats
      : isFetching
      ? [
          { title: "Published Articles", value: "…" },
          { title: "Drafts", value: "…" },
          { title: "Pending Review", value: "…" },
        ]
      : autoStats ?? [
          { title: "Published Articles", value: 0 },
          { title: "Drafts", value: 0 },
          { title: "Pending Review", value: 0 },
        ];

        console.log({stats, fetched, finalStats});  
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {finalStats.map((s) => (
        <div
          key={s.title}
          className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60"
        >
          <p className="text-xs uppercase tracking-wide text-slate-500">{s.title}</p>
          <p className="mt-2 text-2xl font-extrabold">{s.value}</p>
        </div>
      ))}
    </section>
  );
}
