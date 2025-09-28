"use client";
import React from "react";

export default function ArticlePreviewSkeleton({
  showImage = true,
  paragraphs = 3,
}) {
  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="p-4 sm:p-6">
          <div className="rounded-2xl bg-white/80 p-4 backdrop-blur dark:bg-slate-900/60">
            {/* top badge */}
            <div className="h-5 w-56 skeleton shimmer rounded-full" />

            {/* title */}
            <div className="mt-3 h-8 w-3/4 skeleton shimmer rounded" />

            {/* summary */}
            <div className="mt-2 space-y-2">
              <div className="h-4 w-[80%] skeleton shimmer rounded" />
              <div className="h-4 w-[60%] skeleton shimmer rounded" />
            </div>

            {/* meta: author • date • tags */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="h-4 w-24 skeleton shimmer rounded" />
              <div className="h-4 w-3 skeleton shimmer rounded" />
              <div className="h-4 w-28 skeleton shimmer rounded" />
              <div className="h-4 w-3 skeleton shimmer rounded" />
              <div className="h-5 w-16 skeleton shimmer rounded-full" />
              <div className="h-5 w-14 skeleton shimmer rounded-full" />
              <div className="h-5 w-20 skeleton shimmer rounded-full" />
            </div>

            {/* hero image */}
            {showImage && (
              <div className="mt-4 w-full overflow-hidden rounded-xl">
                <div className="aspect-[16/9] w-full skeleton shimmer rounded-xl" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body (Markdown-like blocks) */}
      <div className="prose prose-slate max-w-none p-4 sm:p-6 dark:prose-invert">
        {/* H1 */}
        <div className="h-7 w-1/2 skeleton shimmer rounded mb-4" />

        {/* paragraph blocks */}
        {Array.from({ length: paragraphs }).map((_, i) => (
          <div key={i} className="mb-4 space-y-2">
            <div className="h-4 w-[95%] skeleton shimmer rounded" />
            <div className="h-4 w-[88%] skeleton shimmer rounded" />
            <div className="h-4 w-[72%] skeleton shimmer rounded" />
          </div>
        ))}

        {/* H2 */}
        <div className="h-6 w-2/5 skeleton shimmer rounded mt-8 mb-3" />

        {/* list */}
        <div className="mb-4 space-y-2 pl-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 skeleton shimmer rounded-full" />
            <div className="h-4 w-[70%] skeleton shimmer rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 skeleton shimmer rounded-full" />
            <div className="h-4 w-[62%] skeleton shimmer rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 skeleton shimmer rounded-full" />
            <div className="h-4 w-[55%] skeleton shimmer rounded" />
          </div>
        </div>

        {/* code block */}
        <div className="my-4 rounded-xl p-4">
          <div className="h-28 w-full skeleton shimmer rounded-xl" />
        </div>

        {/* image inside content */}
        <div className="my-6">
          <div className="h-52 w-full skeleton shimmer rounded-xl" />
        </div>

        {/* table header + 2 rows */}
        <div className="my-6 w-full overflow-hidden rounded-lg border border-gray-200">
          <div className="grid grid-cols-3 bg-gray-100 p-2">
            <div className="h-4 w-3/4 skeleton shimmer rounded" />
            <div className="h-4 w-1/2 skeleton shimmer rounded" />
            <div className="h-4 w-2/3 skeleton shimmer rounded" />
          </div>
          <div className="grid grid-cols-3 border-t border-gray-200 p-2">
            <div className="h-4 w-2/3 skeleton shimmer rounded" />
            <div className="h-4 w-1/3 skeleton shimmer rounded" />
            <div className="h-4 w-1/2 skeleton shimmer rounded" />
          </div>
          <div className="grid grid-cols-3 border-t border-gray-200 p-2">
            <div className="h-4 w-1/2 skeleton shimmer rounded" />
            <div className="h-4 w-2/3 skeleton shimmer rounded" />
            <div className="h-4 w-1/3 skeleton shimmer rounded" />
          </div>
        </div>

        {/* hr */}
        <div className="my-8 h-[1px] w-full skeleton shimmer rounded" />
      </div>
    </div>
  );
}
