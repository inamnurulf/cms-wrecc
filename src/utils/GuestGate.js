// components/auth/GuestGate.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useMeQuery } from "@/services/auth.api";

export default function GuestGate({ children }) {
  const router = useRouter();
  const search = useSearchParams();

  // read token from Redux (assumes you've already bootstrapped from LS on app start)
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  // hydrate gate so SSR doesn't cause a flicker
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // only verify /me when we have a token and are hydrated
  const skipMe = !hydrated || !accessToken;
  const { isFetching, isLoading, error, data } = useMeQuery(undefined, {
    skip: skipMe,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const verified = !!data && !error; // /me succeeded
  const pending = !hydrated || isFetching || isLoading;

  useEffect(() => {
    if (pending) return;
    // if logged in & verified, bounce away from login/register
    if (accessToken && verified) {
      const next = search.get("next");
      router.replace(next && next.startsWith("/") ? next : "/"); // or "/dashboard"
    }
  }, [pending, accessToken, verified, router, search]);

  // While deciding, just render nothing (or a tiny loader)
  if (pending) {
    return (
      <div className="grid min-h-[30vh] place-items-center text-sm text-slate-500">
        Preparing…
      </div>
    );
  }

  // If not logged in (no token) OR token invalid (/me failed), show the page
  return <>{children}</>;
}
