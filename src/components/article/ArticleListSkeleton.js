"use client";
import React from "react";


export default function ArticleListSkeleton({ count = 6 }) {
  return (
    <section className="md:col-span-1 rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
      <div className="rounded-3xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60 p-3">
        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <div className="absolute left-2 top-2.5 h-4 w-4 skeleton shimmer rounded" />
            <div className="h-9 w-full skeleton shimmer rounded-xl" />
          </div>
        </div>

        {/* Filters + Sort */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="h-8 w-16 skeleton shimmer rounded-xl" />
          <div className="h-8 w-20 skeleton shimmer rounded-xl" />
          <div className="h-8 w-24 skeleton shimmer rounded-xl" />
          <div className="ml-auto h-8 w-40 skeleton shimmer rounded-xl" />
        </div>

        {/* List */}
        <div className="mt-3 space-y-2">
          {Array.from({ length: count }).map((_, i) => (
            <article
              key={i}
              className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="h-14 w-20 skeleton shimmer rounded-lg" />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <div className="h-4 w-40 skeleton shimmer rounded" />
                  <div className="h-5 w-14 skeleton shimmer rounded-full" />
                </div>
                <div className="mb-1 space-y-1">
                  <div className="h-3 w-[90%] skeleton shimmer rounded" />
                  <div className="h-3 w-[70%] skeleton shimmer rounded" />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <div className="h-5 w-12 skeleton shimmer rounded-full" />
                  <div className="h-5 w-10 skeleton shimmer rounded-full" />
                  <div className="h-5 w-16 skeleton shimmer rounded-full" />
                  <div className="h-5 w-8 skeleton shimmer rounded-full" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-3 flex items-center justify-between">
          <div className="h-9 w-24 skeleton shimmer rounded-xl" />
          <div className="h-4 w-24 skeleton shimmer rounded" />
          <div className="h-9 w-24 skeleton shimmer rounded-xl" />
        </div>
      </div>
    </section>
  );
}
