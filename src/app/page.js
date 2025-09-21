"use client";


import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-800">
      <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-10 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
        <h1 className="text-4xl font-extrabold tracking-tight text-center">
          Welcome to WRECC CMS
        </h1>
        <p className="mt-3 text-slate-600 text-center dark:text-slate-400">
          Your journey starts here. Please login to continue.
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow hover:bg-emerald-700 transition"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
