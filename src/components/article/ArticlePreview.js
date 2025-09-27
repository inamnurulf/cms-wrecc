"use client";
import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import Badge from "../atoms/Badge";
import { getImageUrl } from "@/services/images.api";

export default function ArticlePreview({ article = {} }) {
  // Normalize fields coming from API vs legacy
  const {
    title = "",
    summary = "",
    author = "",
    content = "",
    tags = [],
    published_at,
    publishedAt, // legacy
    hero_image_id,
    image_ids = [],
    heroImage, // legacy URL fallback
  } = article;

  const displayDateISO = published_at || publishedAt || null;

  // Pick hero: prefer explicit hero_image_id, then first/only image_ids, else legacy heroImage URL
  const heroSrc = useMemo(() => {
    if (hero_image_id) return getImageUrl(hero_image_id);
    const firstId =
      Array.isArray(image_ids) && image_ids.length ? image_ids[0] : null;
    if (firstId) return getImageUrl(firstId);
    if (heroImage) return heroImage; // legacy absolute URL
    return null;
  }, [hero_image_id, image_ids, heroImage]);

  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="p-4 sm:p-6">
          <div className="rounded-2xl bg-white/80 p-4 backdrop-blur dark:bg-slate-900/60">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
              Faculty of Agricultural Technology · UGM
            </span>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {title || "Untitled Article"}
            </h1>

            {summary ? (
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                {summary}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              {author ? <span>By {author}</span> : null}
              {displayDateISO ? (
                <>
                  <span>•</span>
                  <time dateTime={displayDateISO}>
                    {new Date(displayDateISO).toLocaleString()}
                  </time>
                </>
              ) : null}
              {safeTags.length ? (
                <>
                  <span>•</span>
                  <span className="flex flex-wrap items-center gap-2">
                    {safeTags.map((t) => (
                      <Badge key={String(t)}>#{t}</Badge>
                    ))}
                  </span>
                </>
              ) : null}
            </div>

            {heroSrc && (
              <img
                src={heroSrc}
                alt="hero"
                className="mt-4 aspect-[16/9] w-full rounded-xl object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="prose prose-slate max-w-none p-4 sm:p-6 dark:prose-invert">
        <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-3xl font-extrabold tracking-tight mt-8 mb-4"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl font-semibold mt-6 mb-3"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-xl font-semibold mt-5 mb-2"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p className=" leading-8 mb-4" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside space-y-1  mb-4 pl-4"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside space-y-1  mb-4 pl-4"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="ml-2" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-emerald-400 pl-4 italic my-4"
                      {...props}
                    />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code
                        className="rounded px-1.5 py-0.5 text-sm font-mono text-emerald-700"
                        {...props}
                      />
                    ) : (
                      <span className="rounded-xl p-4 overflow-x-auto my-4">
                        <code className="font-mono text-sm" {...props} />
                      </span>
                    ),
                  a: ({ node, ...props }) => (
                    <a
                      className="hover:underline font-medium"
                      {...props}
                    />
                  ),
                  img: ({ node, ...props }) => (
                    <img
                      className="rounded-xl shadow my-6 max-w-full"
                      {...props}
                    />
                  ),
                  table: ({ node, ...props }) => (
                    <table
                      className="w-full border-collapse border border-gray-200 text-sm my-6"
                      {...props}
                    />
                  ),
                  thead: ({ node, ...props }) => (
                    <thead
                      className="bg-gray-100  font-semibold"
                      {...props}
                    />
                  ),
                  tbody: ({ node, ...props }) => (
                    <tbody className="divide-y divide-gray-200" {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="border-b last:border-0" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      className="border border-gray-200 px-3 py-2 text-left"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      className="border border-gray-200 px-3 py-2"
                      {...props}
                    />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-8 border-gray-200" {...props} />
                  ),
                }}
              >{content || ""}</ReactMarkdown>
      </div>
    </div>
  );
}
