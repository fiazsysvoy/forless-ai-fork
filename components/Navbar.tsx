"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useState } from "react";

export function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // 👇 match your actual route structure
    router.push("/auth/login");
  };

  return (
    <header className="border-b border-slate-800 bg-bg-card backdrop-blur">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden">
            <Image
              src="/img.jpeg"
              alt="ForlessAI Logo"
              width={32}
              height={32}
              className="object-cover mt-1.5"
            />
          </div>

          <span className="font-semibold tracking-tight text-sm sm:text-base">
            ForlessAI
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <Link href="/" className="text-slate-300 hover:text-white">
            Home
          </Link>
          <Link
            href="/website-builder"
            className="text-slate-300 hover:text-white"
          >
            Website-builder
          </Link>

          {user && (
            <Link href="/dashboard" className="text-slate-300 hover:text-white">
              Dashboard
            </Link>
          )}

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {loading ? (
            <span className="text-slate-500 text-xs">Checking auth…</span>
          ) : user ? (
            <>
              <button
                onClick={handleLogout}
                className="text-slate-300 hover:text-white"
              >
                Logout
              </button>
              <button className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[10px]">
                  {user.email?.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.email}</span>
                <span className="text-[10px] text-slate-400">▾</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-slate-300 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-md bg-primary px-3 py-1 text-slate-950 font-semibold hover:bg-primary-hover transition text-xs sm:text-sm"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
