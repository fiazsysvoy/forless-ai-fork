// app/brand/page.tsx
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import BrandGenerator from "./_components/BrandGenerator";

interface PageProps {
  searchParams: Promise<{ projectId?: string }>;
}

export default async function BrandPage({ searchParams }: PageProps) {
  const { projectId } = await searchParams;

  if (!projectId) {
    redirect("/dashboard");
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Optional: verify project belongs to user (can skip if you want)
  const { data: project } = await supabase
    .from("projects")
    .select("id, name")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!project) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <BrandGenerator projectId={projectId} projectName={project.name} />
      </div>
    </div>
  );
}
