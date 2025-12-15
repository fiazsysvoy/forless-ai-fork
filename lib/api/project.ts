// lib/api/projects.ts

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
  // add other fields if you have them
};

export async function apiCreateProject(
  payload: CreateProjectPayload
): Promise<Project> {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    throw new Error((json as any).error || "Failed to create project");
  }

  return json.project as Project; // adjust if your API returns {data: ...}
}

export async function apiUpdateProject(
  projectId: string,
  payload: UpdateProjectPayload
): Promise<Project> {
  const res = await fetch(`/api/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    throw new Error((json as any).error || "Failed to update project");
  }

  return json.project as Project; // adjust key if needed
}
// lib/api/projects.ts

export type ProjectWithBrand = {
  id: string;
  name: string;
  status?: string | null;
  description?: string | null;
  brand_data?: any;
};

export async function apiGetProjectWithBrand(
  projectId: string
): Promise<ProjectWithBrand | null> {
  const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}`);

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok || !json.project) {
    return null;
  }

  return json.project as ProjectWithBrand;
}
