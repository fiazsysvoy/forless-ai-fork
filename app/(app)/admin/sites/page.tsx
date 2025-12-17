import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { UnpublishButton } from "../_components/UnpublishButton";
// import { UnpublishButton } from "./_components/UnpublishButton";

type SiteRow = {
  id: string;
  name: string | null;
  slug: string | null;
  user_id: string | null;
  updated_at: string | null;
};

export default async function AdminSitesPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/dashboard");

  // IMPORTANT: adjust this filter to match your real "published" logic.
  const { data } = await admin.supabase
    .from("projects")
    .select("id, name, slug, user_id, updated_at")
    .not("slug", "is", null)
    .order("updated_at", { ascending: false })
    .limit(200);

  const sites = (data ?? []) as SiteRow[];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin · Sites</h1>
        <a href="/admin" className="text-sm text-white/70 hover:text-white">
          Back
        </a>
      </div>

      <div className="mt-4 space-y-3">
        {sites.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium">
                  {s.name ?? "(no name)"}{" "}
                  {s.slug ? (
                    <span className="text-white/60">· {s.slug}</span>
                  ) : null}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  Project ID: {s.id}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  Owner: {s.user_id ?? "—"}
                </div>
              </div>

              <UnpublishButton projectId={s.id} />
            </div>
          </div>
        ))}

        {sites.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            No published sites found.
          </div>
        )}
      </div>
    </div>
  );
}
