"use client";

import { FormEvent, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ResetPasswordRequestPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const handleResetRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const t = toast.loading("Sending reset link...");

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password/update`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      toast.dismiss(t);

      if (error) {
        toast.error(error.message || "Failed to send reset link.");
        return;
      }

      toast.success("Reset link sent. Please check your email to continue.");

      setEmail("");
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
            Reset your password
          </h1>
          <p className="text-xs text-slate-400">
            Enter the email linked with your ForlessAI account. We&apos;ll send
            you a secure link to create a new password.
          </p>
        </div>

        <form onSubmit={handleResetRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1.5">
              Email address
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

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          Remembered it?{" "}
          <a
            href="/auth/login"
            className="text-primary-hover hover:text-emerald-300 underline underline-offset-2"
          >
            Go back to login
          </a>
        </p>
      </div>
    </div>
  );
}
