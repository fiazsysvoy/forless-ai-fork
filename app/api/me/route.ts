import { NextResponse } from "next/server";
import { getServerUserAndProfile } from "@/lib/auth/getServerUserAndProfile";

export async function GET() {
  const { user, profile } = await getServerUserAndProfile();

  if (!user) {
    return NextResponse.json({ user: null, profile: null }, { status: 200 });
  }

  return NextResponse.json({
    user: { id: user.id, email: user.email },
    profile: profile ? { role: profile.role } : null,
  });
}
