import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getAdminStats() {
  const supabase = await createServerSupabaseClient();

  const [projects, sites, users] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  return {
    projects: projects.count ?? 0,
    sites: sites.count ?? 0,
    users: users.count ?? 0,
  };
}

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin.ok) return redirect("/dashboard");

  const stats = await getAdminStats();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 text-text">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Signed in as <span className="text-text">{admin.user.email}</span>
            <span className="mx-2 opacity-40">•</span>
            Role:{" "}
            <span className="text-primary font-medium">
              {admin.profile.role}
            </span>
          </p>
        </div>

        <a href="/dashboard" className="btn-secondary">
          ← Back to Dashboard
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Projects",
            value: stats.projects,
            hint: "Total created projects",
          },
          {
            label: "Published Sites",
            value: stats.sites,
            hint: "Live websites",
          },
          { label: "Users", value: stats.users, hint: "Registered accounts" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-700 bg-bg-card p-4"
          >
            <div className="text-xs text-text-muted">{item.label}</div>
            <div className="mt-2 text-2xl font-semibold">{item.value}</div>
            <div className="mt-1 text-xs text-text-muted">{item.hint}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-bg-card p-5">
          <h2 className="text-base font-semibold">Users</h2>
          <p className="mt-1 text-sm text-text-muted">
            Manage users, assign roles, and suspend accounts.
          </p>
          <a
            href="/admin/users"
            className="btn-fill mt-4 inline-flex px-4 py-2"
          >
            Manage Users
          </a>
        </div>

        <div className="rounded-xl border border-slate-700 bg-bg-card p-5">
          <h2 className="text-base font-semibold">Projects</h2>
          <p className="mt-1 text-sm text-text-muted">
            View and inspect all user projects.
          </p>
          <a
            href="/admin/projects"
            className="btn-fill mt-4 inline-flex px-4 py-2"
          >
            View Projects
          </a>
        </div>

        <div className="rounded-xl border border-slate-700 bg-bg-card p-5">
          <h2 className="text-base font-semibold">Sites</h2>
          <p className="mt-1 text-sm text-text-muted">
            Moderate published websites and unpublish content.
          </p>
          <a
            href="/admin/sites"
            className="btn-fill mt-4 inline-flex px-4 py-2"
          >
            Moderate Sites
          </a>
        </div>
      </div>
    </div>
  );
}
