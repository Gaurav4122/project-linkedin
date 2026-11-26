"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Award,
  GraduationCap,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import {
  DIAGNOSTIC_SCENARIOS,
  SKILLS_MATRIX,
  SONIA_PROFILE,
  type SkillNode,
} from "@/data/sonia-profile";

interface DiagnosticConstellationProps {
  onSelectDiagnostic: (scenarioId: string) => void;
}

const SKILL_FILTERS: Array<{ key: "all" | SkillNode["category"]; label: string }> = [
  { key: "all", label: "All Verified Skills" },
  { key: "strategy", label: "Brand & Strategy" },
  { key: "execution", label: "Messaging & Demand" },
  { key: "systems", label: "CRM & Ops" },
  { key: "leadership", label: "Leadership" },
];

export function DiagnosticConstellation({
  onSelectDiagnostic,
}: DiagnosticConstellationProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    DIAGNOSTIC_SCENARIOS[0].id
  );
  const [skillFilter, setSkillFilter] = useState<"all" | SkillNode["category"]>("all");

  const activeScenario =
    DIAGNOSTIC_SCENARIOS.find((s) => s.id === selectedScenarioId) ?? DIAGNOSTIC_SCENARIOS[0];

  const filteredSkills = SKILLS_MATRIX.filter(
    (skill) => skillFilter === "all" || skill.category === skillFilter
  );

  return (
    <section
      id="diagnostic"
      aria-labelledby="diagnostic-heading"
      className="relative py-16 sm:py-24 border-t border-slate-800/60"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Part A: Interactive Diagnostic Simulator */}
        <div className="space-y-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              03 · Interactive Clarity Diagnostic
            </div>
            <h2
              id="diagnostic-heading"
              className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-4xl"
            >
              Where does your team{" "}
              <span className="font-serif italic font-normal text-cyan-300">
                feel stuck right now?
              </span>
            </h2>
            <p className="text-sm text-slate-300 sm:text-base">
              Pick a bottleneck below to see how Sonia diagnoses the root cause—mapped directly to
              her active mandates and services.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5 grid gap-2.5">
              {DIAGNOSTIC_SCENARIOS.map((scenario) => {
                const isSelected = scenario.id === activeScenario.id;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => {
                      setSelectedScenarioId(scenario.id);
                      onSelectDiagnostic(scenario.id);
                    }}
                    className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-cyan-400/60 bg-cyan-950/30 shadow-[0_0_24px_rgba(34,211,238,0.14)]"
                        : "border-slate-800/80 bg-slate-900/45 hover:border-slate-700"
                    }`}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wider text-amber-300">
                      {scenario.contextTag}
                    </span>
                    <p className="mt-1 text-sm font-medium text-slate-100">
                      &ldquo;{scenario.symptom}&rdquo;
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScenario.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="h-full rounded-3xl border border-slate-800/90 bg-slate-900/60 p-6 sm:p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-5">
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300">
                        Root-Cause Lens
                      </span>
                      <p className="mt-1.5 text-base font-medium leading-relaxed text-slate-100">
                        {activeScenario.rootCause}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-300">
                        Sonia&apos;s Clarity Playbook
                      </span>
                      <ul className="space-y-2.5">
                        {activeScenario.soniaApproach.map((step) => (
                          <li key={step} className="flex items-start gap-2.5 text-sm text-slate-200">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {activeScenario.matchingServices.map((svc) => (
                        <span
                          key={svc}
                          className="rounded-full border border-slate-700 bg-slate-950/80 px-2.5 py-1 text-xs text-slate-300"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-[11px] text-amber-300">
                      Proven at: {activeScenario.proofMandate}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Part B: Verified Endorsement Constellation & Foundations */}
        <div className="grid gap-8 lg:grid-cols-12 pt-4">
          <div className="lg:col-span-8 rounded-3xl border border-slate-800/90 bg-slate-950/65 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  Endorsement &amp; Cross-Company Depth
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified LinkedIn endorsements and multi-company experience spans
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setSkillFilter(f.key)}
                    className={`rounded-full border px-3 py-1 text-xs transition cursor-pointer ${
                      skillFilter === f.key
                        ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200"
                        : "border-slate-800 bg-slate-900/70 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5 transition hover:border-cyan-400/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-100">{skill.name}</span>
                    {skill.endorsements ? (
                      <span className="rounded-full bg-cyan-400/10 border border-cyan-400/30 px-2 py-0.5 font-mono text-[11px] text-cyan-300">
                        {skill.endorsements}
                      </span>
                    ) : null}
                  </div>
                  {skill.experiencesCount ? (
                    <p className="mt-1 font-mono text-[11px] text-amber-300/90">
                      {skill.experiencesCount} experiences · {skill.companiesCount} companies
                    </p>
                  ) : null}
                  {skill.notableEndorsers ? (
                    <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                      {skill.notableEndorsers}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Academic & Credential Foundations */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-amber-300" />
                  Education ({SONIA_PROFILE.totalEducationsOnProfile} on profile)
                </h3>
              </div>
              <div className="space-y-3">
                {SONIA_PROFILE.education.map((edu) => (
                  <a
                    key={edu.school}
                    href={edu.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 transition hover:border-amber-400/40"
                  >
                    <p className="text-xs font-semibold text-amber-200">{edu.school}</p>
                    <p className="text-xs text-slate-200 mt-0.5">{edu.degree}</p>
                    <p className="font-mono text-[11px] text-slate-400 mt-1">{edu.period}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{edu.notes}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Award className="h-4 w-4 text-cyan-300" />
                Licenses &amp; Certs ({SONIA_PROFILE.totalCertificationsOnProfile})
              </h3>
              <div className="space-y-2.5">
                {SONIA_PROFILE.certifications.map((cert) => (
                  <div
                    key={cert.credentialId}
                    className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3"
                  >
                    <p className="text-xs font-semibold text-slate-100">{cert.title}</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {cert.issuer} · {cert.issued}
                    </p>
                    <p className="font-mono text-[10px] text-cyan-300 mt-1">
                      Credential ID: {cert.credentialId}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
