import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const rl = checkRateLimit(`page-home:${ip}`, {
      limit: 30,
      windowMs: 60 * 1000,
    });

    if (!rl.allowed) {
      return new NextResponse(
        `Too Many Requests — Please wait ${rl.retryAfterSec}s before refreshing.`,
        {
          status: 429,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            ...rateLimitHeaders(rl),
          },
        }
      );
    }

    const res = NextResponse.next();
    Object.entries(rateLimitHeaders(rl)).forEach(([k, v]) =>
      res.headers.set(k, v)
    );
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};