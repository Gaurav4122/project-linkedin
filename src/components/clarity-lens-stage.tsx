"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  ArrowRight,
  Globe2,
  Users,
  CheckCircle2,
  Eye,
} from "lucide-react";
import {
  SONIA_PROFILE,
  LENS_TRANSFORMATIONS,
  type CausalityVectorId,
} from "@/data/sonia-profile";

interface ClarityLensStageProps {
  clarityActive: boolean;
  onToggleClarity: () => void;
  onJumpToVector: (vector: CausalityVectorId) => void;
  lensCount: number;
}

export function ClarityLensStage({
  clarityActive,
  onToggleClarity,
  onJumpToVector,
  lensCount,
}: ClarityLensStageProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPointer({ x, y, active: true });
  };

  return (
    <section
      id="lens"
      aria-labelledby="hero-heading"
      className="relative pt-24 pb-16 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column: LCP-optimized instant SSR content (zero opacity:0 delay) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                FRACTIONAL CMO &amp; OPS ADVISOR
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-slate-300">
                <Users className="h-3.5 w-3.5 text-amber-400" />
                {SONIA_PROFILE.followers.toLocaleString()} LinkedIn Followers
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-slate-300">
                <Globe2 className="h-3.5 w-3.5 text-cyan-400" />
                USA · UAE · India
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300/90">
                {SONIA_PROFILE.displayName} — The Clarity Lens
              </p>
              <h1
                id="hero-heading"
                className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]"
              >
                &ldquo;I notice what others don&apos;t.{" "}
                <span className="font-serif italic font-normal text-cyan-300">
                  The gaps, the confusion, the unspoken story
                </span>
                —and I help make sense of it.&rdquo;
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Crafting brands people can feel. Bringing{" "}
                <span className="text-slate-100 font-medium">structure without chaos</span> across
                early-stage startups and global teams—so brand, messaging, operations, and people
                move as one aligned engine.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onToggleClarity}
                className={`group inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  clarityActive
                    ? "bg-cyan-400 text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)]"
                    : "bg-slate-100 text-slate-950 hover:bg-cyan-300"
                }`}
              >
                <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
                {clarityActive ? "Clarity Lens: Engaged" : "Engage Clarity Lens"}
                <span className="rounded-full bg-slate-950/15 px-2 py-0.5 font-mono text-xs">
                  {lensCount}
                </span>
              </button>

              <a
                href="#causality"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/50 hover:text-white"
              >
                Explore Causality System
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={SONIA_PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 transition hover:text-cyan-300"
              >
                LinkedIn Profile ↗
              </a>
            </div>
          </div>

          {/* Right column: Interactive Signal -> Clarity Lens Field */}
          <div className="lg:col-span-5">
            <div
              ref={fieldRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setPointer((prev) => ({ ...prev, active: false }))}
              className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-950/80 p-5 sm:p-6 shadow-2xl backdrop-blur-xl"
            >
              {/* Dynamic Lens Spotlight Aura */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: pointer.active || clarityActive ? 1 : 0.45,
                  background: clarityActive
                    ? "radial-gradient(circle at 50% 45%, rgba(34,211,238,0.16), transparent 70%)"
                    : `radial-gradient(220px circle at ${pointer.x}% ${pointer.y}%, rgba(34,211,238,0.18), transparent 72%)`,
                }}
              />

              <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3.5">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-300">
                    {clarityActive ? "State: Aligned Clarity" : "Hover or Toggle Lens 🔍"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onToggleClarity}
                  className="rounded-full border border-slate-700 bg-slate-900/90 px-2.5 py-1 font-mono text-[11px] text-cyan-300 hover:border-cyan-400/60 cursor-pointer"
                >
                  {clarityActive ? "Reset Noise" : "Snap to Clarity"}
                </button>
              </div>

              <div className="relative z-10 mt-4 grid gap-3">
                {LENS_TRANSFORMATIONS.map((item, idx) => {
                  const isFocused = clarityActive || pointer.active;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      onClick={() => onJumpToVector(item.vector)}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 360, damping: 28 }}
                      className={`group w-full rounded-2xl border p-3.5 text-left transition-colors cursor-pointer ${
                        clarityActive
                          ? "border-cyan-400/40 bg-cyan-950/25"
                          : "border-slate-800/90 bg-slate-900/55 hover:border-cyan-400/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
                            <span
                              className={
                                clarityActive ? "text-emerald-400" : "text-amber-400/90"
                              }
                            >
                              0{idx + 1} · {item.vector}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400 line-through decoration-slate-600/80">
                              {item.noise}
                            </span>
                          </div>
                          <p
                            className={`text-sm font-medium transition-colors sm:text-base ${
                              isFocused ? "text-slate-50" : "text-slate-300"
                            }`}
                          >
                            {item.clarity}
                          </p>
                        </div>

                        <span className="mt-1 shrink-0 rounded-full border border-slate-700/70 bg-slate-900/80 p-1.5 text-cyan-300 transition group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10">
                          {clarityActive ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="relative z-10 mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                <span>Click any signal to trace its live mandate</span>
                <span className="font-mono text-cyan-300">Steady Mind · Root Cause</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
