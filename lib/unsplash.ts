export async function fetchUnsplashImage(query: string): Promise<string> {
  const accessKey =
    process.env.UNSPLASH_ACCESS_KEY ||
    process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  const fallback =
    "https://images.unsplash.com/photo-1526045612212-70caf35c14df?fit=crop&w=1200&h=675&q=80";

  if (!accessKey) {
    console.warn("Unsplash access key missing");
    return fallback;
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&client_id=${accessKey}&per_page=1`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (data?.results?.length > 0) {
      const img = data.results[0].urls.raw;

      return `${img}&fit=crop&w=1200&h=675&q=80`;
    }

    return fallback;
  } catch (error) {
    console.error("Unsplash fetch error:", error);
    return fallback;
  }
}
