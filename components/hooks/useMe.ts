"use client";

import { useEffect, useState } from "react";

type Me = {
  user: { id: string; email: string } | null;
  profile: { role: string } | null;
};

export function useMe(userId?: string) {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    let alive = true;

    // reset immediately s
    setMe(null);

    fetch("/api/me", {
      method: "GET",
      cache: "no-store",
      headers: { "Cache-Control": "no-store" },
    })
      .then((r) => r.json())
      .then((data) => {
        if (alive) setMe(data);
      })
      .catch(() => {
        if (alive) setMe({ user: null, profile: null });
      });

    return () => {
      alive = false;
    };
  }, [userId]); // 👈 refetch whenever auth user changes

  const isAdmin = me?.profile?.role === "admin";
  return { me, isAdmin, loading: me === null };
}
