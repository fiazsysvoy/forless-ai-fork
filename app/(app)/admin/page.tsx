import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/dashboard");

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-white/70">
        {admin.user.email} · role: {admin.profile.role}
      </p>
      <a
        href="/admin/projects"
        className="mt-4 inline-block rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white"
      >
        View Projects
      </a>
      <a
        href="/admin/sites"
        className="mt-4 inline-block rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white"
      >
        Moderate Sites
      </a>
    </div>
  );
}
