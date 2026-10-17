"use client";

import type { AnalysisResult } from "@/types";

interface VerdictBannerProps {
  result: AnalysisResult;
  processingMs: number;
}

export default function VerdictBanner({ result, processingMs }: VerdictBannerProps) {
  const isViolation = result.verdict === "violation";
  const count = result.violations.length;

  if (!isViolation) {
    return (
      <div className="glow-green" style={{
        borderRadius: 14,
        padding: "20px 24px",
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(16,185,129,0.3)",
        display: "flex", alignItems: "center", gap: 16
      }}>
        {/* Icon */}
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "rgba(16,185,129,0.15)",
          border: "1px solid rgba(16,185,129,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#34d399", marginBottom: 2 }}>
            Нарушений не обнаружено
          </h2>
          <p style={{ fontSize: 13, color: "#6ee7b7", opacity: 0.8 }}>
            Видеозапись проверена. Признаков нарушения кассовой дисциплины не выявлено.
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className="badge-green">✓ no_violation</div>
          <p style={{ fontSize: 11, color: "#71717a", marginTop: 6, fontFamily: "var(--font-geist-mono)" }}>
            {(processingMs / 1000).toFixed(1)}s
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glow-red" style={{
      borderRadius: 14,
      padding: "20px 24px",
      background: "rgba(164,16,52,0.1)",
      border: "1px solid rgba(164,16,52,0.4)",
      display: "flex", alignItems: "center", gap: 16
    }}>
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        background: "rgba(164,16,52,0.2)",
        border: "1px solid rgba(164,16,52,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v4M12 17h.01" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#f87171" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f87171", marginBottom: 2 }}>
          Обнаружены признаки возможных нарушений
        </h2>
        <p style={{ fontSize: 13, color: "#fca5a5", opacity: 0.85 }}>
          Выявлено событий: <strong>{count}</strong>. Требуется проверка уполномоченным сотрудником.
        </p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div className="badge-red">⚠ violation · {count}</div>
        <p style={{ fontSize: 11, color: "#71717a", marginTop: 6, fontFamily: "var(--font-geist-mono)" }}>
          {(processingMs / 1000).toFixed(1)}s · {result.job_id}
        </p>
      </div>
    </div>
  );
}
