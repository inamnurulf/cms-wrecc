"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useMeQuery } from "@/services/auth.api";

export default function AuthGate({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  // If no token in client state, bounce immediately.
  // (Server can't read localStorage, so we do it client-side.)
  const shouldSkip = !accessToken;

  const { isFetching, isLoading, error } = useMeQuery(undefined, {
    // only hit /me if we have a token
    skip: shouldSkip,
    // refetch when window refocuses or reconnects (optional)
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    // If no token at all -> go to login
    if (shouldSkip) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    // If /me failed with 401 -> token invalid, go to login
    if (error && (error.status === 401 || error.originalStatus === 401)) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
    }
  }, [shouldSkip, error, router, pathname]);

  // While verifying session, show a tiny loading screen
  if (shouldSkip || isFetching || isLoading) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-sm text-slate-500">
        Checking session…
      </div>
    );
  }

  return children;
}
