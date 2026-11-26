interface CachedReceipt {
  status: number;
  body: unknown;
  expiresAt: number;
}

const receiptStore = new Map<string, CachedReceipt>();

export function buildFingerprint(payload: {
  name?: string;
  contact?: string;
  intent?: string;
  note?: string;
}): string {
  return [payload.name, payload.contact, payload.intent, payload.note]
    .map((v) => (v ?? "").trim().toLowerCase())
    .join("|");
}

export function getIdempotentReceipt(key: string): CachedReceipt | null {
  const entry = receiptStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    receiptStore.delete(key);
    return null;
  }
  return entry;
}

export function saveIdempotentReceipt(
  key: string,
  status: number,
  body: unknown,
  ttlMs = 5 * 60 * 1000
) {
  receiptStore.set(key, { status, body, expiresAt: Date.now() + ttlMs });
}