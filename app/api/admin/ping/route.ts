import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  return NextResponse.json({
    ok: true,
    admin: { id: admin.user.id, role: admin.profile.role },
  });
}
