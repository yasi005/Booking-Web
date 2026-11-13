import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Runs before the /backend/* rewrite to the FastAPI service.
 *
 * - Drops any x-zeus-* headers a visitor tries to send, so they cannot forge them.
 * - When PROXY_SHARED_SECRET is set (server-only env var, same value on the
 *   backend), attaches it so the backend can reject traffic that bypasses the site.
 * - Passes on the client IP that the hosting platform observed, for rate limiting.
 */
const SECRET_HEADER = "x-zeus-proxy-secret";
const CLIENT_IP_HEADER = "x-zeus-client-ip";

function clientIp(request: NextRequest): string | null {
  // On Vercel these are set by the platform from the real connection.
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : null;
}

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  for (const name of [...headers.keys()]) {
    if (name.toLowerCase().startsWith("x-zeus-")) headers.delete(name);
  }

  const secret = process.env.PROXY_SHARED_SECRET;
  if (secret) {
    headers.set(SECRET_HEADER, secret);
    const ip = clientIp(request);
    if (ip) headers.set(CLIENT_IP_HEADER, ip);
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: "/backend/:path*",
};
