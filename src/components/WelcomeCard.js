import React from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const WelcomeCard = ({ display_name, onCreate, creating, redirectTo }) => {
  const router = useRouter();

  const handleClick = () => {
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      onCreate?.();
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Welcome back, {display_name} 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your articles and keep your content up to date.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClick}
            disabled={creating}
            className="rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {creating ? (
              <>
                <Loader2 className="mr-1 inline h-4 w-4 animate-spin" />{" "}
                Creating…
              </>
            ) : (
              <>
                <Plus className="mr-1 inline h-4 w-4" /> New Article
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default WelcomeCard;
