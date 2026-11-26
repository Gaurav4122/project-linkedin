"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Compass,
  MapPin,
  HeartHandshake,
  Layers,
} from "lucide-react";
import {
  CAUSALITY_VECTORS,
  MANDATES,
  SONIA_PROFILE,
  type CausalityVectorId,
  type RegionKey,
} from "@/data/sonia-profile";

interface CausalityOrbitProps {
  activeVector: CausalityVectorId;
  onSelectVector: (vector: CausalityVectorId) => void;
  onInspectMandate: (mandateId: string) => void;
  onSwitchRegion: (region: string) => void;
}

const REGION_FILTERS: Array<{ key: "all" | RegionKey; label: string; badge: string }> = [
  { key: "all", label: "All Global Mandates", badge: "5 Active" },
  { key: "usa", label: "USA · Boston & US", badge: "2" },
  { key: "uae", label: "UAE · Dubai", badge: "1" },
  { key: "india", label: "India · NCR", badge: "2" },
];

const ACCENT_MAP: Record<
  CausalityVectorId,
  { ring: string; pill: string; text: string; glow: string }
> = {
  brand: {
    ring: "border-amber-400/50 bg-amber-400/10",
    pill: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    text: "text-amber-300",
    glow: "shadow-[0_0_24px_rgba(245,158,11,0.18)]",
  },
  messaging: {
    ring: "border-cyan-400/50 bg-cyan-400/10",
    pill: "bg-cyan-400/15 text-cyan-300 border-cyan-400/30",
    text: "text-cyan-300",
    glow: "shadow-[0_0_24px_rgba(34,211,238,0.18)]",
  },
  operations: {
    ring: "border-emerald-400/50 bg-emerald-400/10",
    pill: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    text: "text-emerald-300",
    glow: "shadow-[0_0_24px_rgba(16,185,129,0.18)]",
  },
  people: {
    ring: "border-violet-400/50 bg-violet-400/10",
    pill: "bg-violet-400/15 text-violet-300 border-violet-400/30",
    text: "text-violet-300",
    glow: "shadow-[0_0_24px_rgba(167,139,250,0.18)]",
  },
};

export function CausalityOrbit({
  activeVector,
  onSelectVector,
  onInspectMandate,
  onSwitchRegion,
}: CausalityOrbitProps) {
  const [regionFilter, setRegionFilter] = useState<"all" | RegionKey>("all");
  const [selectedMandateId, setSelectedMandateId] = useState<string>(MANDATES[0].id);

  const currentVector =
    CAUSALITY_VECTORS.find((v) => v.id === activeVector) ?? CAUSALITY_VECTORS[0];

  const visibleMandates = MANDATES.filter((m) => {
    const matchesRegion = regionFilter === "all" || m.region === regionFilter;
    const matchesVector = m.vectors.includes(activeVector);
    return matchesRegion && (regionFilter !== "all" || matchesVector);
  });

  const fallbackMandates =
    visibleMandates.length > 0
      ? visibleMandates
      : MANDATES.filter((m) => regionFilter === "all" || m.region === regionFilter);

  const activeMandate =
    fallbackMandates.find((m) => m.id === selectedMandateId) ?? fallbackMandates[0];

  const accent = ACCENT_MAP[activeVector];

  return (
    <section
      id="causality"
      aria-labelledby="causality-heading"
      className="relative py-16 sm:py-24 border-t border-slate-800/60"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">
              <Compass className="h-3.5 w-3.5" />
              02 · System Causality Map
            </div>
            <h2
              id="causality-heading"
              className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-4xl"
            >
              Not one isolated skill—{" "}
              <span className="font-serif italic font-normal text-amber-300">
                seeing the whole picture.
              </span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              {SONIA_PROFILE.pillarsTagline} Select a causal lever below to inspect the live
              global mandates where Sonia turns complexity into aligned execution.
            </p>
          </div>

          {/* Interactive Global Region Filter */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter mandates by region">
            {REGION_FILTERS.map((rf) => {
              const active = regionFilter === rf.key;
              return (
                <button
                  key={rf.key}
                  type="button"
                  onClick={() => {
                    setRegionFilter(rf.key);
                    onSwitchRegion(rf.key);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                    active
                      ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span>{rf.label}</span>
                  <span className="font-mono text-[10px] opacity-75">{rf.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Causality Vectors Selector */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CAUSALITY_VECTORS.map((vec) => {
            const isActive = vec.id === activeVector;
            const vecAccent = ACCENT_MAP[vec.id];
            return (
              <button
                key={vec.id}
                type="button"
                onClick={() => onSelectVector(vec.id)}
                className={`relative rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  isActive
                    ? `${vecAccent.ring} ${vecAccent.glow}`
                    : "border-slate-800/90 bg-slate-900/45 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-mono text-xs uppercase tracking-wider ${vecAccent.text}`}>
                    {vec.source} → {vec.target}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="active-vector-dot"
                      className="h-2 w-2 rounded-full bg-current"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-slate-100">{vec.statement}</p>
                <p className="mt-2 font-mono text-[11px] text-slate-400">{vec.metricBadge}</p>
              </button>
            );
          })}
        </div>

        {/* Interactive Mandate Explorer + Causal Detail */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: Vector thesis + matching mandate tabs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 sm:p-6">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${accent.pill}`}
              >
                {currentVector.source} affects {currentVector.target}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
                {currentVector.summary}
              </p>

              <div className="mt-5 space-y-2">
                <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  Active Mandates ({fallbackMandates.length})
                </p>
                <div className="space-y-2">
                  {fallbackMandates.map((mandate) => {
                    const selected = activeMandate?.id === mandate.id;
                    return (
                      <button
                        key={mandate.id}
                        type="button"
                        onClick={() => {
                          setSelectedMandateId(mandate.id);
                          onInspectMandate(mandate.id);
                        }}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition cursor-pointer ${
                          selected
                            ? "border-cyan-400/50 bg-slate-950/90"
                            : "border-slate-800/80 bg-slate-950/40 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-100 text-sm">
                            {mandate.company}
                          </span>
                          <span className="font-mono text-[11px] text-cyan-300">
                            {mandate.duration}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-400">{mandate.role}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Volunteering Purpose Strip */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-emerald-300">
                <HeartHandshake className="h-3.5 w-3.5" />
                Purpose Beyond Growth · Volunteering
              </div>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {SONIA_PROFILE.volunteering.map((vol) => (
                  <div
                    key={vol.organization}
                    className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3"
                  >
                    <p className="text-xs font-semibold text-slate-100">{vol.organization}</p>
                    <p className="text-[11px] text-slate-300">{vol.role}</p>
                    <p className="mt-1 font-mono text-[10px] text-slate-400">
                      {vol.period} · {vol.cause}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Mandate Blueprint Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {activeMandate && (
                <motion.article
                  key={activeMandate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="h-full rounded-3xl border border-slate-800/90 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-slate-900/70 p-6 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-300">
                          <Layers className="h-3.5 w-3.5" />
                          {activeMandate.period} · {activeMandate.duration}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-50 sm:text-2xl">
                          {activeMandate.role}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                          <span className="font-medium text-amber-300">
                            {activeMandate.company}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                            <MapPin className="h-3.5 w-3.5" />
                            {activeMandate.location}
                          </span>
                        </div>
                      </div>

                      <a
                        href={activeMandate.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-200"
                      >
                        Company on LinkedIn
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    <ul className="mt-6 space-y-3.5">
                      {activeMandate.highlights.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-slate-200 sm:text-[15px]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Global Remote Orbital SVG Footer */}
                  <div className="mt-8 space-y-4">
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/85 p-4">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                        <span>GLOBAL REMOTE ORBIT</span>
                        <span className="text-cyan-300">USA ↔ UAE ↔ INDIA</span>
                      </div>
                      <svg
                        viewBox="0 0 520 96"
                        className="w-full h-20 overflow-visible"
                        role="img"
                        aria-label="Global remote leadership footprint across Boston USA, Dubai UAE, and NCR India"
                      >
                        <defs>
                          <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.85" />
                            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.85" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 55 58 Q 160 12 260 52 T 465 56"
                          fill="none"
                          stroke="url(#orbitGrad)"
                          strokeWidth="2"
                          strokeDasharray="5 5"
                        />
                        {[
                          {
                            x: 55,
                            y: 58,
                            label: "USA · Boston",
                            sub: "[i-SmokeStack] / AYU Inc",
                            active: activeMandate.region === "usa",
                            color: "#22D3EE",
                          },
                          {
                            x: 260,
                            y: 52,
                            label: "UAE · Dubai",
                            sub: "AYU Lifescience",
                            active: activeMandate.region === "uae",
                            color: "#F59E0B",
                          },
                          {
                            x: 465,
                            y: 56,
                            label: "India · NCR",
                            sub: "Celestial AI / Datt",
                            active: activeMandate.region === "india",
                            color: "#10B981",
                          },
                        ].map((node) => (
                          <g key={node.label}>
                            {node.active && (
                              <circle
                                cx={node.x}
                                cy={node.y}
                                r="14"
                                fill={node.color}
                                opacity="0.2"
                              />
                            )}
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={node.active ? "6.5" : "4.5"}
                              fill={node.active ? node.color : "#334155"}
                              stroke={node.color}
                              strokeWidth="1.5"
                            />
                            <text
                              x={node.x}
                              y={node.y + 20}
                              textAnchor="middle"
                              fill={node.active ? "#F8FAFC" : "#94A3B8"}
                              fontSize="10.5"
                              fontWeight={node.active ? "600" : "400"}
                            >
                              {node.label}
                            </text>
                            <text
                              x={node.x}
                              y={node.y + 32}
                              textAnchor="middle"
                              fill="#64748B"
                              fontSize="8.5"
                            >
                              {node.sub}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/75 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-mono uppercase tracking-wider text-slate-400">
                          Active Causal Vectors in This Mandate
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeMandate.vectors.map((vecId) => (
                            <button
                              key={vecId}
                              type="button"
                              onClick={() => onSelectVector(vecId)}
                              className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] capitalize cursor-pointer ${ACCENT_MAP[vecId].pill}`}
                            >
                              {vecId}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
