"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  X,
  Gauge,
  CheckCircle2,
  Search,
  Compass,
  SlidersHorizontal,
  Send,
} from "lucide-react";
import { WebVitalsTracker, type VitalsMetrics } from "@/components/web-vitals-tracker";
import { ClarityLensStage } from "@/components/clarity-lens-stage";
import { CausalityOrbit } from "@/components/causality-orbit";
import { DiagnosticConstellation } from "@/components/diagnostic-constellation";
import { ConnectAndPulse } from "@/components/connect-and-pulse";
import type { CausalityVectorId } from "@/data/sonia-profile";
import type { PulseSnapshot } from "@/lib/telemetry-store";

interface ClarityShellProps {
  initialPulse: PulseSnapshot;
}

export function ClarityShell({ initialPulse }: ClarityShellProps) {
  const [pulse, setPulse] = useState<PulseSnapshot>(initialPulse);
  const [clarityActive, setClarityActive] = useState(false);
  const [activeVector, setActiveVector] = useState<CausalityVectorId>("brand");
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [vitals, setVitals] = useState<VitalsMetrics>({
    lcpMs: null,
    cls: null,
    fcpMs: null,
  });

  const postEngagement = useCallback(
    async (type: string, payload?: Record<string, unknown>) => {
      try {
        const res = await fetch("/api/engage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, payload }),
        });
        if (res.ok) {
          const updated = (await res.json()) as PulseSnapshot;
          setPulse(updated);
        }
      } catch {
        // Non-blocking telemetry
      }
    },
    []
  );

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    void postEngagement("session_start", { device: isMobile ? "mobile" : "desktop" });
  }, [postEngagement]);

  const handleReportVitals = useCallback(
    (metrics: VitalsMetrics) => {
      void postEngagement("web_vitals", {
        lcpMs: metrics.lcpMs,
        cls: metrics.cls,
        fcpMs: metrics.fcpMs,
      });
    },
    [postEngagement]
  );

  const handleToggleClarity = () => {
    setClarityActive((prev) => !prev);
    void postEngagement("lens_toggle");
  };

  const handleSelectVector = (vector: CausalityVectorId) => {
    setActiveVector(vector);
    void postEngagement("vector_explore", { vector });
  };

  const handleJumpToVector = (vector: CausalityVectorId) => {
    handleSelectVector(vector);
    document.getElementById("causality")?.scrollIntoView({ behavior: "smooth" });
  };

  const totalVectorClicks = Object.values(pulse.vectorCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="relative min-h-screen pb-20 md:pb-8">
      <WebVitalsTracker
        onMetricsUpdate={setVitals}
        onReportToServer={handleReportVitals}
      />

      {/* Sticky Glass Navigation Bar */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-800/70 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="#lens"
            className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-slate-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
              🔍
            </span>
            <span>SONYA</span>
            <span className="hidden sm:inline font-mono text-[11px] font-normal text-slate-400">
              / Clarity Lens
            </span>
          </a>

          <nav aria-label="Primary chapters" className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#lens" className="hover:text-cyan-300 transition">
              01 Lens
            </a>
            <a href="#causality" className="hover:text-cyan-300 transition">
              02 Causality
            </a>
            <a href="#diagnostic" className="hover:text-cyan-300 transition">
              03 Diagnostic
            </a>
            <a href="#connect" className="hover:text-cyan-300 transition">
              04 Connect
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setInspectorOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-200 cursor-pointer"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Pulse &amp; SEO</span>
            {vitals.lcpMs !== null && (
              <span className="hidden sm:inline font-mono text-[11px] text-cyan-300">
                LCP {vitals.lcpMs}ms
              </span>
            )}
          </button>
        </div>
      </header>

      <main>
        <ClarityLensStage
          clarityActive={clarityActive}
          onToggleClarity={handleToggleClarity}
          onJumpToVector={handleJumpToVector}
          lensCount={pulse.lensActivations}
        />

        <CausalityOrbit
          activeVector={activeVector}
          onSelectVector={handleSelectVector}
          onInspectMandate={(mandateId) => void postEngagement("mandate_inspect", { mandateId })}
          onSwitchRegion={(region) => void postEngagement("region_switch", { region })}
        />

        <DiagnosticConstellation
          onSelectDiagnostic={(scenarioId) =>
            void postEngagement("diagnostic_select", { scenarioId })
          }
        />

        <ConnectAndPulse
          pulse={pulse}
          onPulseUpdate={setPulse}
          onOpenInspector={() => setInspectorOpen(true)}
        />
      </main>

      <footer className="border-t border-slate-800/70 py-8 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Built for the <strong className="text-slate-200">[i-SmokeStack]</strong> challenge —
            grounded 100% in Soniaa (Sonya 🔍) S.&apos;s verified LinkedIn profile.
          </p>
          <p className="font-mono text-[11px] text-slate-500">
            Next.js App Router · SSR + JSON-LD + Live Telemetry
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Dock for Thumb-Friendly Navigation */}
      <nav
        aria-label="Mobile quick dock"
        className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-slate-700/80 bg-slate-950/90 py-2 px-2 backdrop-blur-xl shadow-2xl md:hidden"
      >
        <a href="#lens" className="flex flex-col items-center gap-0.5 text-[10px] text-slate-300">
          <Search className="h-4 w-4 text-cyan-300" />
          Lens
        </a>
        <a href="#causality" className="flex flex-col items-center gap-0.5 text-[10px] text-slate-300">
          <Compass className="h-4 w-4 text-amber-300" />
          Causality
        </a>
        <a href="#diagnostic" className="flex flex-col items-center gap-0.5 text-[10px] text-slate-300">
          <SlidersHorizontal className="h-4 w-4 text-emerald-300" />
          Diagnostic
        </a>
        <a href="#connect" className="flex flex-col items-center gap-0.5 text-[10px] text-slate-300">
          <Send className="h-4 w-4 text-violet-300" />
          Connect
        </a>
        <button
          type="button"
          onClick={() => setInspectorOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] text-cyan-300 cursor-pointer"
        >
          <Activity className="h-4 w-4" />
          Pulse
        </button>
      </nav>

      {/* Slide-Over Live Pulse & SEO / Core Web Vitals Drawer */}
      <AnimatePresence>
        {inspectorOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectorOpen(false)}
              className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              aria-label="Live Engagement Telemetry and SEO Inspector"
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-cyan-300" />
                  <h2 className="text-base font-semibold text-slate-50">
                    Live Telemetry &amp; SEO Inspector
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectorOpen(false)}
                  aria-label="Close inspector"
                  className="rounded-full border border-slate-800 p-1.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Real-time Browser Web Vitals */}
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-wider text-cyan-300">
                  Measured Browser Core Web Vitals
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                    <p className="font-mono text-[10px] text-slate-400">LCP</p>
                    <p className="mt-1 font-mono text-base font-semibold text-emerald-300">
                      {vitals.lcpMs !== null ? `${vitals.lcpMs}ms` : "Measuring"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                    <p className="font-mono text-[10px] text-slate-400">CLS</p>
                    <p className="mt-1 font-mono text-base font-semibold text-emerald-300">
                      {vitals.cls !== null ? vitals.cls : "0.000"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                    <p className="font-mono text-[10px] text-slate-400">FCP</p>
                    <p className="mt-1 font-mono text-base font-semibold text-cyan-300">
                      {vitals.fcpMs !== null ? `${vitals.fcpMs}ms` : "Measuring"}
                    </p>
                  </div>
                </div>
              </div>

              {/* SEO Readiness Checklist */}
              <div className="space-y-2.5 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="font-mono text-xs uppercase tracking-wider text-amber-300">
                  SEO &amp; Architecture Signals
                </p>
                {[
                  "SSR Semantic HTML (No opacity:0 LCP delay)",
                  "JSON-LD ProfilePage + Person + Credentials",
                  "Dynamic OpenGraph Image (/opengraph-image)",
                  "Native /sitemap.xml & /robots.txt",
                  "Self-hosted .woff2 fonts (Zero external DNS)",
                ].map((check) => (
                  <div key={check} className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span>{check}</span>
                  </div>
                ))}
              </div>

              {/* Causality Resonance Breakdown */}
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-wider text-emerald-300">
                  Visitor Causality Resonance
                </p>
                {(Object.entries(pulse.vectorCounts) as Array<[CausalityVectorId, number]>).map(
                  ([key, count]) => {
                    const pct = Math.round((count / totalVectorClicks) * 100);
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="capitalize text-slate-200">{key}</span>
                          <span className="font-mono text-slate-400">{count} clicks</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-cyan-400 transition-all duration-300"
                            style={{ width: `${Math.max(4, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Store: {pulse.storageMode}</span>
                <span>Avg LCP: {pulse.vitalsSamples.avgLcpMs ? `${pulse.vitalsSamples.avgLcpMs}ms` : "Pending"}</span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
