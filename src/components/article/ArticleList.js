"use client";
import React from "react";
import { Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

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
            <SearchIcon className="pointer-events-none absolute left-2 top-2.5" size={16} />
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
          {pageItems.map((a) => (
            <article
              key={a.id}
              className={`flex cursor-pointer items-start gap-3 rounded-3xl border p-5 shadow-sm ${
                currentId === a.id
                  ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60"
              }`}
              onClick={() => setCurrentId(a.id)}
            >
              <img src={a.heroImage} alt="hero" className="h-14 w-20 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold">{a.title}</h3>
                  <Badge>{a.status}</Badge>
                </div>
                <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{a.summary}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  {a.tags.slice(0, 3).map((t) => (
                    <Badge key={t.id}>#{t.name}</Badge>
                  ))}
                  {a.tags.length > 3 && <Badge>+{a.tags.length - 3}</Badge>}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-3 flex items-center justify-between">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} /> Prev
          </Button>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Page {page} / {totalPages}
          </div>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
