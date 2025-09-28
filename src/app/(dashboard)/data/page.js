"use client";
import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Eye, Plus, Sun, Moon } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Store / RTK
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setPublicFilesFilters,
  setPublicFileCurrentId,
} from "@/store/slices/publicFiles.slice";
import {
  useListPublicFilesQuery,
  useCreatePublicFileMutation,
  useUpdatePublicFileMutation,
  useDeletePublicFileMutation,
  useSetPublicFilePublishedMutation,
} from "@/services/publicFiles.api";

// Your UI
import FilesList from "@/components/database/FileList";
import FileEditorPanel from "@/components/database/FileEditorPanel";
import FilePreview from "@/components/database/FilePreview";
import FilesListSkeleton from "@/components/database/FileListSkeleton";
import FilePreviewSkeleton from "@/components/database/FilePreviewSkeleton";
import BusyOverlay from "@/components/database/BusyOverlay";





// ---------- Helpers ----------
const toSlug = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/* -------------------------------------------------------
   Main CMS (like ArticleCMS but without Welcome/Recent)
------------------------------------------------------- */
export default function PublicFilesCMS() {
  const searchParams = useSearchParams();
  const requestedEdit = searchParams.get("edit");

  // Theme
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

  // Redux filters & selection
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.publicFiles.filters);
  const currentId = useAppSelector((s) => s.publicFiles.currentId);

  const setQuery = (q) => dispatch(setPublicFilesFilters({ q, page: 1 }));
  const setPublishedFilter = (published) =>
    dispatch(setPublicFilesFilters({ published, page: 1 }));
  const setSortBy = (sort) =>
    dispatch(setPublicFilesFilters({ sort, page: 1 }));
  const setPage = (page) => dispatch(setPublicFilesFilters({ page }));
  const setPageSize = (limit) =>
    dispatch(setPublicFilesFilters({ limit, page: 1 }));
  const setCurrentId = (id) => dispatch(setPublicFileCurrentId(id));

  // Data (RTK Query)
  const { items, total, page, limit, isFetching } = useListPublicFilesQuery(
    filters,
    {
      selectFromResult: ({ data, isFetching }) => ({
        items: data?.items ?? [],
        total: data?.total ?? 0,
        page: data?.page ?? filters.page ?? 1,
        limit: data?.limit ?? filters.limit ?? 10,
        isFetching,
      }),
    }
  );
  const loading = isFetching && (!items || items.length === 0);
  const backgroundRefreshing = isFetching && items && items.length > 0;

  // Deep-link: ?edit=<id> -> select and scroll to editor
  useEffect(() => {
    if (!requestedEdit || !items?.length) return;
    const match = items.find((a) => String(a.id) === String(requestedEdit));
    if (match) {
      setCurrentId(match.id);
      if (typeof document !== "undefined") {
        document.querySelector("#files-cms")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [requestedEdit, items]);

  // Mutations
  const [createFile, { isLoading: creating }] = useCreatePublicFileMutation();
  const [updateFile, { isLoading: updating }] = useUpdatePublicFileMutation();
  const [deleteFile, { isLoading: deleting }] = useDeletePublicFileMutation();
  const [setPublished] = useSetPublicFilePublishedMutation();

  const totalPages = Math.max(1, Math.ceil((total ?? 0) / (limit || 10)));
  const current = useMemo(
    () => (currentId ? items.find((a) => a.id === currentId) ?? null : null),
    [items, currentId]
  );

  // CRUD handlers
  const onCreate = async () => {
    const base = "Untitled File";
    const slug = toSlug(`${base}-${Date.now().toString(36).slice(-4)}`);
    const row = await createFile({
      title: base,
      slug,
      description: "",
      drive_link: "https://drive.google.com/",
      is_published: false,
      metadata: {},
    }).unwrap();
    setCurrentId(row.id);
    setPage(1);
  };

  const onChange = async (id, patch) => {
    const body = {
      title: patch.title,
      slug: patch.slug,
      description: patch.description,
      drive_link: patch.drive_link,
      metadata: patch.metadata,
    };
    await updateFile({ id, body }).unwrap();
  };

  const onTogglePublish = async (id, next) => {
    await setPublished({ id, is_published: next }).unwrap();
  };

  const onDelete = async (id) => {
    await deleteFile(id).unwrap();
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
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              disabled={creating}
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
        <main id="files-cms" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Left: List & Filters */}
          <section className="relative md:col-span-1">
            {loading ? (
              <FilesListSkeleton />
            ) : (
              <>
                <BusyOverlay show={backgroundRefreshing} />
                <FilesList
                  items={items}
                  query={filters.q || ""}
                  setQuery={setQuery}
                  publishedFilter={filters.published || "all"}
                  setPublishedFilter={setPublishedFilter}
                  sortBy={filters.sort || "created_desc"}
                  setSortBy={setSortBy}
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                  currentId={currentId}
                  setCurrentId={setCurrentId}
                  onCreate={onCreate}
                  refreshing={backgroundRefreshing}
                  setPageSize={setPageSize} // optional: if your list supports changing page size
                />
              </>
            )}
          </section>

          {/* Middle: Editor */}
          <section className="md:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              {current ? (
                <FileEditorPanel
                  key={current.id}
                  file={current}
                  onChange={onChange}
                  onDelete={onDelete}
                  onTogglePublish={onTogglePublish}
                />
              ) : (
                <div className="flex h-[720px] items-center justify-center text-slate-500">
                  Select a file on the left or create a new one.
                </div>
              )}
            </div>
          </section>

          {/* Right: Live Preview */}
          <section className="md:col-span-1">
            <div className="sticky top-[68px] rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="border-b border-slate-200 p-3 text-sm font-semibold dark:border-slate-800">
                <Eye className="mr-2 inline" size={16} />Preview
              </div>
              {loading ? (
                <FilePreviewSkeleton paragraphs={3} />
              ) : current ? (
                <>
                  <BusyOverlay show={backgroundRefreshing} />
                  <FilePreview file={current} />
                </>
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
