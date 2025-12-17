// app/dashboard/page.tsx
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardContent from "./_components/DashboardContent";

type ProjectRow = {
  id: string;
  name: string | null;
  status: string | null;
  published: boolean | null;
  thumbnail_url: string | null;
  updated_at: string | null;
};

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
    .select("id, name, status, published, thumbnail_url, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Dashboard projects error:", error);
  }

  const safeProjects: ProjectRow[] = projects ?? [];

  // Basic stats for now. will add more later.
  const stats = {
    totalProjects: safeProjects.length,
    publishedSites: safeProjects.filter((p) => p.published === true).length,
    campaignsCreated: 0, //for now
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <DashboardContent projects={safeProjects} stats={stats} />
    </div>
  );
}
