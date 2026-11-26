"use client";

import { useEffect } from "react";

export interface VitalsMetrics {
  lcpMs: number | null;
  cls: number | null;
  fcpMs: number | null;
}

interface WebVitalsTrackerProps {
  onMetricsUpdate: (metrics: VitalsMetrics) => void;
  onReportToServer: (metrics: VitalsMetrics) => void;
}

export function WebVitalsTracker({
  onMetricsUpdate,
  onReportToServer,
}: WebVitalsTrackerProps) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
      return;
    }

    const latest: VitalsMetrics = {
      lcpMs: null,
      cls: 0,
      fcpMs: null,
    };
    let reported = false;

    const emit = () => {
      onMetricsUpdate({ ...latest });
    };

    const observers: PerformanceObserver[] = [];

    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            latest.fcpMs = Math.round(entry.startTime);
            emit();
          }
        }
      });
      paintObserver.observe({ type: "paint", buffered: true });
      observers.push(paintObserver);
    } catch {
      // Unsupported observer type in older browser
    }

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          latest.lcpMs = Math.round(lastEntry.startTime);
          emit();
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      observers.push(lcpObserver);
    } catch {
      // Unsupported observer type
    }

    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & {
            value?: number;
            hadRecentInput?: boolean;
          };
          if (!layoutShift.hadRecentInput && typeof layoutShift.value === "number") {
            latest.cls = Number(((latest.cls ?? 0) + layoutShift.value).toFixed(4));
            emit();
          }
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
      observers.push(clsObserver);
    } catch {
      // Unsupported observer type
    }

    const sendOnce = () => {
      if (reported || latest.lcpMs === null) return;
      reported = true;
      onReportToServer({ ...latest });
    };

    const timer = window.setTimeout(sendOnce, 2500);
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendOnce();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      for (const obs of observers) {
        obs.disconnect();
      }
    };
  }, [onMetricsUpdate, onReportToServer]);

  return null;
}
