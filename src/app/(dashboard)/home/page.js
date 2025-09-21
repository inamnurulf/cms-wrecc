"use client";
import React, { useEffect, useState } from "react";
import { Plus, FileText, Edit3 } from "lucide-react";

export default function ArticlesDashboard() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const last = localStorage.getItem("theme-dark") === "true";
    setDark(last);
    document.documentElement.classList.toggle("dark", last);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme-dark", String(dark));
  }, [dark]);

  return (
    <div className="w-full m-8 grid gap-6">
      {/* Welcome + quick actions */}
      <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Welcome back, In&apos;am 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your articles and keep your content up to date.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              <Plus className="mr-1 inline h-4 w-4" /> New Article
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Published Articles", value: 24 },
          { title: "Drafts", value: 6 },
          { title: "Pending Review", value: 3 },
        ].map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {s.title}
            </p>
            <p className="mt-2 text-2xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </section>

      {/* Recent Articles */}
      <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Articles</h2>
          <a
            href="#articles"
            className="text-sm text-emerald-700 hover:underline dark:text-emerald-300"
          >
            View all
          </a>
        </div>
        <ul className="grid gap-3">
          {[
            { title: "Blue Ocean Strategy in Tech", status: "Published" },
            { title: "Climate Data & Water Engineering", status: "Draft" },
            { title: "Apple Inc. Business Model", status: "Pending Review" },
          ].map((a) => (
            <li
              key={a.title}
              className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="font-medium">{a.title}</span>
              </div>
              <span className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                  {a.status}
                </span>
                <button className="rounded-md px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Edit3 className="h-4 w-4 text-slate-500" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
