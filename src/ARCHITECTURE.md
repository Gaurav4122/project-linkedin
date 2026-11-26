# System Architecture & Scalability Design — Soniaa Clarity Lens

## 1. High-Level Overview

**Soniaa Clarity Lens** is built on **Next.js (App Router)** with a clear separation between its interactive client telemetry layer and a resilient, horizontally aware backend designed for high concurrency, burst protection, and serverless deployment on **Vercel**.

```text
                        [ Incoming Client Traffic ]
                                     │
                                     ▼
            ┌─────────────────────────────────────────────────┐
            │   Edge / Middleware Layer (src/middleware.ts)   │
            │  • Sliding-Window Page Flood Guard (30 req/min) │
            └────────────────────────┬────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
[ POST /api/connect ]       [ POST /api/engage ]       [ GET /api/telemetry ]
• Rate Limit (5/10m)        • Rate Limit (60/1m)       • Weak ETag Validation
• Payload Validation        • Event Allowlist          • 304 Not Modified
• Idempotency Guard         • Weighted Round-Robin     • Edge SWR Caching
  (5m TTL Replay Cache)       Load Balancer (2:1:1)      (s-maxage=5, swr=30)
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     ▼
            ┌─────────────────────────────────────────────────┐
            │    Storage & Concurrency Layer (telemetry-store)│
            │  • Promise-Chained Mutex (`writeQueue`)         │
            │  • Atomic JSON Persistence + Serverless Fallback│
            │  • PII-Stripped Public Snapshot Projection      │
            └─────────────────────────────────────────────────┘