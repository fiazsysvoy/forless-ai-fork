// app/brand/_components/BrandGenerator.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PALETTES,
  FONTS,
  generateBrandOptions,
  type BrandOption,
} from "@/app/(app)/brand/brandConfig";
import BrandControls from "./BrandControls";
import BrandOptionsList from "./BrandOptionsList";
import {
  apiGenerateBrand,
  apiSaveProjectBrand,
  type BrandPayload,
} from "@/lib/api/brand";
import { apiGenerateWebsite, apiSaveWebsite } from "@/lib/api/website";
import { toast } from "sonner";

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
      toast.warning("Please enter a business idea to generate a brand.");
      return;
    }

    setLoading(true);
    try {
      const rawBrands = await apiGenerateBrand(idea);

      const options: BrandOption[] = rawBrands.slice(0, 3).map((b, idx) => ({
        id: `brand-${idx}`,
        name: String(b.name ?? "Untitled"),
        slogan: String(b.slogan ?? ""),
        primaryColor: selectedPalette.primary,
        secondaryColor: selectedPalette.secondary,
        font: selectedFont.css,
      }));

      setGenerated(options);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate brand. " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUse(option: BrandOption) {
    try {
      // 1) Save brand_data
      const brandPayload: BrandPayload = {
        name: option.name,
        slogan: option.slogan,
        palette: {
          primary: option.primaryColor,
          secondary: option.secondaryColor,
        },
        font: { id: selectedFontId, css: option.font },
      };

      await apiSaveProjectBrand(projectId, brandPayload);

      // 2) Generate website JSON
      const businessIdea =
        idea.trim() || `${brandPayload.name} - ${brandPayload.slogan}`;

      const websiteData = await apiGenerateWebsite({
        idea: businessIdea,
        brand: brandPayload,
        // websiteType: "product", // keep for future if needed
      });

      // 3) Save generated website to DB
      await apiSaveWebsite(projectId, websiteData);

      // 4) Go to builder
      router.push(`/website-builder?projectId=${projectId}`);
    } catch (err) {
      toast.error("Failed to use brand option. " + (err as Error).message);
    }
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
