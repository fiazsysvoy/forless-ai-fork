// components/dashboard/NewProjectButton.tsx
"use client";

import { useState } from "react";

export default function NewProjectButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    const name = prompt("Project name?");
    if (!name) return;

    try {
      setLoading(true);
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to create project");
        return;
      }

      // For now, simple refresh
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-md border border-emerald-500 px-3 py-1 text-sm disabled:opacity-60"
    >
      {loading ? "Creating..." : "New Project"}
    </button>
  );
}
