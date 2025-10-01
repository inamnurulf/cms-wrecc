import { ExternalLink } from "lucide-react";
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

  // Backward-compat: if no links yet but legacy drive_link exists, show it as a single link
  const links =
    Array.isArray(file.links) && file.links.length > 0
      ? file.links
      : file.drive_link
      ? [{ name: "Primary link", href: file.drive_link, description: null }]
      : [];

  return (
    <div className="p-4">
      <div className="grid gap-3 text-sm">
        {/* Title */}
        <div>
          <div className="text-xs font-medium text-slate-500">Title</div>
          <div className="truncate font-semibold">{file.title}</div>
        </div>

        {/* Description */}
        <div>
          <div className="text-xs font-medium text-slate-500">Description</div>
          <p className="text-slate-700 dark:text-slate-300">
            {file.description || "—"}
          </p>
        </div>

        {/* Links */}
        <div>
          <div className="mb-1 text-xs font-medium text-slate-500">Links</div>
          {links.length === 0 ? (
            <p className="text-slate-500">—</p>
          ) : (
            <ul className="space-y-2">
              {links.map((l, i) => (
                <li
                  key={`${l.href}-${i}`}
                  className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-2 dark:border-slate-700"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{l.name || "Link"}</div>
                    {l.description ? (
                      <div className="truncate text-xs text-slate-500">
                        {l.description}
                      </div>
                    ) : null}
                  </div>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    title="Open link"
                  >
                    <ExternalLink size={14} /> Open
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Status</span>
          {file.is_published ? (
            <Badge tone="green">Published</Badge>
          ) : (
            <Badge tone="yellow">Draft</Badge>
          )}
        </div>

        {/* Metadata */}
        <div>
          <div className="text-xs font-medium text-slate-500">Metadata</div>
          <pre className="mt-1 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-900/60">
            {JSON.stringify(file.metadata ?? {}, null, 2)}
          </pre>
        </div>

        {/* Timestamps */}
        <div className="text-xs text-slate-500">
          <span>Created: {fmtID(file.created_at) || "—"}</span>
          <span className="mx-2">•</span>
          <span>Updated: {fmtID(file.updated_at) || "—"}</span>
        </div>
      </div>
    </div>
  );
}
