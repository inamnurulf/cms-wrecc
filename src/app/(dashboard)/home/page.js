"use client";
import React, { useEffect, useState } from "react";
import { FileText, Edit3 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import WelcomeCard from "@/components/WelcomeCard";
import StatsGrid from "@/components/StatsGrid";

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

  const user = useAppSelector((state) => state.auth.user) || {
    name: "Guest",
    role: "User",
  };

  return (
    <div className="w-full p-4 sm:p-8 grid gap-6 max-w-7xl mx-auto">
      {/* Welcome + quick actions */}
      <WelcomeCard display_name={user.display_name} redirectTo="/articles" />

      {/* Stats */}
      <StatsGrid/>

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
