"use client";

import { useEffect, useState } from "react";

type Me = {
  user: { id: string; email: string } | null;
  profile: { role: string } | null;
};

export function useMe() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { cache: "no-store" })
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
  }, []);

  const isAdmin = me?.profile?.role === "admin";
  return { me, isAdmin, loading: me === null };
}
