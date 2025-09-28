"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  FileDown,
  Globe,
  Moon,
  Sun,
  Trash2,
  Link as LinkIcon,
  UploadCloud,
  Check,
  X,
} from "lucide-react";

// ---------- Helpers ----------
const toSlug = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// ---------- Dummy data ----------
const seed = [
  {
    id: crypto.randomUUID(),
    slug: "hydrology-report-2025",
    title: "Hydrology Report 2025",
    description: "Compiled rainfall & discharge datasets.",
    drive_link: "https://drive.google.com/file/d/1-demo/view",
    is_published: true,
    metadata: { owner: "WRECC", region: "DIY", version: 1 },
    created_at: new Date(Date.now() - 86400 * 1000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 86400 * 1000 * 3).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    slug: "watershed-boundary-shapefile",
    title: "Watershed Boundary Shapefile",
    description: "ZIP of .shp, .dbf, .prj (EPSG:4326).",
    drive_link: "https://drive.google.com/file/d/2-demo/view",
    is_published: false,
    metadata: { epsg: 4326, size_mb: 14.2 },
    created_at: new Date(Date.now() - 86400 * 1000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400 * 1000 * 2).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    slug: "rainfall-timeseries-2018-2025",
    title: "Rainfall Timeseries (2018–2025)",
    description: "CSV + README. Cleaned, checked missing values.",
    drive_link: "https://drive.google.com/file/d/3-demo/view",
    is_published: true,
    metadata: { stations: 37, rows: 102934 },
    created_at: new Date(Date.now() - 86400 * 1000 * 20).toISOString(),
    updated_at: new Date(Date.now() - 86400 * 1000 * 1).toISOString(),
  },
];

// ---------- Small UI bits ----------
function BusyOverlay({ show }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white/40 backdrop-blur-sm dark:bg-slate-900/40" />
  );
}

function Badge({ children, tone = "slate" }) {
  const map = {
    slate:
      "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-700",
    green:
      "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800",
    yellow:
      "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800",
    red: "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-800",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${map[tone]}`}
    >
      {children}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

// ---------- List (left) ----------
function FilesList({
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
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
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
              {/* allow children to shrink */}
              <div className="flex items-center justify-between">
                {/* left text column must also be min-w-0 for truncate to work */}
                <div className="min-w-0">
                  <p className="font-medium break-words">{f.title}</p>
                  <p className="text-xs text-slate-500 break-words">
                    {f.description || "—"}
                  </p>
                </div>
                {/* right actions should not grow */}
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

// ---------- Editor (middle) ----------
function FileEditorPanel({ file, onChange, onDelete }) {
  const [draft, setDraft] = useState(file);

  useEffect(() => setDraft(file), [file?.id]);

  if (!file) {
    return (
      <div className="flex h-[720px] items-center justify-center text-slate-500">
        Select a file on the left or create a new one.
      </div>
    );
  }

  const apply = (patch) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold">Editor</div>
        <div className="flex items-center gap-2">
          <button
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs ring-1 ring-inset ${
              draft.is_published
                ? "bg-emerald-600 text-white ring-emerald-700"
                : "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-800"
            }`}
            onClick={() => apply({ is_published: !draft.is_published })}
            title="Toggle published"
          >
            {draft.is_published ? <Check size={14} /> : <X size={14} />}
            {draft.is_published ? "Published" : "Draft"}
          </button>
          <button
            onClick={() => onDelete(file.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-100 dark:border-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        <Field label="Title">
          <input
            value={draft.title}
            onChange={(e) => apply({ title: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </Field>

        <Field label="Slug">
          <div className="flex gap-2">
            <input
              value={draft.slug}
              onChange={(e) => apply({ slug: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
            />
            <button
              onClick={() => apply({ slug: toSlug(draft.title || "") })}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Auto
            </button>
          </div>
        </Field>

        <Field label="Description">
          <textarea
            value={draft.description || ""}
            onChange={(e) => apply({ description: e.target.value })}
            className="min-h-[96px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </Field>

        <Field label="Drive Link">
          <div className="flex gap-2">
            <input
              value={draft.drive_link}
              onChange={(e) => apply({ drive_link: e.target.value })}
              placeholder="https://drive.google.com/..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
            />
            <a
              href={draft.drive_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              title="Open link"
            >
              <LinkIcon size={16} />
            </a>
          </div>
        </Field>

        <Field label="Metadata (JSON)">
          <textarea
            value={JSON.stringify(draft.metadata ?? {}, null, 2)}
            onChange={(e) => {
              try {
                const obj = JSON.parse(e.target.value || "{}");
                apply({ metadata: obj });
              } catch {
                // ignore parse error while typing
              }
            }}
            className="font-mono min-h-[140px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </Field>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setDraft(file)} // reset
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Reset
          </button>
          <button
            onClick={() => onChange(file.id, draft)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <UploadCloud size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Preview (right) ----------
function FilePreview({ file }) {
  if (!file) {
    return <div className="p-6 text-slate-500">Nothing to preview.</div>;
  }
  return (
    <div className="p-4">
      <div className="grid gap-3 text-sm">
        <div>
          <div className="text-xs font-medium text-slate-500">Title</div>
          <div className="truncate font-semibold">{file.title}</div>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-500">Description</div>
          <p className="text-slate-700 dark:text-slate-300">
            {file.description || "—"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-slate-500">Drive</div>
          <a
            href={file.drive_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <FileDown size={14} /> Open
          </a>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Status</span>
          {file.is_published ? (
            <Badge tone="green">Published</Badge>
          ) : (
            <Badge tone="yellow">Draft</Badge>
          )}
        </div>

        <div>
          <div className="text-xs font-medium text-slate-500">Metadata</div>
          <pre className="mt-1 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-900/60">
            {JSON.stringify(file.metadata ?? {}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ---------- Main CMS ----------
export default function PublicFilesCMS() {
  // theme (same pattern as your CMS)
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const last =
      typeof window !== "undefined" &&
      localStorage.getItem("theme-dark") === "true";
    setDark(!!last);
    if (typeof document !== "undefined")
      document.documentElement.classList.toggle("dark", !!last);
  }, []);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem("theme-dark", String(dark));
    }
  }, [dark]);

  // local data store (mocking RTK Query list + mutations)
  const [all, setAll] = useState(seed);
  const [currentId, setCurrentId] = useState(all[0]?.id ?? null);

  // filters/pagination
  const [query, setQuery] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("all"); // "true" | "false" | "all"
  const [sortBy, setSortBy] = useState("created_desc"); // title_asc | title_desc | created_desc | created_asc
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // derived
  const filtered = useMemo(() => {
    let rows = [...all];
    if (publishedFilter !== "all") {
      rows = rows.filter((r) => String(!!r.is_published) === publishedFilter);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q)
      );
    }
    const byCreated = (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    const byTitle = (a, b) => a.title.localeCompare(b.title);

    switch (sortBy) {
      case "title_asc":
        rows.sort(byTitle);
        break;
      case "title_desc":
        rows.sort((a, b) => -byTitle(a, b));
        break;
      case "created_asc":
        rows.sort(byCreated);
        break;
      default:
        rows.sort((a, b) => -byCreated(a, b));
    }
    return rows;
  }, [all, query, publishedFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const pageItems = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const current = useMemo(
    () => all.find((a) => a.id === currentId) || null,
    [all, currentId]
  );

  // fake background refresh state (for visual parity)
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    setRefreshing(true);
    const t = setTimeout(() => setRefreshing(false), 350);
    return () => clearTimeout(t);
  }, [query, publishedFilter, sortBy, page, limit]);

  // CRUD actions (mock)
  const onCreate = () => {
    const base = "Untitled File";
    const title = `${base}`;
    const slug = toSlug(`${base} ${Math.random().toString(36).slice(2, 6)}`);
    const row = {
      id: crypto.randomUUID(),
      slug,
      title,
      description: "",
      drive_link: "https://drive.google.com/",
      is_published: false,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setAll((xs) => [row, ...xs]);
    setCurrentId(row.id);
    setPage(1);
  };

  const onChange = (id, patch) => {
    setAll((xs) =>
      xs.map((x) =>
        x.id === id
          ? { ...x, ...patch, updated_at: new Date().toISOString() }
          : x
      )
    );
  };

  const onDelete = (id) => {
    setAll((xs) => xs.filter((x) => x.id !== id));
    if (currentId === id) setCurrentId(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950 dark:text-slate-100">
      <div className="w-full p-4 sm:p-8 grid gap-6 max-w-7xl mx-auto">
        {/* Header / Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Public Files CMS</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage Drive-linked documents shown on the site.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Plus size={16} /> New File
            </button>
            <button
              onClick={() => setDark((d) => !d)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              title="Toggle theme"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <main className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Left: List */}
          <section className="relative md:col-span-1">
            <BusyOverlay show={refreshing} />
            <FilesList
              items={pageItems}
              query={query}
              setQuery={(q) => {
                setQuery(q);
                setPage(1);
              }}
              publishedFilter={publishedFilter}
              setPublishedFilter={(v) => {
                setPublishedFilter(v);
                setPage(1);
              }}
              sortBy={sortBy}
              setSortBy={setSortBy}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              currentId={currentId}
              setCurrentId={setCurrentId}
              onCreate={onCreate}
            />
          </section>

          {/* Middle: Editor */}
          <section className="md:col-span-1">
            <FileEditorPanel
              file={current}
              onChange={onChange}
              onDelete={onDelete}
            />
          </section>

          {/* Right: Preview */}
          <section className="md:col-span-1">
            <div className="sticky top-[68px] rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="border-b border-slate-200 p-3 text-sm font-semibold dark:border-slate-800">
                <Eye className="mr-2 inline" size={16} /> Live Preview
              </div>
              <FilePreview file={current} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
