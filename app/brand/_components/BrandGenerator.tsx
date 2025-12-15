// app/brand/_components/BrandGenerator.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PALETTES,
  FONTS,
  generateBrandOptions,
  type BrandOption,
} from "@/app/brand/brandConfig";
import BrandControls from "./BrandControls";
import BrandOptionsList from "./BrandOptionsList";

interface Props {
  projectId: string;
  projectIdea?: string | null;
}

export default function BrandGenerator({ projectId, projectIdea }: Props) {
  const router = useRouter();
  const [idea, setIdea] = useState(projectIdea || "");
  const [selectedPaletteId, setSelectedPaletteId] = useState("emerald-slate");
  const [selectedFontId, setSelectedFontId] = useState("sans");
  const [generated, setGenerated] = useState<BrandOption[] | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPalette = useMemo(
    () => PALETTES.find((p) => p.id === selectedPaletteId) ?? PALETTES[0],
    [selectedPaletteId]
  );

  const selectedFont = useMemo(
    () => FONTS.find((f) => f.id === selectedFontId) ?? FONTS[0],
    [selectedFontId]
  );

  async function handleGenerate() {
    if (!idea.trim()) {
      alert("Please describe your business idea first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/brand/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json.error || "Failed to generate");
        return;
      }

      // json.brands => [{name,slogan}...]
      // then you attach palette + font locally just like before
      const options: BrandOption[] = (json.brands as any[])
        .slice(0, 3)
        .map((b, idx) => ({
          id: `brand-${idx}`,
          name: String(b.name ?? "Untitled"),
          slogan: String(b.slogan ?? ""),
          primaryColor: selectedPalette.primary,
          secondaryColor: selectedPalette.secondary,
          font: selectedFont.css,
        }));

      setGenerated(options);
    } finally {
      setLoading(false);
    }
  }

  async function handleUse(option: BrandOption) {
    // 1) Save brand_data
    const brandPayload = {
      name: option.name,
      slogan: option.slogan,
      palette: {
        primary: option.primaryColor,
        secondary: option.secondaryColor,
      },
      font: { id: selectedFontId, css: option.font },
    };

    const saveBrandRes = await fetch(`/api/projects/${projectId}/brand`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brandPayload),
    });

    if (!saveBrandRes.ok) {
      const j = await saveBrandRes.json().catch(() => ({}));
      alert(j.error || "Failed to save brand");
      return;
    }

    // 2) Generate website JSON (OpenAI)
    // idea: use text area "idea" OR brand name/slogan as fallback
    const businessIdea =
      idea.trim() || `${brandPayload.name} - ${brandPayload.slogan}`;

    const genRes = await fetch("/api/website/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        websiteType: "product", // or let user pick, or infer later
        idea: businessIdea,
        brand: brandPayload,
      }),
    });

    const genJson = await genRes.json().catch(() => ({}));

    if (!genRes.ok || !genJson.data) {
      alert(genJson.error || "Failed to generate website");
      return;
    }

    // 3) Save generated website to DB
    const saveSiteRes = await fetch("/api/website", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        data: genJson.data,
      }),
    });

    if (!saveSiteRes.ok) {
      const j = await saveSiteRes.json().catch(() => ({}));
      alert(j.error || "Failed to save website");
      return;
    }

    // 4) Go to builder (it will load the saved website)
    router.push(`/website-builder?projectId=${projectId}`);
  }

  return (
    <div className="space-y-6 text-xs">
      <div>
        <h1 className="text-xl font-semibold">Brand Generator</h1>
        <p className="mt-1 text-slate-400">
          Configure a color palette and font, then generate name, slogan and a
          simple SVG logo.
        </p>
      </div>

      <BrandControls
        idea={idea}
        onIdeaChange={setIdea}
        selectedPaletteId={selectedPaletteId}
        onPaletteChange={setSelectedPaletteId}
        selectedFontId={selectedFontId}
        onFontChange={setSelectedFontId}
        loading={loading}
        onGenerate={handleGenerate}
      />

      <BrandOptionsList options={generated} onUse={handleUse} />
    </div>
  );
}
