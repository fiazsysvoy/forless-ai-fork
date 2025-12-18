// lib/auth/requireAdmin.ts
import { getServerUserAndProfile } from "./getServerUserAndProfile";

export async function requireAdmin() {
  const { user, profile, supabase } = await getServerUserAndProfile();

  if (!user) {
    return { ok: false as const, status: 401, error: "Not authenticated" };
  }

  if (profile?.role !== "admin") {
    return { ok: false as const, status: 403, error: "Forbidden" };
  }

  return { ok: true as const, user, profile, supabase };
}
