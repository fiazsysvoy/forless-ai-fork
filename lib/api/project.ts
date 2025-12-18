// lib/api/projects.ts
import type { BrandData } from "@/app/(app)/website-builder/hooks/useWebsiteBuilder";

export type CreateProjectPayload = {
  name: string;
  description?: string;
};

export type UpdateProjectPayload = {
  name?: string;
  status?: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
};

export type ProjectWithBrand = {
  id: string;
  name: string;
  status?: string | null;
  description?: string | null;
  brand_data?: BrandData | null;
};

async function safeJson(res: Response) {
  return res.json().catch(() => ({} as any));
}

export async function apiCreateProject(
  payload: CreateProjectPayload
): Promise<Project> {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to create project");

  return json.project as Project;
}

export async function apiUpdateProject(
  projectId: string,
  payload: UpdateProjectPayload
): Promise<Project> {
  const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to update project");

  return json.project as Project;
}

export async function apiGetProjectWithBrand(
  projectId: string
): Promise<ProjectWithBrand | null> {
  const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}`);
  const json = await safeJson(res);

  if (!res.ok || !json.project) return null;
  return json.project as ProjectWithBrand;
}

/**
 * PATCH = partial save (recommended for builder)
 * Allows saving name/slogan even if palette/font not yet selected.
 */
export async function apiPatchProjectBrand(
  projectId: string,
  brand: Partial<BrandData>
): Promise<{ success: true; brand_data: BrandData }> {
  const res = await fetch(
    `/api/projects/${encodeURIComponent(projectId)}/brand`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brand),
    }
  );

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to patch brand/design");

  return json as { success: true; brand_data: BrandData };
}

/**
 * POST = finalize/strict save
 * Requires palette + font (use when user completes brand kit).
 */
export async function apiSaveProjectBrand(
  projectId: string,
  brand: BrandData
): Promise<{ success: true; brand_data: BrandData }> {
  const res = await fetch(
    `/api/projects/${encodeURIComponent(projectId)}/brand`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brand),
    }
  );

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to save brand/design");

  return json as { success: true; brand_data: BrandData };
}
export async function apiCreateAndGenerateProject(payload: {
  name: string;
  idea: string;
}): Promise<{ success: true; project: { id: string } }> {
  const res = await fetch("/api/projects/create-and-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(json.error || "Failed to create + generate");

  return json;
}
