// lib/auth/getServerUserAndProfile.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  role: "user" | "admin" | string;
  full_name?: string | null;
};

export async function getServerUserAndProfile() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { user: null, profile: null, supabase };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", user.id)
    .single();

  // If profile row missing for some reason,
  if (profileError) {
    return { user, profile: null, supabase };
  }

  return { user, profile: profile as Profile, supabase };
}
