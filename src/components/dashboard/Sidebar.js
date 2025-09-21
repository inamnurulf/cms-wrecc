// File: components/dashboard/Sidebar.tsx
"use client";
import React from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  LogOut,
  X,
} from "lucide-react";

export default function Sidebar({
  collapsed,
  setCollapsed,
  sidebarOpen,
  setSidebarOpen,
  nav,
  brand = { initials: "W", name: "WRECC" },
  onNewProject,
  onLogout,
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-14 hidden h-[calc(100vh-56px)] flex-col border-r border-slate-200/60 bg-white/70 p-3 transition-all dark:border-slate-800 dark:bg-slate-900/60 md:flex ${
          collapsed ? "w-[76px]" : "w-[260px]"
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white px-2.5 py-1.5 text-xs font-medium hover:shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            {collapsed ? (
              <>
                <ChevronRight className="h-4 w-4" /> Expand
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" /> Collapse
              </>
            )}
          </button>
        </div>

        <nav className="mt-2 grid gap-1">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="mt-auto grid gap-2">
          <button
            onClick={onNewProject}
            className={`inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 ${
              collapsed ? "px-0" : ""
            }`}
          >
            <Plus className="h-4 w-4" /> {!collapsed && <span>New articles</span>}
          </button>
          <button
            onClick={onLogout}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 ${
              collapsed ? "px-0" : ""
            }`}
          >
            <LogOut className="h-4 w-4" /> {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-slate-200/60 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 text-white font-bold">
                  {brand.initials}
                </div>
                <span className="text-sm font-semibold">{brand.name}</span>
              </div>
              <button
                className="grid h-9 w-9 place-items-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="grid gap-1">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
