import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:4000";

const nextConfig: NextConfig = {
  // Standalone is for Docker self-hosting only — Vercel sets VERCEL=1 automatically.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "hostaway-platform.s3.us-west-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
