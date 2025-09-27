import { Suspense } from "react";
import AuthLayoutClient from "./AuthLayoutClient";

export const revalidate = 0;            // or: export const dynamic = "force-dynamic";

export default function AuthLayout({ children }) {
  return (
    <Suspense fallback={
      <div className="grid min-h-[40vh] place-items-center text-sm text-slate-500">
        Preparing…
      </div>
    }>
      <AuthLayoutClient>{children}</AuthLayoutClient>
    </Suspense>
  );
}
