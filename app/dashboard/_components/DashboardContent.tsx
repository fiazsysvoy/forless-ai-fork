"use client";

import { useMemo, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import FilterTabs, { type FilterId } from "./FilterTabs";
import StatsRow from "./StatsRow";
import ProjectGrid from "./ProjectGrid";
import type { ProjectRow, DashboardStats } from "../types";

export default function DashboardContent({
  projects,
  stats,
}: {
  projects: ProjectRow[];
  stats: DashboardStats;
}) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let projectList = [...projects];

    if (filter !== "all")
      projectList = projectList.filter((project) => project.status === filter);

    if (search.trim()) {
      projectList = projectList.filter((project) =>
        (project.name ?? "").toLowerCase().includes(search.toLowerCase())
      );
    }

    return projectList;
  }, [projects, filter, search]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <DashboardHeader search={search} onSearchChange={setSearch} />

      <FilterTabs active={filter} onChange={setFilter} />

      <StatsRow stats={stats} />

      <ProjectGrid projects={filtered} hasAnyProjects={projects.length > 0} />
    </div>
  );
}
