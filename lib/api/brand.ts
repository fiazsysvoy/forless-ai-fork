// lib/api/brand.ts
// import type { WebsiteData } from "@/lib/websiteTypes";

export type BrandPayload = {
  name: string;
  slogan: string;
  palette: { primary: string; secondary: string };
  font: { id: string; css: string };
};

export type GeneratedBrandFromApi = {
  name?: string;
  slogan?: string;
};

export async function apiGenerateBrand(
  idea: string
): Promise<GeneratedBrandFromApi[]> {
  const res = await fetch("/api/brand/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea }),
  });

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    throw new Error((json as any).error || "Failed to generate brand");
  }

  // expect json.brands: { name, slogan }[]
  const brands = (json as any).brands;
  if (!Array.isArray(brands)) return [];

  return brands as GeneratedBrandFromApi[];
}

export async function apiSaveProjectBrand(
  projectId: string,
  brand: BrandPayload | null
): Promise<void> {
  const res = await fetch(`/api/projects/${projectId}/brand`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brand),
  });

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    throw new Error((json as any).error || "Failed to save brand");
  }
}
