"use client";

import type { BrandOption } from "@/app/brand/brandConfig";
import BrandCard from "./BrandCard";

interface BrandOptionsListProps {
  options: BrandOption[] | null;
  onUse: (option: BrandOption) => Promise<void>;
}

export default function BrandOptionsList({
  options,
  onUse,
}: BrandOptionsListProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Generated options</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {options.map((option) => (
          <BrandCard key={option.id} option={option} onUse={onUse} />
        ))}
      </div>
    </div>
  );
}
