// components/article/RecentArticles.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FileText, Edit3 } from "lucide-react";


export default function RecentArticles({ recent, setCurrentId }) {
  const router = useRouter();

  const open = (id) => {
    if (setCurrentId) {
      // We're already on the /articles page (CMS). Just select.
      setCurrentId(id);
    } else {
      // We're on the dashboard (home). Jump to /articles and preselect.
      router.push(`/articles?edit=${encodeURIComponent(String(id))}#articles`);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Recent Articles</h2>
        <a
          href="/articles#articles"
          className="text-sm text-emerald-700 hover:underline dark:text-emerald-300"
        >
          View all
        </a>
      </div>

      <ul className="grid gap-3">
        {recent.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <button
              className="flex flex-1 items-center gap-2 text-left"
              onClick={() => open(a.id)}
            >
              <FileText className="h-4 w-4 text-slate-500" />
              <span className="font-medium line-clamp-1">{a.title}</span>
            </button>

            <span className="flex items-center gap-2 text-xs">
              {a.status && (
                <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                  {a.status}
                </span>
              )}
              <button
                className="rounded-md px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => open(a.id)}
                title="Edit"
              >
                <Edit3 className="h-4 w-4 text-slate-500" />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
