"use client";
import React from "react";
import { Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { getImageUrl } from "@/services/images.api";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'>
       <defs>
         <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
           <stop offset='0%' stop-color='#ecfdf5'/><stop offset='100%' stop-color='#f8fafc'/>
         </linearGradient>
       </defs>
       <rect width='100%' height='100%' fill='url(#g)'/>
       <g fill='#94a3b8'>
         <rect x='24' y='24' width='88' height='8' rx='4'/>
         <rect x='24' y='40' width='56' height='8' rx='4'/>
       </g>
     </svg>`
  );

function heroSrcFor(a) {
  if (a?.hero_image_id) return getImageUrl(a.hero_image_id);
  if (Array.isArray(a?.image_ids) && a.image_ids.length)
    return getImageUrl(a.image_ids[0]);
  if (a?.heroImage) return a.heroImage; // legacy URL
  return PLACEHOLDER;
}

export default function ArticleList({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  page,
  setPage,
  totalPages,
  pageItems,
  currentId,
  setCurrentId,
}) {
  return (
    <section className="md:col-span-1 rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
      <div className="rounded-3xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60 p-3">
        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <SearchIcon
              className="pointer-events-none absolute left-2 top-2.5"
              size={16}
            />
            <Input
              placeholder="Search title, tag, author…"
              className="pl-8"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Filters + Sort */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            variant={statusFilter === "all" ? "solid" : "outline"}
            onClick={() => {
              setStatusFilter("all");
              setPage(1);
            }}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "draft" ? "solid" : "outline"}
            onClick={() => {
              setStatusFilter("draft");
              setPage(1);
            }}
          >
            Drafts
          </Button>
          <Button
            variant={statusFilter === "published" ? "solid" : "outline"}
            onClick={() => {
              setStatusFilter("published");
              setPage(1);
            }}
          >
            Published
          </Button>

          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="updated">Sort: Last Updated</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="mt-3 space-y-2">
          {pageItems.map((a) => {
            const src = heroSrcFor(a);
            const safeTags = Array.isArray(a?.tags) ? a.tags : [];
            return (
              <article
                key={a.id}
                className={`flex cursor-pointer items-start gap-3 rounded-3xl border p-5 shadow-sm ${
                  currentId === a.id
                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60"
                }`}
                onClick={() => setCurrentId(a.id)}
              >
                <img
                  src={src}
                  alt="hero"
                  className="h-14 w-20 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold">
                      {a.title}
                    </h3>
                    <Badge>{a.status}</Badge>
                  </div>
                  <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                    {a.summary}
                  </p>
                  {safeTags.length > 0 && (
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {safeTags.slice(0, 3).map((t) => (
                        <Badge key={String(t)}>#{t}</Badge>
                      ))}
                      {safeTags.length > 3 && (
                        <Badge>+{safeTags.length - 3}</Badge>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-3 flex items-center justify-between">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            <ChevronLeft size={16} /> Prev
          </Button>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Page {page} / {totalPages}
          </div>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(Math.min(totalPages, page + 1))}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
