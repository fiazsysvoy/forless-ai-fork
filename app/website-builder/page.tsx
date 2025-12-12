"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [type, setType] = useState<WebsiteType>("product");
  const [data, setData] = useState<WebsiteData>(() =>
    getDefaultWebsiteData("product")
  );
  const [section, setSection] = useState<BuilderSection>("hero");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const currentIndex = builderSections.findIndex((s) => s.id === section);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === builderSections.length - 1;

  // Load existing website from API
  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`/api/website?projectId=${projectId}`);
        const json = await res.json();

        if (res.ok && json.data) {
          const existing = json.data as WebsiteData;
          setData(existing);
          setType(existing.type);
        } else {
          // no existing website -> keep default
          console.log("No existing website found");
          setData(getDefaultWebsiteData("product"));
          setType("product");
        }
      } catch (err) {
        console.error("Failed to load website", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  const handleSave = async () => {
    if (!projectId) {
      setSaveMessage("No projectId provided in URL");
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      // console.log("Saving", data);
      const res = await fetch("/api/website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          data: { ...data, type }, // ensure type is in sync
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        console.log(json.error);
        setSaveMessage(json.error || "Failed to save");
      } else {
        setSaveMessage("Saved ✅");
      }
    } catch (err) {
      console.error(err);
      setSaveMessage("Error while saving");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

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
        <aside className="w-full space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 lg:w-80 lg:min-w-80 lg:max-w-80">
          <h1 className="text-lg font-semibold mb-2">Website Builder</h1>

          <p className="text-[10px] text-slate-400 mb-2">
            Project ID: <span className="font-mono">{projectId}</span>
          </p>

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
                // optional: reset whole website when type changes
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

          {/* Save button */}
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={handleSave}
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

        <main className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <WebsiteTemplateBasic data={data} />
        </main>
      </div>
    </div>
  );
}
