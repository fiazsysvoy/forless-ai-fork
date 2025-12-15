"use client";

import Link from "next/link";
import type { ProjectRow } from "../types";
import Image from "next/image";

export default function ProjectGrid({
  projects,
  hasAnyProjects,
}: {
  projects: ProjectRow[];
  hasAnyProjects: boolean;
}) {
  if (projects.length > 0) {
    return (
      <section className="mt-2">
        <div className="grid max-h-[480px] gap-4 overflow-y-auto pr-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    );
  }

  if (!hasAnyProjects) {
    return (
      <section className="mt-2">
        <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
          No projects yet. Click{" "}
          <span className="font-medium text-emerald-400">“New Project”</span> to
          create one.
        </div>
      </section>
    );
  }

  return (
    <section className="mt-2">
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
        No projects match your filters.
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectRow }) {
  const name = project.name || "Untitled project";
  const status = project.status || "active";

  const lastUpdated = project.updated_at
    ? new Date(project.updated_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="group flex flex-col rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs transition hover:border-primary hover:bg-slate-900"
    >
      <div className="h-24 overflow-hidden rounded-md border border-slate-800 bg-slate-900">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
            width={200}
            height={200}
          />
        ) : (
          // <span>{project.thumbnail_url}</span>
          <div className="h-full w-full bg-linear-to-br from-slate-800 to-slate-900" />
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <div className="truncate text-sm font-medium">{name}</div>
          <div className="mt-1 text-[11px] capitalize text-slate-400">
            Status: {status}
          </div>
        </div>

        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
          Open
        </span>
      </div>

      <div className="mt-2 text-[10px] text-slate-500">
        Last updated {lastUpdated}
      </div>
    </Link>
  );
}
