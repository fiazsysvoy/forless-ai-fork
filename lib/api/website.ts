// lib/api/website.ts
import type { WebsiteData } from "@/lib/types/websiteTypes";
// import { WebsiteData } from "../types/websiteTypes";
import type { BrandPayload } from "./brand";

type GenerateWebsitePayload = {
  idea: string;
  brand: BrandPayload;
  websiteType?: string; // e.g. "product" | "service" if you need later
};

export async function apiGenerateWebsite(
  payload: GenerateWebsitePayload | null
): Promise<WebsiteData> {
  const res = await fetch("/api/website/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok || !json.data) {
    throw new Error((json as any).error || "Failed to generate website");
  }

  return json.data as WebsiteData;
}

export async function apiSaveWebsite(
  projectId: string,
  data: WebsiteData
): Promise<void> {
  const res = await fetch("/api/website", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, data }),
  });

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    throw new Error((json as any).error || "Failed to save website");
  }
}

// lib/api/website.ts

export async function apiGetWebsite(
  projectId: string
): Promise<WebsiteData | null> {
  const res = await fetch(
    `/api/website?projectId=${encodeURIComponent(projectId)}`
  );

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    // no website yet is not a hard error for the builder – just return null
    return null;
  }

  // expect handler to return { data: WebsiteData | null }
  if (!json.data) return null;
  return json.data as WebsiteData;
}
