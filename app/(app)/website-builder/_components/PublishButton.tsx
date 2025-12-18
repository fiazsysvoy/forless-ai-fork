"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  projectId: string;
  defaultSlug?: string;
};

export function PublishButton({ projectId, defaultSlug }: Props) {
  const [slug, setSlug] = useState(defaultSlug ?? "");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localSubdomainUrl, setLocalSubdomainUrl] = useState<string | null>(
    null
  );

  async function publish() {
    if (!projectId) return;

    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) {
      toast.error("Please enter a subdomain (slug).");
      return;
    }

    setLoading(true);
    const t = toast.loading("Publishing...");

    try {
      const res = await fetch(`/api/projects/${projectId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: cleanSlug }),
      });

      const data = await res.json().catch(() => ({} as any));

      toast.dismiss(t);

      if (!res.ok) {
        toast.error(data?.error || "Publish failed");
        return;
      }

      setPreviewUrl(data.previewUrl || null);
      setLocalSubdomainUrl(data.localSubdomainUrl || null);

      toast.success("Published successfully!");
    } catch {
      toast.dismiss(t);
      toast.error("Publish failed");
    } finally {
      setLoading(false);
    }
  }

  const hasLinks = !!previewUrl || !!localSubdomainUrl;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
      <div className="flex items-center gap-2">
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Subdomain (e.g. mysite)"
          className="input-base py-1.5 bg-gray-900"
        />
        <button
          onClick={publish}
          disabled={loading || !projectId}
          className="btn-fill"
          type="button"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>

      {hasLinks && (
        <div className="text-xs text-slate-300 space-y-2">
          {previewUrl && (
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">Preview: {previewUrl}</span>
              <a
                className="text-primary hover:underline"
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open
              </a>
            </div>
          )}

          {localSubdomainUrl && (
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">
                URL:{" "}
                <a
                  className="hover:underline"
                  href={localSubdomainUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {localSubdomainUrl}
                </a>
              </span>
              <a
                className="text-primary hover:underline"
                href={localSubdomainUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
