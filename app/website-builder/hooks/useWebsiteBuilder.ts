// app/website-builder/hooks/useWebsiteBuilder.ts
"use client";

import { useEffect, useState } from "react";
import { WebsiteData, getDefaultWebsiteData } from "@/lib/websiteTypes";
import { builderSections, type BuilderSection } from "../builderSections";

export type BrandData = {
  name?: string;
  slogan?: string;
  palette?: { primary: string; secondary: string };
  font?: { id: string; css: string };
};

type ProjectResponse = {
  brand_data: BrandData | null;
};

export function useWebsiteBuilder(projectId: string | null) {
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [data, setData] = useState<WebsiteData>(() =>
    getDefaultWebsiteData("product")
  );
  const [section, setSection] = useState<BuilderSection>("hero");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);

  const currentIndex = builderSections.findIndex((s) => s.id === section);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === builderSections.length - 1;

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const [websiteRes, projectRes] = await Promise.all([
          fetch(`/api/website?projectId=${encodeURIComponent(projectId)}`),
          fetch(`/api/projects/${encodeURIComponent(projectId)}`),
        ]);

        const websiteJson = await websiteRes.json().catch(() => ({} as any));
        const projectJson = await projectRes.json().catch(() => ({} as any));

        const project: ProjectResponse | null = projectRes.ok
          ? (projectJson.project as ProjectResponse)
          : null;

        const brandData = project?.brand_data ?? null;
        setBrand(brandData);

        const applyBrand = (base: WebsiteData): WebsiteData => {
          if (!brandData) return base;

          // shallow clone of the parts we actually touch
          const next: WebsiteData = {
            ...base,
            hero: { ...base.hero },
            about: { ...base.about },
          };

          if (brandData.name) {
            next.brandName = brandData.name;
            next.hero.headline = brandData.name;
          }

          if (brandData.slogan) {
            next.tagline = brandData.slogan;
            // next.hero.subheadline = brandData.slogan;
          }

          return next;
        };

        if (websiteRes.ok && websiteJson.data) {
          const existing = websiteJson.data as WebsiteData;
          const merged = applyBrand(existing);
          setData(merged);
        } else {
          const base = getDefaultWebsiteData("product");
          const merged = applyBrand(base);
          setData(merged);
        }
      } catch (err) {
        console.error("Failed to load website/project", err);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [projectId]);

  const handleSave = async () => {
    if (!projectId) {
      setSaveMessage("No projectId provided in URL");
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          data: { ...data },
        }),
      });

      const json = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        setSaveMessage((json as any).error || "Failed to save");
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

  const handleGenerateWebsite = async () => {
    if (!projectId) return;

    try {
      setGenerating(true);

      const idea = data.brandName || "A modern business";

      const res = await fetch("/api/website/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          brand, // brand_data object
        }),
      });

      const json = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        alert((json as any).error || "Failed to generate website");
        return;
      }

      const generated = (json as any).data as WebsiteData;
      setData(generated);
      setSection("hero");
    } catch (e) {
      console.error("Generate website failed", e);
    } finally {
      void handleSave(); // fire-and-forget save to persist latest version
      setGenerating(false);
    }
  };

  return {
    // data
    brand,
    data,
    setData,
    section,
    setSection,
    loading,
    saving,
    saveMessage,
    generating,

    // steps
    builderSections,
    currentIndex,
    isFirst,
    isLast,

    // actions
    handleSave,
    handleGenerateWebsite,
  };
}
