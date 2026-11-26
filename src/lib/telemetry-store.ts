import { promises as fs } from "fs";
import path from "path";
import type { CausalityVectorId } from "@/data/sonia-profile";

export interface EngagementEventInput {
  type:
    | "session_start"
    | "lens_toggle"
    | "vector_explore"
    | "diagnostic_select"
    | "mandate_inspect"
    | "region_switch"
    | "web_vitals";
  payload?: {
    vector?: CausalityVectorId;
    scenarioId?: string;
    mandateId?: string;
    region?: string;
    device?: "mobile" | "desktop";
    lcpMs?: number;
    cls?: number;
    fcpMs?: number;
  };
}

export interface ConnectSubmission {
  id: string;
  name: string;
  organization: string;
  contact: string;
  intent: string;
  focusVector: CausalityVectorId;
  note: string;
  createdAt: string;
}

export interface PulseSnapshot {
  totalSessions: number;
  lensActivations: number;
  deviceSplit: {
    mobile: number;
    desktop: number;
  };
  vectorCounts: Record<CausalityVectorId, number>;
  diagnosticCounts: Record<string, number>;
  mandateCounts: Record<string, number>;
  vitalsSamples: {
    count: number;
    avgLcpMs: number | null;
    avgCls: number | null;
    avgFcpMs: number | null;
  };
  recentConnections: Array<{
    id: string;
    intent: string;
    focusVector: CausalityVectorId;
    organization: string;
    createdAt: string;
  }>;
  lastUpdatedAt: string;
  storageMode: "filesystem" | "memory";
}

interface InternalStoreState extends Omit<PulseSnapshot, "storageMode"> {
  lcpSum: number;
  clsSum: number;
  fcpSum: number;
  connections: ConnectSubmission[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "telemetry.json");

const DEFAULT_STATE: InternalStoreState = {
  totalSessions: 1,
  lensActivations: 0,
  deviceSplit: {
    mobile: 0,
    desktop: 1,
  },
  vectorCounts: {
    brand: 0,
    messaging: 0,
    operations: 0,
    people: 0,
  },
  diagnosticCounts: {
    "unclear-messaging": 0,
    "fragmented-ops": 0,
    "zero-to-one-startup": 0,
    "regulated-global": 0,
  },
  mandateCounts: {
    ismokestack: 0,
    "celestial-ai": 0,
    "ayu-lifescience": 0,
    "ayu-inc-usa": 0,
    "datt-mediproducts": 0,
  },
  vitalsSamples: {
    count: 0,
    avgLcpMs: null,
    avgCls: null,
    avgFcpMs: null,
  },
  lcpSum: 0,
  clsSum: 0,
  fcpSum: 0,
  recentConnections: [],
  connections: [],
  lastUpdatedAt: new Date().toISOString(),
};

let memoryFallback: InternalStoreState | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function cloneDefault(): InternalStoreState {
  return JSON.parse(JSON.stringify(DEFAULT_STATE)) as InternalStoreState;
}

async function readState(): Promise<{ state: InternalStoreState; mode: "filesystem" | "memory" }> {
  if (memoryFallback) {
    return { state: memoryFallback, mode: "memory" };
  }
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as InternalStoreState;
    return { state: parsed, mode: "filesystem" };
  } catch {
    return { state: cloneDefault(), mode: "filesystem" };
  }
}

async function writeState(state: InternalStoreState): Promise<"filesystem" | "memory"> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
    return "filesystem";
  } catch {
    memoryFallback = state;
    return "memory";
  }
}

function toPublicSnapshot(state: InternalStoreState, mode: "filesystem" | "memory"): PulseSnapshot {
  return {
    totalSessions: state.totalSessions,
    lensActivations: state.lensActivations,
    deviceSplit: state.deviceSplit,
    vectorCounts: state.vectorCounts,
    diagnosticCounts: state.diagnosticCounts,
    mandateCounts: state.mandateCounts,
    vitalsSamples: state.vitalsSamples,
    recentConnections: state.recentConnections.slice(0, 6),
    lastUpdatedAt: state.lastUpdatedAt,
    storageMode: mode,
  };
}

export async function getPulseSnapshot(): Promise<PulseSnapshot> {
  const { state, mode } = await readState();
  return toPublicSnapshot(state, mode);
}

export async function recordEngagementEvent(event: EngagementEventInput): Promise<PulseSnapshot> {
  let resultSnapshot: PulseSnapshot | null = null;

  writeQueue = writeQueue.then(async () => {
    const { state } = await readState();
    const p = event.payload ?? {};

    switch (event.type) {
      case "session_start": {
        state.totalSessions += 1;
        if (p.device === "mobile") state.deviceSplit.mobile += 1;
        else if (p.device === "desktop") state.deviceSplit.desktop += 1;
        break;
      }
      case "lens_toggle": {
        state.lensActivations += 1;
        break;
      }
      case "vector_explore": {
        if (p.vector && p.vector in state.vectorCounts) {
          state.vectorCounts[p.vector] += 1;
        }
        break;
      }
      case "diagnostic_select": {
        if (p.scenarioId) {
          state.diagnosticCounts[p.scenarioId] = (state.diagnosticCounts[p.scenarioId] ?? 0) + 1;
        }
        break;
      }
      case "mandate_inspect": {
        if (p.mandateId) {
          state.mandateCounts[p.mandateId] = (state.mandateCounts[p.mandateId] ?? 0) + 1;
        }
        break;
      }
      case "web_vitals": {
        if (typeof p.lcpMs === "number" && p.lcpMs > 0 && p.lcpMs < 60000) {
          const nextCount = state.vitalsSamples.count + 1;
          state.vitalsSamples.count = nextCount;
          state.lcpSum += p.lcpMs;
          state.clsSum += typeof p.cls === "number" ? Math.max(0, p.cls) : 0;
          state.fcpSum += typeof p.fcpMs === "number" ? Math.max(0, p.fcpMs) : 0;
          state.vitalsSamples.avgLcpMs = Math.round(state.lcpSum / nextCount);
          state.vitalsSamples.avgCls = Number((state.clsSum / nextCount).toFixed(4));
          state.vitalsSamples.avgFcpMs = Math.round(state.fcpSum / nextCount);
        }
        break;
      }
      default:
        break;
    }

    state.lastUpdatedAt = new Date().toISOString();
    const mode = await writeState(state);
    resultSnapshot = toPublicSnapshot(state, mode);
  });

  await writeQueue;
  return resultSnapshot!;
}

export async function recordConnection(
  input: Omit<ConnectSubmission, "id" | "createdAt">
): Promise<{ submission: ConnectSubmission; snapshot: PulseSnapshot }> {
  let submission!: ConnectSubmission;
  let snapshot!: PulseSnapshot;

  writeQueue = writeQueue.then(async () => {
    const { state } = await readState();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    submission = {
      ...input,
      id: `CLR-${randomCode}`,
      createdAt: new Date().toISOString(),
    };
    state.connections.unshift(submission);
    state.recentConnections.unshift({
      id: submission.id,
      intent: submission.intent,
      focusVector: submission.focusVector,
      organization: submission.organization || "Independent Founder",
      createdAt: submission.createdAt,
    });
    state.recentConnections = state.recentConnections.slice(0, 12);
    state.vectorCounts[input.focusVector] = (state.vectorCounts[input.focusVector] ?? 0) + 1;
    state.lastUpdatedAt = submission.createdAt;

    const mode = await writeState(state);
    snapshot = toPublicSnapshot(state, mode);
  });

  await writeQueue;
  return { submission, snapshot };
}
