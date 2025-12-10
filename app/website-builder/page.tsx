"use client";

import { useState } from "react";
import {
  WebsiteType,
  WebsiteData,
  getDefaultWebsiteData,
} from "@/lib/websiteTypes";
import { WebsiteTemplateBasic } from "@/components/website/WebsiteTemplateBasic";

import { HeroSectionForm } from "./_components/HeroSectionForm";
import { AboutSectionForm } from "./_components/AboutSectionForm";
import { FeaturesSectionForm } from "./_components/FeatureSectionForm";
import { ProductsSectionForm } from "./_components/ProductsSectionForm";
import { ContactSectionForm } from "./_components/ContactSectionForm";

const builderSections = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "products", label: "Products" },
  { id: "contact", label: "Contact" },
] as const;

type BuilderSection = (typeof builderSections)[number]["id"];

export default function WebsiteBuilderPage() {
  const [type, setType] = useState<WebsiteType>("product");
  const [data, setData] = useState<WebsiteData>(() =>
    getDefaultWebsiteData("product")
  );
  const [section, setSection] = useState<BuilderSection>("hero");
  const currentIndex = builderSections.findIndex((s) => s.id === section);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === builderSections.length - 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-full flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="w-full space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 lg:w-80 lg:min-w-80 lg:max-w-80">
          <h1 className="text-lg font-semibold mb-2">Website Builder</h1>

          {/* Step indicator */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400">
              Step {currentIndex + 1} of {builderSections.length}
            </span>
          </div>

          {/* Section Forms */}
          {section === "hero" && (
            <HeroSectionForm
              type={type}
              onTypeChange={(t) => {
                setType(t);
                setData(getDefaultWebsiteData(t));
              }}
              data={data}
              setData={setData}
            />
          )}

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
          {/* Previous / Next */}
          <div className="mt-4 flex justify-between">
            <button
              disabled={isFirst}
              onClick={() => setSection(builderSections[currentIndex - 1].id)}
              className="rounded-full border border-slate-600 px-3 py-1 text-xs disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={isLast}
              onClick={() => setSection(builderSections[currentIndex + 1].id)}
              className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-slate-950 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </aside>

        <main className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <WebsiteTemplateBasic data={data} />
        </main>
      </div>
    </div>
  );
}
