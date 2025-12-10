"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8  overflow-hidden">
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
              <span className="hidden sm:inline text-slate-400 text-xs">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-300 hover:text-white">
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-emerald-500 px-3 py-1 text-slate-950 font-semibold hover:bg-emerald-400 transition text-xs sm:text-sm"
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
