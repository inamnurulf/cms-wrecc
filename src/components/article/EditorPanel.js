"use client";
import React, { useEffect, useRef, useState } from "react";
import { FileEdit, Trash2, User, Calendar, Image as ImageIcon, Tags, Save } from "lucide-react";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Textarea from "../atoms/TextArea";
import TagEditor from "./TagEditor";

export default function EditorPanel({ article, onChange, onDelete }) {
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

  const toSlug = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

    
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