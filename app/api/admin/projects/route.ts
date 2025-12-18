import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { supabase } = admin;

  // Adjust selected columns to match your schema
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, slug, user_id, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects: data ?? [] });
}
