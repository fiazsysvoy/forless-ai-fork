import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";

type ProjectRow = {
  id: string;
  name: string | null;
  slug: string | null;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export default async function AdminProjectsPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/dashboard");

  const { data, error } = await admin.supabase
    .from("projects")
    .select("id, name, slug, user_id, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const projects = (data ?? []) as ProjectRow[];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin · Projects</h1>
        <a href="/admin" className="text-sm text-white/70 hover:text-white">
          Back
        </a>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          Error loading projects: {error.message}
          <div className="mt-2 text-white/70">
            If this is an RLS issue, we’ll fix it in the next step without
            breaking users.
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/70">
              Total shown: <span className="text-white">{projects.length}</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">
                      {p.name ?? "(no name)"}{" "}
                      {p.slug ? (
                        <span className="text-white/60">· {p.slug}</span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      Project ID: {p.id}
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      Owner: {p.user_id ?? "—"}
                    </div>
                  </div>

                  <a
                    href={`/dashboard/projects/${p.id}`}
                    className="text-sm text-white/70 hover:text-white underline"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
                No projects returned. If you know projects exist, it’s likely
                RLS blocking admin reads — we’ll handle that next.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
