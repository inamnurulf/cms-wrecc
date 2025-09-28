import { FileDown } from "lucide-react";
import Badge from "../atoms/Badge";

const fmtID = (iso) =>
  iso
    ? new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(
        new Date(iso)
      )
    : "";
export default function FilePreview({ file }) {
  if (!file) {
    return <div className="p-6 text-slate-500">Nothing to preview.</div>;
  }
  return (
    <div className="p-4">
      <div className="grid gap-3 text-sm">
        <div>
          <div className="text-xs font-medium text-slate-500">Title</div>
          <div className="truncate font-semibold">{file.title}</div>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-500">Description</div>
          <p className="text-slate-700 dark:text-slate-300">
            {file.description || "—"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-slate-500">Drive</div>
          <a
            href={file.drive_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <FileDown size={14} /> Open
          </a>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Status</span>
          {file.is_published ? (
            <Badge tone="green">Published</Badge>
          ) : (
            <Badge tone="yellow">Draft</Badge>
          )}
        </div>

        <div>
          <div className="text-xs font-medium text-slate-500">Metadata</div>
          <pre className="mt-1 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-900/60">
            {JSON.stringify(file.metadata ?? {}, null, 2)}
          </pre>
        </div>

        <div className="text-xs text-slate-500">
          <span>Created: {fmtID(file.created_at) || "—"}</span>
          <span className="mx-2">•</span>
          <span>Updated: {fmtID(file.updated_at) || "—"}</span>
        </div>
      </div>
    </div>
  );
}
