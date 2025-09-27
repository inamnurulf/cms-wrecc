"use client";
import React, { useRef, useState } from "react";
import {
  useUploadImageMutation,
  useDeleteImageMutation,
  getImageUrl,
} from "@/services/images.api";

export default function ImageUploader({
  articleId,
  valueIds = [],     // existing image_ids (we'll keep at most 1)
  heroId = null,     // current hero id (we'll set to the uploaded one)
  onChange,          // (nextIds, nextHeroId) => void
}) {
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const [deleteImage, { isLoading: deleting }] = useDeleteImageMutation();
  const [err, setErr] = useState("");
  const fileRef = useRef(null);

  const disabled = uploading || deleting;

  const pickFile = () => fileRef.current?.click();

  const upload = async (file) => {
    if (!file) return;
    if (!articleId) {
      setErr("Article ID is required before uploading.");
      return;
    }
    setErr("");
    try {
      // Backend should enforce "single image per article" by deleting previous image(s)
      const created = await uploadImage({ file, article_id: articleId }).unwrap();
      const newId = created?.data?.id;
      if (!newId) throw new Error("Upload succeeded but no id returned.");

      // Overwrite semantics: keep only the latest image
      const nextIds = [newId];
      const nextHero = newId;
      onChange?.(nextIds, nextHero);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    await upload(file);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    await upload(file);
  };

  const remove = async (id) => {
    setErr("");
    try {
      await deleteImage(id).unwrap();
      // After delete, no image attached
      onChange?.([], null);
    } catch (e) {
      setErr(e?.message || String(e));
    }
  };

  const currentId = valueIds?.[0] ?? null;
  const previewUrl = currentId ? getImageUrl(currentId) : null;

  return (
    <div className="space-y-2">
      <div
        className={`rounded-xl border border-dashed p-4 text-center ${
          disabled ? "opacity-80" : ""
        } border-slate-300 dark:border-slate-700`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <p className="text-sm opacity-80">
          Drag & drop an image here, or{" "}
          <button
            type="button"
            className="underline"
            onClick={pickFile}
            disabled={disabled}
          >
            browse
          </button>
          .
        </p>
        {!articleId && (
          <p className="mt-2 text-xs text-amber-600">
            Select or create an article first.
          </p>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onPick}
          disabled={disabled}
        />
        {(uploading || deleting) && (
          <p className="text-xs mt-2">Working…</p>
        )}
        {err && <p className="text-xs mt-2 text-rose-600">{err}</p>}
      </div>

      {/* Single preview block (overwrite semantics) */}
      {previewUrl ? (
        <div className="rounded-lg border p-2">
          <img
            src={previewUrl}
            alt="article-image"
            className="h-36 w-full rounded object-cover"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs bg-emerald-600 text-white rounded px-2 py-1">
              Hero ✓
            </span>
            <button
              type="button"
              className="text-xs rounded px-2 py-1 bg-rose-600 text-white"
              onClick={() => remove(currentId)}
              disabled={disabled}
              title="Delete image"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500">No image attached.</p>
      )}
    </div>
  );
}
