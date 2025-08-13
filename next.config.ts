import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Removed to enable dynamic/SSR mode
  reactStrictMode: true,

  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
};

export default nextConfig;
