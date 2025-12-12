"use client";

import NewProjectButton from "./NewProjectButton";

interface DashboardHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function DashboardHeader({
  search,
  onSearchChange,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-xl font-semibold">Your Projects</h1>
        <p className="text-xs text-slate-400">
          Describe once. Build brand, website, and marketing from one place.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="hidden sm:block">
          <SearchInput value={search} onChange={onSearchChange} />
        </div>

        <NewProjectButton />
      </div>
    </header>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search projects…"
      className="w-full sm:w-64 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs outline-none ring-primary/40 focus:ring-1"
    />
  );
}
