// components/website/hooks/useUnsplashImage.ts
"use client";

import { useEffect, useState } from "react";
import { fetchUnsplashImage } from "@/lib/unsplash";

export function useUnsplashImage(query: string) {
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!query) return;
    let cancelled = false;

    fetchUnsplashImage(query).then((url) => {
      if (!cancelled) setImage(url);
    });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return image;
}
