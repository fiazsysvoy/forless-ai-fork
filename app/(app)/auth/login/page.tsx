"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Success → go to dashboard (or wherever you want)
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-hover mb-2">
            ForlessAI
          </p>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-xs text-slate-400">
            Log in to continue building and managing your AI-generated websites.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-3 rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-200">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/70"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-200">
                Password
              </label>
              <button
                type="button"
                onClick={() => router.push("/reset-password")}
                className="text-[11px] text-primary-hover hover:text-emerald-300 underline underline-offset-2"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/70"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-xs text-slate-400">
          Dont have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="text-primary-hover hover:text-emerald-300 underline underline-offset-2"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

// create table profiles (
//   id uuid primary key references auth.users (id) on delete cascade,
//   full_name text,
//   avatar_url text,
//   role text default 'user',
//   onboarded boolean default false,
//   created_at timestamptz default now()
// );

// alter table profiles enable row level security;

// create policy "profiles_select_own" on profiles
//   for select using (auth.uid() = id);

// create policy "profiles_insert_own" on profiles
//   for insert with check (auth.uid() = id);

// create policy "profiles_update_own" on profiles
//   for update using (auth.uid() = id);
