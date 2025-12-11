// app/dashboard/page.tsx
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NewProjectButton from "@/app/dashboard/components/dashboard/NewProjectButton";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, status, thumbnail_url, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Dashboard projects error:", error);
  }

  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Projects</h1>
        <NewProjectButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(projects ?? []).map((project) => (
          <a
            key={project.id}
            href={`/website-builder?projectId=${project.id}`}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-emerald-500 transition"
          >
            <div className="font-medium">{project.name}</div>
            <div className="mt-1 text-xs text-slate-400">
              Status: {project.status}
            </div>
          </a>
        ))}
      </div>

      {(!projects || projects.length === 0) && (
        <p className="text-sm text-slate-400">
          No projects yet. Click &quot;New Project&quot; to create one.
        </p>
      )}
    </div>
  );
}
