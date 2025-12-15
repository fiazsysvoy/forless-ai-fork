// app/website-builder/_components/BuilderSidebar.tsx
"use client";

import type { Dispatch, SetStateAction } from "react";
import type { WebsiteData } from "@/lib/types/websiteTypes";
import type { BuilderSection } from "../builderSections";

import { HeroSectionForm } from "./HeroSectionForm";
import { AboutSectionForm } from "./AboutSectionForm";
import { FeaturesSectionForm } from "./FeatureSectionForm";
import { ProductsSectionForm } from "./ProductsSectionForm";
import { ContactSectionForm } from "./ContactSectionForm";

type Props = {
  projectId: string;
  section: BuilderSection;
  setSection: Dispatch<SetStateAction<BuilderSection>>;
  builderSections: ReadonlyArray<{ id: BuilderSection; label: string }>;
  currentIndex: number;
  isFirst: boolean;
  isLast: boolean;

  data: WebsiteData;
  setData: Dispatch<SetStateAction<WebsiteData>>;

  generating: boolean;
  saving: boolean;
  saveMessage: string | null;

  onGenerate: () => void;
  onSave: () => void;
};

export function BuilderSidebar({
  projectId,
  section,
  setSection,
  builderSections,
  currentIndex,
  isFirst,
  isLast,
  data,
  setData,
  generating,
  saving,
  saveMessage,
  onGenerate,
  onSave,
}: Props) {
  return (
    <aside className="w-full space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 lg:w-80 lg:min-w-80 lg:max-w-80">
      <h1 className="text-lg font-semibold mb-2">Website Builder</h1>

      <p className="text-[10px] text-slate-400 mb-2">
        Project ID: <span className="font-mono">{projectId}</span>
      </p>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-400">
          Step {currentIndex + 1} of {builderSections.length}
        </span>

        <button
          type="button"
          className="rounded-full border border-slate-600 px-2 py-1 text-[10px]"
          onClick={onGenerate}
          disabled={generating}
        >
          {generating ? "Generating..." : "Re-Generate"}
        </button>
      </div>

      {section === "hero" && <HeroSectionForm data={data} setData={setData} />}

      {section === "about" && (
        <AboutSectionForm data={data} setData={setData} />
      )}

      {section === "features" && (
        <FeaturesSectionForm data={data} setData={setData} />
      )}

      {section === "products" && (
        <ProductsSectionForm data={data} setData={setData} />
      )}

      {section === "contact" && (
        <ContactSectionForm data={data} setData={setData} />
      )}

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => {
            if (!isFirst && currentIndex > 0) {
              setSection(builderSections[currentIndex - 1].id);
            }
          }}
          className="rounded-full border border-slate-600 px-3 py-1 text-xs disabled:opacity-40"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={isLast}
          onClick={() => {
            if (!isLast && currentIndex >= 0) {
              setSection(builderSections[currentIndex + 1].id);
            }
          }}
          className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-slate-950 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="w-full rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-slate-950 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save website"}
        </button>
        {saveMessage && (
          <p className="text-[11px] text-slate-300">{saveMessage}</p>
        )}
      </div>
    </aside>
  );
}
