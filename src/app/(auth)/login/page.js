"use client";
import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BarChart,
  Database
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    // Simulate an API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    // Demo-only: accept any email/password
    setSuccess("Signed in successfully. Redirecting…");
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950 text-slate-900 dark:text-slate-100">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-400/10" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-400/10" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-2">
          {/* Left side: Marketing / feature callouts */}
          <div className="hidden lg:flex flex-col justify-center rounded-3xl border border-slate-200/60 bg-white/70 p-10 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Welcome back
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Sign in to your account
            </h1>
            <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">
              Access the CMS to manage research articles, track climate–water
              data, and collaborate on sustainable solutions.{" "}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: ShieldCheck,
                  title: "Secure by Design",
                  desc: "Role-based access for researchers, students, and administrators.",
                },
                {
                  icon: Sparkles,
                  title: "Polished & Accessible",
                  desc: "Responsive, dark-mode ready, and optimized for data-heavy content.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-slate-200/60 bg-white/70 p-5 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <div className="flex items-center gap-3">
                    <f.icon className="h-5 w-5" />
                    <h3 className="font-semibold">{f.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Auth card */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-md backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Login</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Use your email and password to continue.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-300/50 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-900/30 dark:text-red-200">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 rounded-xl border border-emerald-300/50 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-200">
                  {success}
                </div>
              )}

              <form onSubmit={onSubmit} className="grid gap-4">
                {/* Email */}
                <label className="grid gap-1">
                  <span className="text-sm font-medium">Email</span>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      autoComplete="email"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-9 py-3 text-sm outline-none ring-emerald-500/20 transition focus:border-emerald-500 focus:ring-4 dark:border-slate-700 dark:bg-slate-900"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </label>

                {/* Password */}
                <label className="grid gap-1">
                  <span className="text-sm font-medium">Password</span>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-9 py-3 text-sm outline-none ring-emerald-500/20 transition focus:border-emerald-500 focus:ring-4 dark:border-slate-700 dark:bg-slate-900"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-2 grid place-items-center rounded-xl px-2 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:text-slate-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </label>

                {/* Row: Remember + Forgot */}
                <div className="mt-1 flex items-center justify-between">
                  {/* <a
                    href="#"
                    className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    Forgot password?
                  </a> */}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                {/* <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Don’t have an account?{" "}
                  <a
                    href="#"
                    className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    Create one
                  </a>
                </p> */}
              </form>
            </div>

            {/* Tiny footer */}
            <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              By continuing you agree to our{" "}
              <a href="#" className="underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
