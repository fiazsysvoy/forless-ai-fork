"use client";

export type FilterId = "all" | "active" | "draft" | "archived";

const FILTERS = [
  { id: "all" as const, label: "All" },
  { id: "active" as const, label: "Active" },
  { id: "draft" as const, label: "Draft" },
  { id: "archived" as const, label: "Archived" },
];

interface Props {
  active: FilterId;
  onChange: (id: FilterId) => void;
}

export default function FilterTabs({ active, onChange }: Props) {
  return (
    <nav className="flex gap-2 border-b border-slate-800 pb-2 text-xs">
      {FILTERS.map((filter) => {
        const isActive = active === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onChange(filter.id)}
            className={`rounded-full px-3 py-1 transition ${
              isActive
                ? "bg-primary text-slate-950"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </nav>
  );
}
