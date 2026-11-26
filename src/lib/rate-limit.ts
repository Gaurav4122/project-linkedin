interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
}

const requestLogs = new Map<string, number[]>();

// Periodic cleanup to prevent memory growth on long-lived processes
let lastCleanup = Date.now();
function pruneExpired(now: number, maxAgeMs: number) {
  if (now - lastCleanup < maxAgeMs) return;
  lastCleanup = now;
  for (const [key, timestamps] of requestLogs.entries()) {
    const valid = timestamps.filter((ts) => now - ts < maxAgeMs);
    if (valid.length === 0) requestLogs.delete(key);
    else requestLogs.set(key, valid);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  pruneExpired(now, config.windowMs);

  const windowStart = now - config.windowMs;
  const timestamps = (requestLogs.get(identifier) ?? []).filter(
    (ts) => ts > windowStart
  );

  if (timestamps.length >= config.limit) {
    const oldest = timestamps[0] ?? now;
    const resetAt = oldest + config.windowMs;
    const retryAfterSec = Math.max(1, Math.ceil((resetAt - now) / 1000));
    requestLogs.set(identifier, timestamps);

    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetAt,
      retryAfterSec,
    };
  }

  timestamps.push(now);
  requestLogs.set(identifier, timestamps);

  const oldest = timestamps[0] ?? now;
  const resetAt = oldest + config.windowMs;

  return {
    allowed: true,
    limit: config.limit,
    remaining: Math.max(0, config.limit - timestamps.length),
    resetAt,
    retryAfterSec: 0,
  };
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
  if (!result.allowed) {
    headers["Retry-After"] = String(result.retryAfterSec);
  }
  return headers;
}