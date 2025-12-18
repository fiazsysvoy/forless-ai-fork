import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 text-text">
      {/* Header */}
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

        <a
          href="/dashboard"
          className="rounded-md border border-slate-700 bg-bg-card px-3 py-1.5 text-sm text-text-muted hover:text-text transition"
        >
          ← Back to Dashboard
        </a>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Projects", hint: "Total created projects" },
          { label: "Published Sites", hint: "Live websites" },
          { label: "Users", hint: "Registered accounts" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-700 bg-bg-card p-4"
          >
            <div className="text-xs text-text-muted">{item.label}</div>
            <div className="mt-2 text-2xl font-semibold">—</div>
            <div className="mt-1 text-xs text-text-muted">{item.hint}</div>
          </div>
        ))}
      </div>

      {/* Management Sections */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Projects */}
        <div className="rounded-xl border border-slate-700 bg-bg-card p-5">
          <h2 className="text-base font-semibold">Projects</h2>
          <p className="mt-1 text-sm text-text-muted">
            View and inspect all user projects.
          </p>

          <div className="mt-4 flex gap-3">
            <button className="btn-fill">
              <a href="/admin/projects">View Projects</a>
            </button>

            <button className="rounded-md border border-slate-700 bg-bg-card px-4 py-1.5 text-sm text-text-muted hover:text-text transition">
              <a href="/admin/projects?filter=recent">Recent</a>
            </button>
          </div>
        </div>

        {/* Sites */}
        <div className="rounded-xl border border-slate-700 bg-bg-card p-5">
          <h2 className="text-base font-semibold">Sites</h2>
          <p className="mt-1 text-sm text-text-muted">
            Moderate published websites and unpublish content.
          </p>

          <div className="mt-4 flex gap-3">
            <button className="btn-fill">
              <a href="/admin/sites">Moderate Sites</a>
            </button>

            <button className="rounded-md border border-slate-700 bg-bg-card px-4 py-1.5 text-sm text-text-muted hover:text-text transition">
              <a href="/admin/sites?filter=latest">Latest</a>
            </button>
          </div>
        </div>

        {/* Users */}
        <div className="rounded-xl border border-slate-700 bg-bg-card p-5">
          <h2 className="text-base font-semibold">Users</h2>
          <p className="mt-1 text-sm text-text-muted">
            Manage users, assign roles, and suspend accounts.
          </p>

          <div className="mt-4 flex gap-3">
            <button className="btn-fill">
              <a href="/admin/users">Manage Users</a>
            </button>
            <button className="rounded-md border border-slate-700 bg-bg-card px-4 py-1.5 text-sm text-text-muted hover:text-text transition">
              <a href="/admin/users?filter=suspended">Suspended</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
