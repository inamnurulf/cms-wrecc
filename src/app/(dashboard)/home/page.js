"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import WelcomeCard from "@/components/WelcomeCard";
import StatsGrid from "@/components/StatsGrid";
import Link from "next/link";
import RecentArticles from "@/components/article/RecentArtticles";
import { useListArticlesQuery } from "@/services/articles.api";

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

  const { data } = useListArticlesQuery(
    { page: 1, limit: 5 },
    { refetchOnMountOrArgChange: true }
  );

  const recent = useMemo(() => {
    const items = data?.data?.items ?? [];
    return [...items]
      .sort(
        (a, b) =>
          new Date(b.updated_at ?? b.updatedAt ?? 0).getTime() -
          new Date(a.updated_at ?? a.updatedAt ?? 0).getTime()
      )
      .slice(0, 5);
  }, [data]);

  return (
    <div className="w-full p-4 sm:p-8 grid gap-6 max-w-7xl mx-auto">
      {/* Welcome + quick actions */}
      <WelcomeCard display_name={user.display_name} redirectTo="/articles" />

      {/* Stats */}
      <StatsGrid />

      {/* Recent Articles */}
      <RecentArticles recent={recent} />
    </div>
  );
}
