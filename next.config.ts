import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "source.unsplash.com", pathname: "/**" },
    ],
  },

  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://lvh.me:3000",

      // Try wildcard first (if your Next build supports it)
      "http://*.lvh.me:3000",
    ],
  },
};

export default nextConfig;
