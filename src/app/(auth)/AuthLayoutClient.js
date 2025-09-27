"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useMeQuery } from "@/services/auth.api";

export default function AuthLayout({ children }) {
  const router = useRouter();
  const search = useSearchParams();

  // 1) Read token from Redux (assumes you bootstrap from localStorage on app start)
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  // 2) Hydration guard to avoid SSR flicker
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // 3) Only verify /me when we have a token and are hydrated
  const skipMe = !hydrated || !accessToken;
  const { isFetching, isLoading, error, data } = useMeQuery(undefined, {
    skip: skipMe,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const verified = !!data && !error; // /me succeeded => logged in
  const pending = !hydrated || isFetching || isLoading;

  // 4) If logged in, bounce away from auth pages
  useEffect(() => {
    if (pending) return;
    if (accessToken && verified) {
      const next = search.get("next");
      router.replace(next && next.startsWith("/") ? next : "/home"); // or "/dashboard"
    }
  }, [pending, accessToken, verified, router, search]);

  // 5) While deciding, show a small loader to prevent flash
  if (pending) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-sm text-slate-500">
        Preparing…
      </div>
    );
  }

  // 6) If not logged in (no token) OR token invalid (/me failed), render auth UI
  return (
    <>
        {children}
      </>
  );
}
