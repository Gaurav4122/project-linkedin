import { NextResponse } from "next/server";
import { getPulseSnapshot } from "@/lib/telemetry-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getPulseSnapshot();
  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
