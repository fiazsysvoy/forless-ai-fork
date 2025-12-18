import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { data, error } = await admin.supabase
    .from("projects")
    .select("id, name, slug, user_id, is_published, published_at, updated_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(200);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ sites: data ?? [] });
}
