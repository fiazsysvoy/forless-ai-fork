"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ResetPasswordUpdatePage() {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(
    "Setting a new password for your ForlessAI account."
  );
  const [linkInvalid, setLinkInvalid] = useState(false);

  // Optional: check session exists (user came from valid email link)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setLinkInvalid(true);
        setInfo(
          "This reset link is invalid or expired. Please request a new reset email."
        );
        toast.error("Reset link invalid or expired.");
      }
    };

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const t = toast.loading("Updating password...");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      toast.dismiss(t);

      if (error) {
        toast.error(error.message || "Failed to update password.");
        return;
      }

      toast.success("Password updated. Redirecting to login...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.dismiss(t);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-hover mb-2">
            ForlessAI
          </p>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            Choose a new password
          </h1>
          {info && <p className="text-xs text-slate-400">{info}</p>}
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1.5">
              New password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading || linkInvalid}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/70 disabled:opacity-60"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1.5">
              Confirm new password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading || linkInvalid}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/70 disabled:opacity-60"
              placeholder="Repeat new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || linkInvalid}
            className="mt-1 w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving new password..." : "Update password"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          Remembered your password?{" "}
          <a
            href="/auth/login"
            className="text-primary-hover hover:text-emerald-300 underline underline-offset-2"
          >
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}
