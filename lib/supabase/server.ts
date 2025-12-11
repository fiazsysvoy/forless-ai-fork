// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// If you have generated types, you can do:
// import type { Database } from "@/types/supabase";
// export async function createServerSupabaseClient(): Promise<SupabaseClient<Database>> {
export async function createServerSupabaseClient(): Promise<SupabaseClient> {
  // ⬅️ Next 15: cookies() is async
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // You can also pass cookieOptions here if you like (name, domain, maxAge, etc.)
      // cookieOptions: { name: "sb-auth", ... },

      cookies: {
        // Supabase now prefers getAll / setAll
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Next docs: cookieStore.set(name, value, options) is valid
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch {
            // In Server Components cookies can be read-only, and that's OK.
            // Middleware will usually be responsible for refreshing sessions.
          }
        },
      },
    }
  );

  return supabase;
}
