import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // Static export disables the default optimizer; mark images unoptimized
    // so <Image /> still works at build time without a custom loader.
    unoptimized: true,
  },
  // Surface real bugs but don't ship retro effects with the strict-mode
  // double-render baggage in production.
  reactStrictMode: true,
};

export default nextConfig;
