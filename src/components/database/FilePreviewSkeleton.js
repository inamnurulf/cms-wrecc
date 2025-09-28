function FilePreviewSkeleton({ paragraphs = 3 }) {
  return (
    <div className="p-4 space-y-3">
      <div className="h-6 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      {Array.from({ length: paragraphs }).map((_, i) => (
        <div key={i} className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      ))}
    </div>
  );
}
export default FilePreviewSkeleton;