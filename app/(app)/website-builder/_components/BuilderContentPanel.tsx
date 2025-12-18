// app/website-builder/_components/BuilderContentPanel.tsx
"use client";

import type { Dispatch, SetStateAction } from "react";
import type { WebsiteData } from "@/lib/types/websiteTypes";
import type { BuilderSection } from "../builderSections";

import { HeroSectionForm } from "./HeroSectionForm";
import { AboutSectionForm } from "./AboutSectionForm";
import { FeaturesSectionForm } from "./FeatureSectionForm";
import { ProductsSectionForm } from "./ProductsSectionForm";
import { ContactSectionForm } from "./ContactSectionForm";

type ContentProps = {
  section: BuilderSection;
  setSection: Dispatch<SetStateAction<BuilderSection>>;
  builderSections: ReadonlyArray<{ id: BuilderSection; label: string }>;
  currentIndex: number;
  isFirst: boolean;
  isLast: boolean;

  data: WebsiteData;
  setData: Dispatch<SetStateAction<WebsiteData>>;

  generating: boolean;
  onGenerate: () => void;
};

export function BuilderContentPanel({
  section,
  setSection,
  builderSections,
  currentIndex,
  isFirst,
  isLast,
  data,
  setData,
  generating,
  onGenerate,
}: ContentProps) {
  return (
    <>
      {/* Step info + regenerate are ONLY in content panel */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400">
          Step {currentIndex + 1} of {builderSections.length}
        </span>

        <button
          type="button"
          className="rounded-full border border-slate-600 px-2 py-1 text-[10px]"
          onClick={onGenerate}
          disabled={generating}
        >
          {generating ? "Generating..." : "Re-generate"}
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
    </>
  );
}
