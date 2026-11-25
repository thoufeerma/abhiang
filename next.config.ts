import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is a single static page: export plain HTML/CSS/JS to /out
  // so Cloudflare serves it as static assets (no server code to hang).
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
