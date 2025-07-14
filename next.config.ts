import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Removed to enable dynamic/SSR mode
  reactStrictMode: true,

  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  compress: true,
};

export default nextConfig;
