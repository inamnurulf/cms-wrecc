
function FilesListSkeleton({ count = 6 }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mb-2 h-8 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-10 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );
}
export default FilesListSkeleton;