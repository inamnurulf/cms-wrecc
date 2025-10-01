"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FileEdit,
  Trash2,
  Save,
  Link as LinkIcon,
  Check,
  X,
  Plus,
  ExternalLink
} from "lucide-react";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Textarea from "../atoms/TextArea";

// Generic URL validator (accepts any http/https, not only Drive)
const isValidUrl = (url) => {
  try {
    const u = new URL(url);
    // Accept only Google Drive domain
    if (!u.hostname.includes("drive.google.com")) return false;
    // Must contain `/d/FILE_ID/` or `id=FILE_ID`
    return /\/d\/[a-zA-Z0-9_-]+/.test(u.pathname) || u.searchParams.has("id");
  } catch {
    return false;
  }
};


export default function FileEditorPanel({
  file,
  onChange,
  onDelete,
  onTogglePublish,
}) {
  const normalizeInitialLinks = (f)=> {
    if (Array.isArray(f?.links)) return f.links;
    if (f?.drive_link) {
      return [{ name: "Primary link", href: String(f.drive_link), description: null, meta: {} }];
    }
    return [];
    };
  
  const [local, setLocal] = useState(file ?? null);
  const [links, setLinks] = useState(normalizeInitialLinks(file));
  const [metaText, setMetaText] = useState(
    JSON.stringify(file?.metadata ?? {}, null, 2)
  );
  const [metaValid, setMetaValid] = useState(true);

  // used to prevent immediate debounce fire on mount/switch
  const didMount = useRef(false);

  // sync when switching selected file
  useEffect(() => {
    setLocal(file ?? null);
    setLinks(normalizeInitialLinks(file));
    setMetaText(JSON.stringify(file?.metadata ?? {}, null, 2));
    setMetaValid(true);
    didMount.current = false;
  }, [file?.id]); // only when id changes

  // helper setters
  const set = (patch) =>
    setLocal((s) => (s ? { ...s, ...patch } : s));

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

      // sanitize links: drop completely empty rows (no name & no href)
      const cleaned = (links || [])
        .filter((l) => (l?.name?.trim() || l?.href?.trim()))
        .map((l) => ({
          name: String(l.name || "").trim(),
          href: String(l.href || "").trim(),
          description:
            l.description == null || String(l.description).trim() === ""
              ? null
              : String(l.description),
          // keep meta as-is if present
          ...(l.meta ? { meta: l.meta } : {}),
        }));

      onChange?.(file.id, {
        title: local.title ?? "",
        slug: local.slug ?? "",
        description: local.description ?? "",
        links: cleaned,
        metadata: local.metadata ?? {},
      });
    }, 300);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, links, metaValid]);

  // Handlers
  const togglePublished = () => {
    if (!local) return;
    const next = !local.is_published;
    set({ is_published: next });
    onTogglePublish?.(file.id, next);
  };

  const addLink = () => {
    setLinks((arr) => [...arr, { name: "", href: "", description: "" }]);
  };

  const updateLink = (idx, patch) => {
    setLinks((arr) => {
      const next = [...arr];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  const removeLink = (idx) => {
    setLinks((arr) => arr.filter((_, i) => i !== idx));
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
          <Button
            variant="outline"
            onClick={togglePublished}
            title="Toggle publish"
          >
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

        {/* Links (replaces Drive Link) */}
        <div className="col-span-2 space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <LinkIcon size={14} /> Links
            </span>
            <Button variant="outline" onClick={addLink} title="Add new link">
              <Plus size={16} /> Add link
            </Button>
          </div>

          {links.length === 0 && (
            <p className="text-xs text-slate-500">
              No links yet. Click “Add link” to create one.
            </p>
          )}

          <div className="space-y-3">
            {links.map((l, idx) => {
              const badName = !String(l.name || "").trim();
              const badHref = !isValidUrl(l.href || "");
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div className="grid grid-cols-12 gap-2">
                    {/* Name */}
                    <label className="col-span-3 space-y-1">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        Name
                      </span>
                      <Input
                        value={l.name || ""}
                        onChange={(e) => updateLink(idx, { name: e.target.value })}
                        className={badName ? "border-rose-300 bg-rose-50/40 dark:border-rose-800 dark:bg-rose-900/30" : ""}
                      />
                    </label>

                    {/* Href */}
                    <label className="col-span-7 space-y-1">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        URL
                      </span>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://…"
                          value={l.href || ""}
                          onChange={(e) => updateLink(idx, { href: e.target.value })}
                          className={
                            badHref
                              ? "border-rose-300 bg-rose-50/40 focus:ring-rose-400 dark:border-rose-800 dark:bg-rose-900/30"
                              : ""
                          }
                        />
                        <a
                          href={badHref ? "#" : l.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => badHref && e.preventDefault()}
                          className="inline-flex items-center rounded-xl border border-slate-200 px-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                          title="Open link"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                      {badHref && (
                        <p className="text-xs text-rose-600">
                          Must start with http:// or https://
                        </p>
                      )}
                    </label>

                    {/* Delete */}
                    <div className="col-span-2 flex items-end justify-end">
                      <Button
                        variant="outline"
                        onClick={() => removeLink(idx)}
                        title="Remove link"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    {/* Description (full width under) */}
                    <label className="col-span-12 space-y-1">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        Description (optional)
                      </span>
                      <Input
                        value={l.description || ""}
                        onChange={(e) =>
                          updateLink(idx, { description: e.target.value })
                        }
                      />
                    </label>
                  </div>

                  {/* Per-link meta (optional): uncomment to expose JSON meta per link */}
                  {/*
                  <div className="mt-2">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      Meta (JSON, optional)
                    </span>
                    <Textarea
                      rows={5}
                      className="font-mono"
                      value={JSON.stringify(l.meta ?? {}, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value || "{}");
                          updateLink(idx, { meta: parsed });
                        } catch {
                          // keep previous meta if invalid; you can add error UI if desired
                        }
                      }}
                    />
                  </div>
                  */}
                </div>
              );
            })}
          </div>
        </div>

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

              const cleaned = (links || [])
                .filter((l) => (l?.name?.trim() || l?.href?.trim()))
                .map((l) => ({
                  name: String(l.name || "").trim(),
                  href: String(l.href || "").trim(),
                  description:
                    l.description == null || String(l.description).trim() === ""
                      ? null
                      : String(l.description),
                  ...(l.meta ? { meta: l.meta } : {}),
                }));

              onChange(file.id, {
                title: local.title ?? "",
                slug: local.slug ?? "",
                description: local.description ?? "",
                links: cleaned,
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
