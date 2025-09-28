"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import { Home, FileText, Database } from "lucide-react";
import AuthGate from "@/utils/AuthGate";
import { logout } from "@/store/slices/auth.slice";
import { useAppDispatch } from "@/store/hooks";

const DashboardLayout = ({ children }) => {
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
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

  const nav = [
    { label: "Home", icon: Home, href: "/home" },
    { label: "Articles", icon: FileText, href: "/articles" },
    // { label: "Data", icon: Database, href: "/data" },
  ];

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <AuthGate>
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950">
      <Header
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        onOpenSidebar={() => setSidebarOpen(true)}
      />
      <div className="flex">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          nav={nav}
          onLogout={handleLogout}
        />
        {children}
      </div>
    </div>
    </AuthGate>
  );
};

export default DashboardLayout;
