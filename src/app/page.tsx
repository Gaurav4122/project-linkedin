import { getPulseSnapshot } from "@/lib/telemetry-store";
import { ClarityShell } from "@/components/clarity-shell";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialPulse = await getPulseSnapshot();
  return <ClarityShell initialPulse={initialPulse} />;
}
