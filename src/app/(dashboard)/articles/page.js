"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Save,
  Trash2,
  Upload,
  Download,
  Search as SearchIcon,
  Eye,
  FileEdit,
  Tags,
  Calendar,
  Image as ImageIcon,
  User,
  ChevronLeft,
  ChevronRight,
  FileText,
  Edit3,
  Sun,
  Moon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// ---------- Helpers ----------
const uid = () => Math.random().toString(36).slice(2, 10);
const nowISO = () => new Date().toISOString();
const toSlug = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// ---------- Dummy Seed Data ----------
const SEED = [
  {
    id: uid(),
    title: "Hydro-Climatic Trends in Central Java (2010–2025)",
    slug: "hydro-climatic-trends-central-java",
    author: "WRECC Team",
    summary:
      "Ringkasan hasil awal pemantauan curah hujan dan debit sungai di kawasan Kedu, 2010–2025, beserta implikasi kebijakan adaptasi.",
    content:
      `## Latar Belakang\n\nPemanasan global berdampak pada pola hujan. Studi ini mengulas tren **anomali curah hujan** dan *baseflow* sungai utama.\n\n### Metodologi Singkat\n- Agregasi data harian menjadi bulanan\n- Detrending via STL\n- Uji Mann-Kendall\n\n### Temuan\n1. Musim kemarau makin kering\n2. Lonjakan hujan ekstrem meningkat\n\n> Catatan: ini adalah _dummy content_ untuk preview.`,
    tags: ["climate", "hydrology", "trend"],
    heroImage:
      "https://images.unsplash.com/photo-1494475673543-6a6a27143b22?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    publishedAt: "2025-08-20T10:00:00.000Z",
    updatedAt: nowISO(),
  },
  {
    id: uid(),
    title: "Designing Community Early-Warning Dashboards",
    slug: "designing-community-early-warning",
    author: "In’am Nurul Fuady",
    summary:
      "Prinsip UX untuk papan informasi peringatan dini: bahasa sederhana, akses cepat, dan kontras visual.",
    content:
      `### Prinsip Desain\n- Gunakan skala warna konsisten (Hijau → Kuning → Oranye → Merah)\n- Tampilkan *what-why-what to do* dalam 1 layar\n- Optimasi untuk ponsel\n\n**Komponen:** peta, kartu status, feed artikel.`,
    tags: ["ux", "early-warning", "dashboard"],
    heroImage:
      "https://images.unsplash.com/photo-1502303756781-0e5b3113ba22?q=80&w=1200&auto=format&fit=crop",
    status: "draft",
    publishedAt: undefined,
    updatedAt: nowISO(),
  },
];

const STORAGE_KEY = "mini-article-cms-v1";

// ---------- Small UI Primitives (shadcn-like minimal stand-ins) ----------
function Input(props) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400 " +
        (props.className ?? "")
      }
    />
  );
}
function Textarea(props) {
  return (
    <textarea
      {...props}
      className={
        "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400 " +
        (props.className ?? "")
      }
    />
  );
}
function Button(props) {
  const { variant = "solid", className, ...rest } = props;
  const base = "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm";
  const styles =
    variant === "ghost"
      ? "hover:bg-slate-100 dark:hover:bg-slate-800"
      : variant === "outline"
      ? "border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
      : "bg-emerald-600 text-white hover:bg-emerald-700";
  return <button {...rest} className={`${base} ${styles} ${className ?? ""}`} />;
}
function Badge({ children }) {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      {children}
    </span>
  );
}

// ---------- Main Component ----------
export default function ArticleCMS() {
  const [articles, setArticles] = useState(() => {
    if (typeof window === "undefined") return SEED;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : SEED;
    } catch {
      return SEED;
    }
  });
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [currentId, setCurrentId] = useState(null);
  const current = useMemo(
    () => articles.find((a) => a.id === currentId) ?? null,
    [articles, currentId]
  );

  // Theme (to match requested style snippet)
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const last = typeof window !== "undefined" && localStorage.getItem("theme-dark") === "true";
    setDark(!!last);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", !!last);
    }
  }, []);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem("theme-dark", String(dark));
    }
  }, [dark]);

  // Autosave
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    }
  }, [articles]);

  // Derived list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = articles.filter((a) => {
      const matchQ = q
        ? [
            a.title.toLowerCase(),
            a.slug.toLowerCase(),
            a.author.toLowerCase(),
            a.summary.toLowerCase(),
            a.tags.join(" ").toLowerCase(),
          ].some((s) => s.includes(q))
        : true;
      const matchStatus = statusFilter === "all" ? true : a.status === statusFilter;
      return matchQ && matchStatus;
    });
    if (sortBy === "updated") {
      arr = [...arr].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else {
      arr = [...arr].sort((a, b) => a.title.localeCompare(b.title));
    }
    return arr;
  }, [articles, query, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Stats / recent for dashboard header
  const counts = useMemo(() => ({
    published: articles.filter((a) => a.status === "published").length,
    drafts: articles.filter((a) => a.status === "draft").length,
    pending: articles.filter((a) => a.status === "pending").length,
  }), [articles]);

  const recent = useMemo(
    () => [...articles].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5),
    [articles]
  );

  // CRUD helpers
  const createArticle = () => {
    const id = uid();
    const draft = {
      id,
      title: "Untitled Article",
      slug: `untitled-${id}`,
      author: "Author Name",
      summary: "Short summary goes here…",
      content: "Write in **Markdown** here…",
      tags: ["general"],
      heroImage:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
      status: "draft",
      publishedAt: undefined,
      updatedAt: nowISO(),
    };
    setArticles((prev) => [draft, ...prev]);
    setCurrentId(id);
    setPage(1);
  };

  const updateArticle = (id, patch) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: nowISO() } : a))
    );
  };

  const deleteArticle = (id) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    if (currentId === id) setCurrentId(null);
  };

  const importFromFile = async (file) => {
    const text = await file.text();
    try {
      const arr = JSON.parse(text);
      if (!Array.isArray(arr)) throw new Error("Invalid JSON");
      if (!arr.every((x) => x.id && x.title && x.slug)) throw new Error("Missing required fields");
      setArticles(arr);
      setCurrentId(arr[0]?.id ?? null);
      setPage(1);
    } catch (e) {
      alert("Failed to import JSON: " + e.message);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(articles, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "articles.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950 dark:text-slate-100">
      {/* Top Header (requested style) */}
      <div className="w-full p-4 sm:p-8 grid gap-6 max-w-7xl mx-auto">
        {/* Welcome + quick actions */}
        <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Welcome back, In&apos;am 👋</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage your articles and keep your content up to date.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={createArticle} className="rounded-2xl">
                <Plus className="h-4 w-4" /> New Article
              </Button>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                <Upload size={16} /> Import JSON
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) importFromFile(f);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
              <Button variant="outline" onClick={exportJson} className="rounded-2xl">
                <Download size={16} /> Export JSON
              </Button>
              <Button
                variant="outline"
                onClick={() => setDark((d) => !d)}
                className="rounded-2xl"
                title="Toggle dark mode"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Published Articles", value: counts.published },
            { title: "Drafts", value: counts.drafts },
            { title: "Pending Review", value: counts.pending },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">{s.title}</p>
              <p className="mt-2 text-2xl font-extrabold">{s.value}</p>
            </div>
          ))}
        </section>

        {/* Recent Articles */}
        <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Articles</h2>
            <a href="#articles" className="text-sm text-emerald-700 hover:underline dark:text-emerald-300">
              View all
            </a>
          </div>
          <ul className="grid gap-3">
            {recent.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <button className="flex flex-1 items-center gap-2 text-left" onClick={() => setCurrentId(a.id)}>
                  <FileText className="h-4 w-4 text-slate-500" />
                  <span className="font-medium line-clamp-1">{a.title}</span>
                </button>
                <span className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">{a.status}</span>
                  <button
                    className="rounded-md px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setCurrentId(a.id)}
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4 text-slate-500" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Main Grid (kept from your CMS, visually harmonized) */}
        <main id="articles" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Left Column: List & Filters */}
          <section className="md:col-span-1 rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60 p-3">
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
                          <Badge key={t}>#{t}</Badge>
                        ))}
                        {a.tags.length > 3 && <Badge>+{a.tags.length - 3}</Badge>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-3 flex items-center justify-between">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft size={16} /> Prev
                </Button>
                <div className="text-sm text-slate-600 dark:text-slate-300">Page {page} / {totalPages}</div>
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

          {/* Middle Column: Editor */}
          <section className="md:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              {current ? (
                <EditorPanel key={current.id} article={current} onChange={updateArticle} onDelete={deleteArticle} />
              ) : (
                <div className="flex h-[720px] items-center justify-center text-slate-500">
                  Select an article on the left or create a new one.
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Live Preview */}
          <section className="md:col-span-1">
            <div className="sticky top-[68px] rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="border-b border-slate-200 p-3 text-sm font-semibold dark:border-slate-800">
                <Eye className="mr-2 inline" size={16} /> Live Preview
              </div>
              {current ? (
                <ArticlePreview article={current} />
              ) : (
                <div className="p-6 text-slate-500">Nothing to preview.</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// ---------- Editor Panel ----------
function EditorPanel({ article, onChange, onDelete }) {
  const [local, setLocal] = useState(article);
  const didMount = useRef(false);

  useEffect(() => {
    setLocal(article);
  }, [article.id]);

  // Debounced propagate changes
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const t = setTimeout(() => onChange(article.id, local), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  const set = (patch) => setLocal((s) => ({ ...s, ...patch }));

  const toggleStatus = () => {
    if (local.status === "draft") {
      set({ status: "published", publishedAt: new Date().toISOString() });
    } else if (local.status === "published") {
      set({ status: "draft", publishedAt: undefined });
    } else {
      // allow cycling pending → published
      set({ status: "published", publishedAt: new Date().toISOString() });
    }
  };

  const addTag = (t) => {
    const nt = t.trim().toLowerCase();
    if (!nt) return;
    if (local.tags.includes(nt)) return;
    set({ tags: [...local.tags, nt] });
  };

  const removeTag = (t) => set({ tags: local.tags.filter((x) => x !== t) });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          <FileEdit className="mr-2 inline" size={16} /> Editor
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={toggleStatus}>
            <Save size={16} /> {local.status === "draft" ? "Publish" : "Unpublish"}
          </Button>
          <Button variant="outline" onClick={() => onDelete(article.id)}>
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <FileEdit size={14} /> Title
          </span>
          <Input value={local.title} onChange={(e) => set({ title: e.target.value, slug: toSlug(e.target.value) })} />
        </label>
        <label className="space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">/ Slug</span>
          <Input value={local.slug} onChange={(e) => set({ slug: toSlug(e.target.value) })} />
        </label>
        <label className="space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <User size={14} /> Author
          </span>
          <Input value={local.author} onChange={(e) => set({ author: e.target.value })} />
        </label>
        <label className="space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Calendar size={14} /> Published At (auto when publishing)
          </span>
          <Input
            type="datetime-local"
            value={local.publishedAt ? toLocalDatetime(local.publishedAt) : ""}
            onChange={(e) => set({ publishedAt: fromLocalDatetime(e.target.value) })}
          />
        </label>
        <label className="col-span-2 space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <ImageIcon size={14} /> Hero Image URL
          </span>
          <Input value={local.heroImage} onChange={(e) => set({ heroImage: e.target.value })} placeholder="https://…" />
        </label>
        <label className="col-span-2 space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">Summary</span>
          <Textarea rows={3} value={local.summary} onChange={(e) => set({ summary: e.target.value })} />
        </label>
        <div className="col-span-2">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Tags size={14} /> Tags
          </div>
          <TagEditor tags={local.tags} onAdd={addTag} onRemove={removeTag} />
        </div>
        <label className="col-span-2 space-y-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Body (Markdown)</span>
          <Textarea rows={16} value={local.content} onChange={(e) => set({ content: e.target.value })} className="font-mono" />
        </label>
      </div>
    </div>
  );
}

// ---------- Tag Editor ----------
function TagEditor({ tags, onAdd, onRemove }) {
  const [value, setValue] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">
            #{t}
            <button className="rounded-full p-1 hover:bg-slate-200 dark:hover:bg-slate-700" onClick={() => onRemove(t)} title="Remove">
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Input
          placeholder="Add a tag and press Enter"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(value);
              setValue("");
            }
          }}
        />
        <Button variant="outline" onClick={() => { onAdd(value); setValue(""); }}>
          Add
        </Button>
      </div>
    </div>
  );
}

// ---------- Preview ----------
function ArticlePreview({ article }) {
  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="p-4 sm:p-6">
          <div className="rounded-2xl bg-white/80 p-4 backdrop-blur dark:bg-slate-900/60">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
              Faculty of Agricultural Technology · UGM
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{article.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{article.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>By {article.author}</span>
              {article.publishedAt && (
                <>
                  <span>•</span>
                  <time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleString()}</time>
                </>
              )}
              <span>•</span>
              <span className="flex items-center gap-2">{article.tags.map((t) => (<Badge key={t}>#{t}</Badge>))}</span>
            </div>
            {article.heroImage && (
              <img src={article.heroImage} alt="hero" className="mt-4 aspect-[16/9] w-full rounded-xl object-cover" />
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="prose prose-slate max-w-none p-4 sm:p-6 dark:prose-invert">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </div>
  );
}

// ---------- Date helpers ----------
function toLocalDatetime(iso) {
  const d = new Date(iso);
  const pad = (n) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
function fromLocalDatetime(local) {
  const d = new Date(local);
  return d.toISOString();
}
