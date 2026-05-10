import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // No trailing slash on URLs. Next will emit folder-based static files
  // (e.g. `out/blog/index.html`) and any modern static host (Vercel,
  // Cloudflare Pages, Netlify, nginx with `try_files`) will serve them
  // at the clean URL `/blog`. Per the user's spec — "URL 最後一個 /
  // 取消掉，文件夾實現" — this is exactly that contract.
  trailingSlash: false,
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
