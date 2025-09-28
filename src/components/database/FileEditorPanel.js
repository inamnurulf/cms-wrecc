"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FileEdit,
  Trash2,
  Save,
  Link as LinkIcon,
  Check,
  X,
} from "lucide-react";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Textarea from "../atoms/TextArea";

export default function FileEditorPanel({
  file,
  onChange,
  onDelete,
  onTogglePublish,
}) {
  const [local, setLocal] = useState(file ?? null);
  const [metaText, setMetaText] = useState(JSON.stringify(file?.metadata ?? {}, null, 2));
  const [metaValid, setMetaValid] = useState(true);

  // used to prevent immediate debounce fire on mount/switch
  const didMount = useRef(false);

  // sync when switching selected file
  useEffect(() => {
    setLocal(file ?? null);
    setMetaText(JSON.stringify(file?.metadata ?? {}, null, 2));
    setMetaValid(true);
    didMount.current = false;
  }, [file?.id]); // only when id changes

  // helper setters
  const set = (patch) => setLocal((s) => (s ? { ...s, ...patch } : s));

  const toSlug = (s) =>
    String(s || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  // Debounced propagate changes (autosave)
  useEffect(() => {
    if (!local || !file?.id) return;
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const t = setTimeout(() => {
      if (!metaValid) return; // don't save while JSON invalid
      onChange?.(file.id, {
        title: local.title ?? "",
        slug: local.slug ?? "",
        description: local.description ?? "",
        drive_link: local.drive_link ?? "",
        metadata: local.metadata ?? {},
      });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, metaValid]);

  // Handlers
  const togglePublished = () => {
    if (!local) return;
    const next = !local.is_published;
    set({ is_published: next });
    onTogglePublish?.(file.id, next);
  };

  if (!file || !local) {
    return (
      <div className="flex h-[720px] items-center justify-center text-slate-500">
        Select a file on the left or create a new one.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          <FileEdit className="mr-2 inline" size={16} />
          File Editor
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={togglePublished} title="Toggle publish">
            {local.is_published ? <Check size={16} /> : <X size={16} />}
            {local.is_published ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="outline" onClick={() => onDelete?.(file.id)}>
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-2 gap-3">
        {/* Title */}
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

        {/* Slug */}
        <label className="space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            / Slug
          </span>
          <div className="flex gap-2">
            <Input
              value={local.slug || ""}
              onChange={(e) => set({ slug: toSlug(e.target.value) })}
            />
            <Button
              variant="outline"
              onClick={() => set({ slug: toSlug(local.title || "") })}
              title="Auto from title"
            >
              Auto
            </Button>
          </div>
        </label>

        {/* Drive Link */}
        <label className="col-span-2 space-y-1">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <LinkIcon size={14} /> Drive Link
          </span>
          <div className="flex gap-2">
            <Input
              placeholder="https://drive.google.com/..."
              value={local.drive_link || ""}
              onChange={(e) => set({ drive_link: e.target.value })}
            />
            <a
              href={local.drive_link || "#"}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => !local.drive_link && e.preventDefault()}
              className="inline-flex items-center rounded-xl border border-slate-200 px-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              title="Open link"
            >
              <LinkIcon size={16} />
            </a>
          </div>
        </label>

        {/* Description */}
        <label className="col-span-2 space-y-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Description
          </span>
          <Textarea
            rows={3}
            value={local.description || ""}
            onChange={(e) => set({ description: e.target.value })}
          />
        </label>

        {/* Metadata (JSON) */}
        <label className="col-span-2 space-y-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Metadata (JSON) {metaValid ? "" : "— invalid JSON"}
          </span>
          <Textarea
            rows={10}
            value={metaText}
            onChange={(e) => {
              const v = e.target.value;
              setMetaText(v);
              try {
                const parsed = JSON.parse(v || "{}");
                setMetaValid(true);
                set({ metadata: parsed });
              } catch {
                setMetaValid(false);
              }
            }}
            className={`font-mono ${
              metaValid
                ? ""
                : "border-rose-300 bg-rose-50/40 focus:ring-rose-400 dark:border-rose-800 dark:bg-rose-900/30"
            }`}
          />
        </label>

        {/* Manual Save */}
        <div className="col-span-2 flex items-center justify-end">
          <Button
            onClick={() => {
              if (!file?.id || !local || !metaValid) return;
              onChange(file.id, {
                title: local.title ?? "",
                slug: local.slug ?? "",
                description: local.description ?? "",
                drive_link: local.drive_link ?? "",
                metadata: local.metadata ?? {},
              });
            }}
            disabled={!metaValid}
          >
            <Save size={16} /> Save
          </Button>
        </div>
      </div>
    </div>
  );
}
