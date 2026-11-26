import { NextResponse } from "next/server";
import { recordEngagementEvent, type EngagementEventInput } from "@/lib/telemetry-store";
import {
  checkRateLimit,
  getClientIp,
  rateLimitHeaders,
} from "@/lib/rate-limit";
import { routeToWorker, getWorkerStats } from "@/lib/load-balancer";

const ALLOWED_TYPES = new Set([
  "session_start",
  "lens_toggle",
  "vector_explore",
  "diagnostic_select",
  "mandate_inspect",
  "region_switch",
  "web_vitals",
]);

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`engage:${ip}`, {
      limit: 60,
      windowMs: 60 * 1000, // 60 telemetry events per minute
    });

    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Telemetry rate limit exceeded." },
        {
          status: 429,
          headers: rateLimitHeaders(rl),
        }
      );
    }

    const body = (await request.json()) as Partial<EngagementEventInput>;
    if (!body?.type || !ALLOWED_TYPES.has(body.type)) {
      return NextResponse.json(
        { error: "Invalid engagement event type" },
        { status: 400, headers: rateLimitHeaders(rl) }
      );
    }

    // Route validated telemetry event through Weighted Round-Robin Load Balancer
    const assignedWorker = routeToWorker();

    const snapshot = await recordEngagementEvent({
      type: body.type,
      payload: body.payload,
    });

    return NextResponse.json(
      {
        ...snapshot,
        loadBalancer: {
          strategy: "weighted-round-robin",
          servedBy: assignedWorker.id,
          region: assignedWorker.region,
          pool: getWorkerStats(),
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          ...rateLimitHeaders(rl),
          "X-LB-Strategy": "weighted-round-robin",
          "X-Worker-Node": assignedWorker.id,
          "X-Worker-Region": assignedWorker.region,
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Malformed request payload" },
      { status: 400 }
    );
  }
}