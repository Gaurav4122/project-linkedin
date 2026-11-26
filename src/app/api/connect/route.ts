import { NextResponse } from "next/server";
import { recordConnection } from "@/lib/telemetry-store";
import type { CausalityVectorId } from "@/data/sonia-profile";
import {
  checkRateLimit,
  getClientIp,
  rateLimitHeaders,
} from "@/lib/rate-limit";
import {
  buildFingerprint,
  getIdempotentReceipt,
  saveIdempotentReceipt,
} from "@/lib/idempotency";

const VALID_VECTORS = new Set<CausalityVectorId>(["brand", "messaging", "operations", "people"]);

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`connect:${ip}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000, // 5 submissions per 10 minutes
    });

    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: `Too many Clarity Briefs submitted. Please wait ${rl.retryAfterSec}s before trying again.`,
        },
        {
          status: 429,
          headers: rateLimitHeaders(rl),
        }
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const organization = typeof body.organization === "string" ? body.organization.trim() : "";
    const contact = typeof body.contact === "string" ? body.contact.trim() : "";
    const intent = typeof body.intent === "string" ? body.intent.trim() : "";
    const focusVector =
      typeof body.focusVector === "string" && VALID_VECTORS.has(body.focusVector as CausalityVectorId)
        ? (body.focusVector as CausalityVectorId)
        : "brand";
    const note = typeof body.note === "string" ? body.note.trim() : "";

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json({ error: "Please enter your name (2–80 characters)." }, { status: 400 });
    }
    if (contact.length < 3 || contact.length > 120) {
      return NextResponse.json(
        { error: "Please share an email or LinkedIn profile so Sonia can reply." },
        { status: 400 }
      );
    }
    if (!intent) {
      return NextResponse.json({ error: "Please select a conversation intent." }, { status: 400 });
    }
    if (note.length < 8 || note.length > 1000) {
      return NextResponse.json(
        { error: "Please share a short note (8–1000 characters) about what you're building." },
        { status: 400 }
      );
    }

    // Check Idempotency Key (header or deterministic payload fingerprint) before writing
    const idemKey =
      request.headers.get("x-idempotency-key")?.trim() ||
      buildFingerprint({ name, contact, intent, note });

    const cachedReceipt = getIdempotentReceipt(idemKey);
    if (cachedReceipt) {
      return NextResponse.json(cachedReceipt.body, {
        status: cachedReceipt.status,
        headers: {
          "Cache-Control": "no-store",
          ...rateLimitHeaders(rl),
          "X-Idempotent-Replay": "true",
        },
      });
    }

    const result = await recordConnection({
      name,
      organization: organization.slice(0, 80),
      contact,
      intent: intent.slice(0, 80),
      focusVector,
      note,
    });

    // Save receipt for 5 minutes so double-clicks/retries never create duplicate briefs
    saveIdempotentReceipt(idemKey, 201, result);

    return NextResponse.json(result, {
      status: 201,
      headers: {
        "Cache-Control": "no-store",
        ...rateLimitHeaders(rl),
        "X-Idempotent-Replay": "false",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to process connection brief." }, { status: 400 });
  }
}