"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || (!loading && !user)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xs text-slate-400">Checking authentication…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-slate-300">
          Welcome back,{" "}
          <span className="font-semibold text-emerald-400">{user?.email}</span>.
          This is your ForlessAI workspace where you’ll manage your AI-built
          websites.
        </p>
      </div>

      {/* Simple stats / info strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
          <p className="text-xs text-slate-400 mb-1">Websites</p>
          <p className="text-xl font-semibold">0</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Once you create your first project, it will appear here.
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
          <p className="text-xs text-slate-400 mb-1">Last update</p>
          <p className="text-sm text-slate-200">Just now</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Dashboard updates automatically as you work.
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
          <p className="text-xs text-slate-400 mb-1">Account</p>
          <p className="text-sm text-slate-200 truncate">{user?.email}</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Your sites will be linked to this account.
          </p>
        </div>
      </div>
    </div>
  );
}
