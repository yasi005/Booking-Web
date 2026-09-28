import type { NextConfig } from "next";

const backendUrl = (
  process.env.BACKEND_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:4000"
).replace(/\/$/, "");

// On Vercel, /backend/* proxies to Railway. Warn if unset — do not fail the build
// so the site can still deploy; set BACKEND_INTERNAL_URL + NEXT_PUBLIC_API_URL
// in Vercel → Settings → Environment Variables, then redeploy for live API.
if (
  process.env.VERCEL &&
  (!backendUrl ||
    backendUrl.includes("localhost") ||
    backendUrl.includes("127.0.0.1"))
) {
  console.warn(
    "[book] BACKEND_INTERNAL_URL / NEXT_PUBLIC_API_URL is missing or localhost. " +
      "Set both to your Railway HTTPS URL (e.g. https://your-service.up.railway.app) " +
      "in Vercel env vars, then redeploy — otherwise /backend/* will not reach the API.",
  );
}

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
    // Next 16 requires quality values to be allowlisted; 90 is for the hero slider.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
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
