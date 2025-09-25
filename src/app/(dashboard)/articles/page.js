"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";

import WelcomeCard from "@/components/WelcomeCard";
import StatsGrid from "@/components/StatsGrid";
import RecentArticles from "@/components/article/RecentArtticles"; // 👈 fix typo in file/name
import ArticleList from "@/components/article/ArticleList";
import EditorPanel from "@/components/article/EditorPanel";
import ArticlePreview from "@/components/article/ArticlePreview";

import {
  useListArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} from "@/services/articles.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilters, setCurrentId } from "@/store/slices/articles.slice";

// ---------- Helpers ----------
const toSlug = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// ---------- Main Component ----------
export default function ArticleCMS() {
  const dispatch = useAppDispatch();

  // Pull filters/state from slice
  const filters = useAppSelector((s) => s.article.filters);
  const currentId = useAppSelector((s) => s.article.currentId);

  // Local UI state
  const [sortBy, setSortBy] = useState("updated"); // 👈 fixed

  // Slice helpers
  const setQuery = (q) => dispatch(setFilters({ q, page: 1 }));
  const setStatus = (status) =>
    dispatch(setFilters({ status: status === "all" ? "" : status, page: 1 }));
  const setPage = (page) => dispatch(setFilters({ page }));
  const setPageSize = (limit) => dispatch(setFilters({ limit, page: 1 }));
  const setCurrentIdLocal = (id) => dispatch(setCurrentId(id));

  // Data (RTK Query)
  const { items, total, page, limit, isFetching } = useListArticlesQuery(
    filters,
    {
      selectFromResult: ({ data, isFetching }) => ({
        items: data?.data?.items ?? [],
        total: data?.data?.total ?? 0,
        page: data?.data?.page ?? filters.page ?? 1,
        limit: data?.data?.limit ?? filters.limit ?? 10,
        isFetching,
      }),
    }
  );

  // Auth user
  const user = useAppSelector((state) => state.auth.user) || {
    name: "Guest",
    role: "User",
  };
  const displayName = user.display_name || user.name || "Guest";

  // Theme
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const last =
      typeof window !== "undefined" &&
      localStorage.getItem("theme-dark") === "true";
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

  // Sorting for the list component (server already filters/paginates)
  const pageItems = useMemo(() => {
    const base = items ?? [];
    if (sortBy === "title")
      return [...base].sort((a, b) => a.title.localeCompare(b.title));
    // Assume backend already sorts by updatedAt desc; if not, do it here:
    return [...base].sort(
      (a, b) =>
        new Date(b.updated_at ?? b.updatedAt ?? 0).getTime() -
        new Date(a.updated_at ?? a.updatedAt ?? 0).getTime()
    );
  }, [items, sortBy]);

  const totalPages = Math.max(1, Math.ceil((total ?? 0) / (limit || 10)));

  const current = useMemo(
    () => (currentId ? items.find((a) => a.id === currentId) ?? null : null),
    [items, currentId]
  );
  const active = current;

  // Dashboard stats + recent
  const counts = useMemo(
    () => ({
      published: items.filter((a) => a.status === "published").length,
      drafts: items.filter((a) => a.status === "draft").length,
      pending: items.filter((a) => a.status === "pending").length,
    }),
    [items]
  );

  const recent = useMemo(
    () =>
      [...items]
        .sort(
          (a, b) =>
            new Date(b.updated_at || b.updatedAt || 0).getTime() -
            new Date(a.updated_at || a.updatedAt || 0).getTime()
        )
        .slice(0, 5),
    [items]
  );

  // CRUD (server)
  const [createArticle, { isLoading: creating }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: updating }] = useUpdateArticleMutation();
  const [deleteArticle, { isLoading: deleting }] = useDeleteArticleMutation();

  const onCreate = async () => {
    const res = await createArticle({
      title: "Untitled Article",
      slug: toSlug("Untitled Article"),
      summary: "Short summary goes here…",
      content: "Write in **Markdown** here…",
      category_id: null,
      tag_ids: [],
      image_ids: [],
      status: "draft",
    }).unwrap();
    setCurrentIdLocal(res.id);
    setPage(1);
  };

  const onUpdate = async (id, patch) => {
    await updateArticle({ id, body: patch }).unwrap();
  };

  const onDelete = async (id) => {
    await deleteArticle(id).unwrap();
    if (currentId === id) setCurrentIdLocal(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950 dark:text-slate-100">
      <div className="w-full p-4 sm:p-8 grid gap-6 max-w-7xl mx-auto">
        {/* Welcome + quick actions */}
        <WelcomeCard
          display_name={displayName}
          onCreate={onCreate}
          creating={creating}
        />
        {/* Stats */}
        <StatsGrid
          stats={[
            { title: "Published Articles", value: counts.published },
            { title: "Drafts", value: counts.drafts },
            { title: "Pending Review", value: counts.pending },
          ]}
        />
        {/* Recent Articles */}
        <RecentArticles recent={recent} setCurrentId={setCurrentIdLocal} />{" "}
        {/* 👈 pass dispatcher */}
        {/* Main Grid */}
        <main id="articles" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Left: List & Filters */}
          <ArticleList
            query={filters.q ?? ""}
            setQuery={setQuery}
            statusFilter={filters.status || "all"}
            setStatusFilter={setStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            pageItems={pageItems}
            currentId={currentId}
            setCurrentId={setCurrentIdLocal}
            loading={isFetching}
            setPageSize={setPageSize}
          />

          {/* Middle: Editor */}
          <section className="md:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              {active ? (
                <EditorPanel
                  key={active.id}
                  article={active}
                  onChange={(id, patch) => onUpdate(id, patch)}
                  onDelete={(id) => onDelete(id)}
                />
              ) : (
                <div className="flex h-[720px] items-center justify-center text-slate-500">
                  Select an article on the left or create a new one.
                </div>
              )}
            </div>
          </section>

          {/* Right: Live Preview */}
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
