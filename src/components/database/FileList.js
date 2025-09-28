import { Search, Plus, SortAsc, SortDesc, Globe } from "lucide-react";
import Badge from "../atoms/Badge";
import BusyOverlay from "./BusyOverlay";

export default function FilesList({
  items,
  query,
  setQuery,
  publishedFilter,
  setPublishedFilter,
  sortBy,
  setSortBy,
  page,
  setPage,
  totalPages,
  currentId,
  setCurrentId,
  onCreate,
  refreshing,
}) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <BusyOverlay show={refreshing} />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative grow">
          <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title/description…"
            className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <select
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="all">All</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
        <button
          onClick={() =>
            setSortBy((s) =>
              s === "title_asc"
                ? "title_desc"
                : s === "title_desc"
                ? "created_desc"
                : "title_asc"
            )
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
        >
          {sortBy.startsWith("title") ? (
            <SortAsc size={16} />
          ) : (
            <SortDesc size={16} />
          )}
          Sort
        </button>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus size={16} /> New
        </button>
      </div>

      <ul className="grid gap-2">
        {items.map((f) => {
          const active = f.id === currentId;
          return (
            <li
              key={f.id}
              onClick={() => setCurrentId(f.id)}
              className={`w-full cursor-pointer rounded-xl border p-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${
                active
                  ? "border-emerald-400 bg-emerald-50/70 dark:border-emerald-700 dark:bg-emerald-900/10"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium break-words">{f.title}</p>
                  <p className="text-xs text-slate-500 break-words">
                    {f.description || "—"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {f.is_published ? (
                    <Badge tone="green">Published</Badge>
                  ) : (
                    <Badge tone="yellow">Draft</Badge>
                  )}
                  <a
                    href={f.drive_link}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    onClick={(e) => e.stopPropagation()}
                    title="Open Drive link"
                  >
                    <Globe size={16} />
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>
          Page {page} / {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            className="rounded-lg border border-slate-200 px-2 py-1 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
            disabled={page <= 1}
          >
            Prev
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-slate-200 px-2 py-1 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}