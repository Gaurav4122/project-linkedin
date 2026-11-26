"use client";

import { useState } from "react";
import {
  Send,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Monitor,
} from "lucide-react";
import {
  SONIA_PROFILE,
  CAUSALITY_VECTORS,
  type CausalityVectorId,
} from "@/data/sonia-profile";
import type { PulseSnapshot, ConnectSubmission } from "@/lib/telemetry-store";

interface ConnectAndPulseProps {
  pulse: PulseSnapshot;
  onPulseUpdate: (snapshot: PulseSnapshot) => void;
  onOpenInspector: () => void;
}

const INTENTS = [
  "Fractional CMO Mandate",
  "Brand & Messaging Alignment",
  "Marketing Ops & CRM Setup",
  "Gupshup / Connect",
];

export function ConnectAndPulse({
  pulse,
  onPulseUpdate,
  onOpenInspector,
}: ConnectAndPulseProps) {
  const [intent, setIntent] = useState(INTENTS[0]);
  const [focusVector, setFocusVector] = useState<CausalityVectorId>("brand");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ConnectSubmission | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          organization,
          contact,
          intent,
          focusVector,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to send your brief.");
      } else {
        setReceipt(data.submission);
        onPulseUpdate(data.snapshot);
        setName("");
        setOrganization("");
        setContact("");
        setNote("");
      }
    } catch {
      setError("Network issue while saving your Clarity Brief.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyReceipt = async () => {
    if (!receipt) return;
    const summary = `Clarity Brief ${receipt.id}\nFrom: ${receipt.name} (${receipt.organization || "Founder"})\nIntent: ${receipt.intent} [${receipt.focusVector}]\nNote: ${receipt.note}`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  const topVectorEntry = Object.entries(pulse.vectorCounts).sort((a, b) => b[1] - a[1])[0];
  const totalInteractions =
    pulse.lensActivations +
    Object.values(pulse.vectorCounts).reduce((acc, n) => acc + n, 0) +
    Object.values(pulse.diagnosticCounts).reduce((acc, n) => acc + n, 0);

  return (
    <section
      id="connect"
      aria-labelledby="connect-heading"
      className="relative py-16 sm:py-24 border-t border-slate-800/60"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: Functional Full-Stack Connect Flow */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-800/90 bg-slate-900/55 p-6 sm:p-8">
            <div className="space-y-2.5">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">
                04 · Start a Clarity Conversation
              </span>
              <h2
                id="connect-heading"
                className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl"
              >
                Send a{" "}
                <span className="font-serif italic font-normal text-amber-300">
                  Clarity Brief
                </span>{" "}
                to Sonia
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                &ldquo;{SONIA_PROFILE.closingInvitation}&rdquo;
              </p>
            </div>

            {receipt ? (
              <div className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-950/25 p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-sm font-semibold text-slate-100">
                        Clarity Brief Logged ({receipt.id})
                      </p>
                      <p className="text-xs text-slate-400">
                        Persisted via Next.js API &amp; added to Live Pulse
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyReceipt}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:border-cyan-400/50 cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy Brief"}
                  </button>
                </div>

                <div className="rounded-xl bg-slate-950/70 p-3.5 text-xs text-slate-300 space-y-1 font-mono">
                  <p>INTENT: {receipt.intent}</p>
                  <p>CAUSAL FOCUS: {receipt.focusVector.toUpperCase()}</p>
                  <p>CONTACT: {receipt.contact}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={SONIA_PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300"
                  >
                    Continue on LinkedIn
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setReceipt(null)}
                    className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Send another note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                    Conversation Intent
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTENTS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setIntent(item)}
                        className={`rounded-full border px-3 py-1.5 text-xs transition cursor-pointer ${
                          intent === item
                            ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200"
                            : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                    Primary Focus Lever
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CAUSALITY_VECTORS.map((vec) => (
                      <button
                        key={vec.id}
                        type="button"
                        onClick={() => setFocusVector(vec.id)}
                        className={`rounded-xl border px-3 py-2 text-left text-xs transition cursor-pointer ${
                          focusVector === vec.id
                            ? "border-amber-400/60 bg-amber-400/10 text-amber-200"
                            : "border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="font-semibold block">{vec.source}</span>
                        <span className="text-[10px] opacity-80">→ {vec.target}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="visitor-name" className="block text-xs text-slate-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      id="visitor-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav / i-SmokeStack Team"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="visitor-org" className="block text-xs text-slate-300 mb-1">
                      Company / Team
                    </label>
                    <input
                      id="visitor-org"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="visitor-contact" className="block text-xs text-slate-300 mb-1">
                    Email or LinkedIn URL *
                  </label>
                  <input
                    id="visitor-contact"
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="you@company.com or linkedin.com/in/..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="visitor-note" className="block text-xs text-slate-300 mb-1">
                    What&apos;s the unspoken story or challenge you&apos;re solving? *
                  </label>
                  <textarea
                    id="visitor-note"
                    rows={3}
                    required
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Share context on your brand, messaging, or team alignment..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none resize-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs text-rose-400">
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "Logging Clarity Brief..." : "Send Clarity Brief"}
                  </button>
                  <span className="font-mono text-[11px] text-slate-400">
                    {SONIA_PROFILE.availability} · {SONIA_PROFILE.pricing}
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* Right: Meaningful Live Visitor Engagement Summary */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl border border-slate-800/90 bg-slate-950/75 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-slate-100">
                    Live Visitor Engagement Pulse
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onOpenInspector}
                  className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 font-mono text-[11px] text-cyan-300 hover:bg-cyan-400/20 cursor-pointer"
                >
                  Open SEO &amp; Telemetry HUD
                </button>
              </div>

              <p className="text-xs leading-relaxed text-slate-400">
                Real-time full-stack telemetry persisted by Next.js API routes—capturing which
                causal levers, lenses, and bottlenecks visitors explore most.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
                  <p className="font-mono text-[11px] text-slate-400">Sessions Logged</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-50 font-mono">
                    {pulse.totalSessions}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
                  <p className="font-mono text-[11px] text-slate-400">Interactions</p>
                  <p className="mt-1 text-2xl font-semibold text-cyan-300 font-mono">
                    {totalInteractions}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
                  <p className="font-mono text-[11px] text-slate-400">Lens Activations</p>
                  <p className="mt-1 text-2xl font-semibold text-amber-300 font-mono">
                    {pulse.lensActivations}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
                  <p className="font-mono text-[11px] text-slate-400">Top Resonance</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-300 capitalize">
                    {topVectorEntry?.[0] ?? "brand"}
                  </p>
                </div>
              </div>

              {/* Device breakdown */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3.5 flex items-center justify-between text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <Monitor className="h-3.5 w-3.5 text-cyan-300" />
                  Desktop: <strong className="font-mono">{pulse.deviceSplit.desktop}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-amber-300" />
                  Mobile: <strong className="font-mono">{pulse.deviceSplit.mobile}</strong>
                </span>
              </div>

              {/* Recent anonymized visitor briefs */}
              <div className="space-y-2">
                <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  Recent Visitor Briefs ({pulse.recentConnections.length})
                </p>
                {pulse.recentConnections.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-800 p-3 text-xs text-slate-500">
                    Submit the form on the left to test the live persistence flow and watch it
                    appear here immediately.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pulse.recentConnections.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/50 px-3 py-2 text-xs"
                      >
                        <div>
                          <span className="font-medium text-slate-200">{item.intent}</span>
                          <span className="text-slate-500"> · {item.organization}</span>
                        </div>
                        <span className="font-mono text-[10px] uppercase text-cyan-300">
                          {item.focusVector}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
