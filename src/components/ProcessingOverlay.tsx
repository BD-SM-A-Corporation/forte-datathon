"use client";

import { useEffect, useState } from "react";

interface ProcessingOverlayProps {
  jobId: string | null;
  elapsedMs: number;
}

const STAGES = [
  { label: "Загрузка видеофайла...", pct: 15 },
  { label: "Извлечение кадров (FPS: 5)...", pct: 30 },
  { label: "Детекция объектов и поз...", pct: 50 },
  { label: "Классификация событий...", pct: 68 },
  { label: "Сопоставление с нормативной базой РК...", pct: 82 },
  { label: "Формирование кадров-доказательств...", pct: 92 },
  { label: "Финализация результата...", pct: 98 },
];

export default function ProcessingOverlay({ jobId, elapsedMs }: ProcessingOverlayProps) {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStageIdx((i) => Math.min(i + 1, STAGES.length - 1));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const stage = STAGES[stageIdx];
  const elapsed = (elapsedMs / 1000).toFixed(1);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "48px 24px", gap: 28, textAlign: "center"
    }}>
      {/* Animated ring */}
      <div style={{ position: "relative", width: 80, height: 80 }}>
        <svg width="80" height="80" viewBox="0 0 80 80" className="animate-spin-slow">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(164,16,52,0.15)" strokeWidth="6"/>
          <circle
            cx="40" cy="40" r="34" fill="none"
            stroke="url(#grad)" strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="213"
            strokeDashoffset={213 - (213 * stage.pct) / 100}
            style={{ transition: "stroke-dashoffset 1.5s ease" }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a41034"/>
              <stop offset="100%" stopColor="#e53e6b"/>
            </linearGradient>
          </defs>
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: "#f87171",
          fontFamily: "var(--font-geist-mono)"
        }}>
          {stage.pct}%
        </div>
      </div>

      {/* Stage label */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#f4f4f5" }}>
          {stage.label}
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", color: "#71717a", fontSize: 12 }}>
          {jobId && (
            <span style={{ fontFamily: "var(--font-geist-mono)" }}>
              job: <span style={{ color: "#a1a1aa" }}>{jobId}</span>
            </span>
          )}
          <span style={{ fontFamily: "var(--font-geist-mono)" }}>
            ⏱ {elapsed}s
          </span>
          <span style={{ color: "#a41034" }}>MAX 5:00</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ width: "100%", maxWidth: 360 }}>
        <div className="progress-fill" style={{ width: `${stage.pct}%` }} />
      </div>

      {/* Stage dots */}
      <div style={{ display: "flex", gap: 6 }}>
        {STAGES.map((_, i) => (
          <div key={i} style={{
            width: i <= stageIdx ? 8 : 6,
            height: i <= stageIdx ? 8 : 6,
            borderRadius: "50%",
            background: i <= stageIdx ? "#a41034" : "rgba(255,255,255,0.12)",
            transition: "all 0.3s"
          }} />
        ))}
      </div>

      <p style={{ fontSize: 12, color: "#52525b", maxWidth: 280 }}>
        Анализ выполняется локально. Видео не передаётся в облако.
      </p>
    </div>
  );
}
