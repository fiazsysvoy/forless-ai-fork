// app/website-builder/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { WebsiteTemplateBasic } from "@/components/websiteTemplates/Template1/WebsiteTemplateBasic";
import { useWebsiteBuilder } from "./hooks/useWebsiteBuilder";
import { BuilderSidebar } from "./_components/BuilderSidebar";

export default function WebsiteBuilderPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const {
    brand,
    data,
    setData,
    section,
    setSection,
    loading,
    saving,
    saveMessage,
    generating,
    builderSections,
    currentIndex,
    isFirst,
    isLast,
    handleSave,
    handleGenerateWebsite,
  } = useWebsiteBuilder(projectId);

  if (!projectId) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-300">
          Missing <code>?projectId=...</code> in URL
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-300">Loading website...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-full flex-col gap-6 px-4 py-6 lg:flex-row">
        <BuilderSidebar
          projectId={projectId}
          section={section}
          setSection={setSection}
          builderSections={builderSections}
          currentIndex={currentIndex}
          isFirst={isFirst}
          isLast={isLast}
          data={data}
          setData={setData}
          generating={generating}
          saving={saving}
          saveMessage={saveMessage}
          onGenerate={handleGenerateWebsite}
          onSave={handleSave}
        />

        <main className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <WebsiteTemplateBasic
            data={data}
            theme={{
              primary: brand?.palette?.primary,
              secondary: brand?.palette?.secondary,
              fontFamily: brand?.font?.css,
            }}
          />
        </main>
      </div>
    </div>
  );
}
