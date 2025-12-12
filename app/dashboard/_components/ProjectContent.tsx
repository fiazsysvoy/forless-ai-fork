// app/dashboard/_components/ProjectDetailContent.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProjectRow } from "@/app/dashboard/types"; // or "../_types"

export default function ProjectContent({ project }: { project: ProjectRow }) {
  const [name, setName] = useState(project.name ?? "");
  const [status, setStatus] = useState(project.status ?? "active");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, status }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to update project");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Back */}
      <div className="text-xs text-slate-400">
        <Link href="/dashboard" className="hover:underline">
          ← Back to projects
        </Link>
      </div>

      {/* Editable header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full max-w-md rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-lg font-semibold outline-none ring-primary/40 focus:ring-1"
          />
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Project status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs outline-none"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="self-start rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-slate-950 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {/* Three main action cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard
          title="Brand"
          description="Generate or refine your brand identity, messaging and naming."
          href={`/brand?projectId=${project.id}`}
          ctaLabel="Open Brand"
        />
        <ActionCard
          title="Build Website"
          description="Use the website builder to design and publish your site."
          href={`/website-builder?projectId=${project.id}`}
          ctaLabel="Open Builder"
        />
        <ActionCard
          title="Create Campaigns"
          description="Create marketing campaigns, ads and content for this project."
          href={`/marketing?projectId=${project.id}`}
          ctaLabel="Open Campaigns"
        />
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  ctaLabel,
}: {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
}) {
  return (
    <div className="flex h-full flex-col justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-xs">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="mt-2 text-slate-400">{description}</p>
      </div>

      <div className="mt-4">
        <Link
          href={href}
          className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-[11px] font-medium text-slate-950"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
