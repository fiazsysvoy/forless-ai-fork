// app/dashboard/projects/[projectId]/page.tsx
import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { ProjectRow } from "@/app/dashboard/types";
import ProjectContent from "../../_components/ProjectContent";

interface PageProps {
  // params: { projectId: string };
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { projectId } = await params;
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: project, error } = await supabase
    .from("projects")
    .select("id, name, status, thumbnail_url, updated_at")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (error || !project) {
    console.error(error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <ProjectContent project={project as ProjectRow} />
      </div>
    </div>
  );
}
