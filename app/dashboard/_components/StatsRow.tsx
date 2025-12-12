"use client";

import type { DashboardStats } from "../types";

export default function StatsRow({ stats }: { stats: DashboardStats }) {
  return (
    <section className="grid gap-3 text-xs sm:grid-cols-3">
      <StatCard label="Total Projects" value={stats.totalProjects} />
      <StatCard label="Published Sites" value={stats.publishedSites} />
      <StatCard label="Campaigns Created" value={stats.campaignsCreated} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
