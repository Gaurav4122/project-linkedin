export interface WorkerNode {
  id: string;
  region: string;
  weight: number;
  healthy: boolean;
  handledCount: number;
}

const workerPool: WorkerNode[] = [
  { id: "telemetry-node-1", region: "bom1-primary", weight: 2, healthy: true, handledCount: 0 },
  { id: "telemetry-node-2", region: "bom1-replica", weight: 1, healthy: true, handledCount: 0 },
  { id: "telemetry-node-3", region: "sin1-edge", weight: 1, healthy: true, handledCount: 0 },
];

// Build weighted schedule: [node-1, node-1, node-2, node-3]
const weightedSchedule: WorkerNode[] = workerPool.flatMap((node) =>
  Array.from({ length: node.weight }, () => node)
);

let pointer = 0;

export function routeToWorker(): WorkerNode {
  const totalSlots = weightedSchedule.length;

  // Try up to totalSlots times to pick the next healthy worker in Weighted Round-Robin order
  for (let i = 0; i < totalSlots; i++) {
    const candidate = weightedSchedule[pointer % totalSlots];
    pointer = (pointer + 1) % totalSlots;

    if (candidate.healthy) {
      candidate.handledCount += 1;
      return candidate;
    }
  }

  // Fallback if all nodes are degraded
  const fallback = workerPool[0];
  fallback.handledCount += 1;
  return fallback;
}

export function getWorkerStats() {
  return workerPool.map(({ id, region, weight, healthy, handledCount }) => ({
    id,
    region,
    weight,
    healthy,
    handledCount,
  }));
}