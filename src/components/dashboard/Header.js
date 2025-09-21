"use client";
import React from "react";
import { Menu, Search, Sun, Moon, Bell, User } from "lucide-react";

export default function Header({
  dark,
  onToggleDark,
  onOpenSidebar,
  brand = { initials: "W", name: "WRECC", subtitle: "Dashboard" },
  user = { name: "In'am", role: "Admin" },
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <button
            className="grid h-9 w-9 place-items-center rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:hover:bg-slate-800"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 text-white font-bold">
              {brand.initials}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{brand.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {brand.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl items-center gap-2">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              placeholder="Search… ( / )"
              className="w-full rounded-2xl border border-slate-200 bg-white px-9 py-2 text-sm outline-none ring-emerald-500/20 transition focus:border-emerald-500 focus:ring-4 dark:border-slate-700 dark:bg-slate-900"
              onKeyDown={(e) => {
                if (e.key === "/") e.preventDefault();
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="grid h-9 w-9 place-items-center rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:hover:bg-slate-800"
            onClick={onToggleDark}
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            className="relative grid h-9 w-9 place-items-center rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
          </button>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200/60 bg-white/70 px-2 py-1 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
