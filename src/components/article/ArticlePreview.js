"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import Badge from "../atoms/Badge";


export default function ArticlePreview({ article }) {
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