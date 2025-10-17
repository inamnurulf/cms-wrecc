"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  FileEdit,
  Trash2,
  User,
  Calendar,
  Image as ImageIcon,
  Tags,
  Save,
  Link as LinkIcon,
  FileText,
} from "lucide-react";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Textarea from "../atoms/TextArea";
import TagEditor from "./TagEditor";
import ImageUploader from "./ImageUploader";

export default function EditorPanel({
  article,
  onChange,
  onDelete,
  onToggleStatus,
}) {
  const [local, setLocal] = useState({
    ...article,
    source: article?.source ?? (article?.external_link ? "drive" : "inline"),
  });

  const didMount = useRef(false);

  useEffect(() => {
    setLocal({
      ...article,
      source: article?.source ?? (article?.external_link ? "drive" : "inline"),
    });
    didMount.current = false; // prevent immediate debounce fire
  }, [article.id]);

  // Debounced propagate changes
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const t = setTimeout(() => {
      onChange?.(article.id, {
        title: local.title,
        slug: local.slug,
        author: local.author,
        summary: local.summary,
        content: local.source === "inline" ? local.content : null, // inline only
        status: local.status,
        tags: local.tags,
        image_ids: local.image_ids || [],
        hero_image_id: local.hero_image_id || null,
        source: local.source,
        external_link:
          local.source === "drive" ? local.external_link || null : null,
      });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  const set = (patch) => setLocal((s) => ({ ...s, ...patch }));

  const toSlug = (s) =>
    String(s || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const toLocalDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => n.toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    return `${yyyy}-${mm}-${dd}`;
  };

  const hasTag = (name) => {
    const key = String(name || "")
      .trim()
      .toLowerCase();
    return (local.tags || []).some(
      (t) => String(t).trim().toLowerCase() === key
    );
  };

  const addTag = (t) => {
    const cleaned = String(t || "")
      .trim()
      .replace(/\s+/g, " ");
    if (!cleaned) return;
    if (hasTag(cleaned)) return;
    if (cleaned.length > 64) return;
    set({ tags: [...(local.tags || []), cleaned] });
  };

  const removeTag = (t) => {
    set({ tags: (local.tags || []).filter((x) => x !== t) });
  };

  const toggleStatus = () => {
    const next =
      local.status === "draft"
        ? "published"
        : local.status === "published"
        ? "draft"
        : "published";
    set({ status: next });
    onToggleStatus?.(article.id, next);
  };

  const onImagesChange = (nextIds, nextHeroId) => {
    set({ image_ids: nextIds, hero_image_id: nextHeroId });
  };

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const heroPreview = local.hero_image_id
    ? `${API}/v1/images/${local.hero_image_id}`
    : "";

  const drivePreview = (url) => {
    if (!url) return "";
    // If it already has /preview, keep it; else swap /view → /preview
    if (/\/preview($|\?)/.test(url)) return url;
    return url.replace(/\/view(\?.*)?$/, "/preview");
  };

  const onToggleSource = (next) => {
    // When switching to drive, we keep content in state but won't send it (controller ignores).
    // When switching to inline, leave external_link (not sent) so user doesn't lose it visually if they bounce back.
    set({ source: next });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          <FileEdit className="mr-2 inline" size={16} /> Editor
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={toggleStatus}>
            <Save size={16} />{" "}
            {local.status === "draft" ? "Publish" : "Unpublish"}
          </Button>
          <Button variant="outline" onClick={() => onDelete?.(article.id)}>
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <FileEdit size={14} /> Title
          </span>
          <Input
            value={local.title || ""}
            onChange={(e) =>
              set({ title: e.target.value, slug: toSlug(e.target.value) })
            }
          />
        </label>

        <label className="space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            / Slug
          </span>
          <Input
            value={local.slug || ""}
            onChange={(e) => set({ slug: toSlug(e.target.value) })}
          />
        </label>

        <label className="space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <User size={14} /> Author
          </span>
          <Input
            value={local.author || ""}
            onChange={(e) => set({ author: e.target.value })}
          />
        </label>

        <label className="space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Calendar size={14} /> Published At (server-controlled)
          </span>
          <Input
            type="date"
            value={toLocalDate(local.published_at)}
            readOnly
            disabled
          />
        </label>

        {/* Images */}
        <label className="col-span-2 space-y-1">
          <div className="col-span-2 space-y-1">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              <ImageIcon size={14} /> Images (upload & attach)
            </span>
            <ImageUploader
              articleId={article.id}
              valueIds={local.image_ids || []}
              heroId={local.hero_image_id || null}
              onChange={onImagesChange}
            />
            {heroPreview && (
              <div className="mt-2">
                <span className="text-xs opacity-70">Hero preview:</span>
                <img
                  src={heroPreview}
                  alt="hero"
                  className="mt-1 h-36 w-full rounded-lg object-cover"
                />
              </div>
            )}
          </div>
        </label>

        {/* Summary */}
        <label className="col-span-2 space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            Summary
          </span>
          <Textarea
            rows={3}
            value={local.summary || ""}
            onChange={(e) => set({ summary: e.target.value })}
          />
        </label>

        {/* Tags */}
        <div className="col-span-2">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Tags size={14} /> Tags (names only)
          </div>
          <TagEditor
            tags={local.tags || []}
            onAdd={addTag}
            onRemove={removeTag}
          />
        </div>

        {/* Source Toggle */}
        <div className="col-span-2">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            Source
          </div>
          <div className="inline-flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600">
            <button
              type="button"
              onClick={() => onToggleSource("inline")}
              className={`px-3 py-1.5 text-sm flex items-center gap-1 ${
                local.source === "inline"
                  ? "bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900"
                  : "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              <FileText size={14} /> Content
            </button>
            <button
              type="button"
              onClick={() => onToggleSource("drive")}
              className={`px-3 py-1.5 text-sm flex items-center gap-1 border-l border-slate-300 dark:border-slate-600 ${
                local.source === "drive"
                  ? "bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900"
                  : "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              <LinkIcon size={14} /> Link
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {local.source === "inline"
              ? "Write article body below."
              : "Paste a Google Drive share link (we’ll render the preview)."}
          </p>
        </div>

        {/* External link (Drive) */}
        {local.source === "drive" && (
          <>
            <label className="col-span-2 space-y-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                External Link (Google Drive share link)
              </span>
              <Input
                value={local.external_link || ""}
                onChange={(e) => set({ external_link: e.target.value })}
                placeholder="https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing"
              />
            </label>

            {local.external_link && (
              <div className="col-span-2">
                <div className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                  Live Preview
                </div>
                <div className="relative w-full h-[55vh] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                  <iframe
                    src={drivePreview(local.external_link)}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay"
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Body (Markdown) */}
        {local.source === "inline" && (
          <label className="col-span-2 space-y-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Body (Markdown)
            </span>
            <Textarea
              rows={16}
              value={local.content || ""}
              onChange={(e) => set({ content: e.target.value })}
              className="font-mono"
              placeholder=""
            />
          </label>
        )}
      </div>
    </div>
  );
}
