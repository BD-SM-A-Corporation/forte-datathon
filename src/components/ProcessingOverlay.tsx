"use client";

import { useEffect, useState } from "react";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";

interface ProcessingOverlayProps {
  jobId: string | null;
  elapsedMs: number;
  lang?: "ru" | "kz" | "en";
}

const STAGES = {
  ru: [
    { label: "Загрузка и парсинг медиа-контейнера...", pct: 15 },
    { label: "Извлечение аудиодорожки и транскрибация речи...", pct: 35 },
    { label: "Оптическое распознавание кадров (OCR дисклеймеров)...", pct: 55 },
    { label: "Сверка соразмерности шрифта ГЭСВ и номинальной ставки...", pct: 75 },
    { label: "Проверка номера лицензии АРРФР и языкового паритета...", pct: 90 },
    { label: "Финализация юридического отчёта о комплаенсе...", pct: 98 },
  ],
  kz: [
    { label: "Медиа-контейнерді жүктеу және талдау...", pct: 15 },
    { label: "Аудиожолды шығару және дауысты мәтінге айналдыру...", pct: 35 },
    { label: "Кадрларды оптикалық тану (OCR ескертулері)...", pct: 55 },
    { label: "ЖТСМ мен номиналды мөлшерлеме қаріптерін салыстыру...", pct: 75 },
    { label: "ҚҚРА лицензиясы мен тілдік паритетті тексеру...", pct: 90 },
    { label: "Комплаенс бойынша қорытынды есепті қалыптастыру...", pct: 98 },
  ],
  en: [
    { label: "Uploading & parsing media stream container...", pct: 15 },
    { label: "Extracting audio track & speech-to-text recognition...", pct: 35 },
    { label: "Executing optical character recognition (OCR on fine-print)...", pct: 55 },
    { label: "Analyzing font proportionality between GESV & nominal rate...", pct: 75 },
    { label: "Validating ARDFM license credentials & state language parity...", pct: 90 },
    { label: "Finalizing legal compliance audit summary...", pct: 98 },
  ],
};

export default function ProcessingOverlay({
  jobId,
  elapsedMs,
  lang = "ru",
}: ProcessingOverlayProps) {
  const [stageIdx, setStageIdx] = useState(0);

  const stages = STAGES[lang] || STAGES.ru;

  useEffect(() => {
    const id = setInterval(() => {
      setStageIdx((i) => Math.min(i + 1, stages.length - 1));
    }, 1800);
    return () => clearInterval(id);
  }, [stages.length]);

  const stage = stages[stageIdx];
  const elapsed = (elapsedMs / 1000).toFixed(1);

  return (
    <div
      className="card-corporate"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        gap: 24,
        textAlign: "center",
        background: "var(--forte-surface)",
      }}
    >
      {/* Clean Corporate Spinner */}
      <div style={{ position: "relative", width: 72, height: 72 }}>
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          style={{ animation: "spin 1.2s linear infinite" }}
        >
          <circle
            cx="36"
            cy="36"
            r="30"
            fill="none"
            stroke="var(--forte-border)"
            strokeWidth="5"
          />
          <circle
            cx="36"
            cy="36"
            r="30"
            fill="none"
            stroke="var(--forte-brand)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="188"
            strokeDashoffset="120"
          />
        </svg>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--forte-brand)",
            fontFamily: "monospace",
          }}
        >
          {stage.pct}%
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Stage Title */}
      <div>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--forte-text-primary)",
            marginBottom: 6,
          }}
        >
          {stage.label}
        </p>
        <p style={{ fontSize: 12, color: "var(--forte-text-muted)" }}>
          ID операции: <code style={{ color: "var(--forte-brand)" }}>{jobId}</code> · Прошло: {elapsed}с
        </p>
      </div>

      {/* Steps List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 440,
          width: "100%",
          textAlign: "left",
        }}
      >
        {stages.map((st, i) => {
          const isDone = i < stageIdx;
          const isCurrent = i === stageIdx;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 12,
                color: isDone
                  ? "var(--pastel-lime-text)"
                  : isCurrent
                  ? "var(--forte-text-primary)"
                  : "var(--forte-text-faint)",
                fontWeight: isCurrent ? 600 : 400,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  backgroundColor: isDone
                    ? "var(--pastel-lime-bg)"
                    : isCurrent
                    ? "rgba(14, 133, 230, 0.12)"
                    : "var(--forte-surface-2)",
                  border: isDone
                    ? "1px solid var(--pastel-lime-border)"
                    : isCurrent
                    ? "1px solid var(--forte-brand)"
                    : "1px solid var(--forte-border)",
                }}
              >
                {isDone ? (
                  <CheckIcon style={{ width: 11, height: 11, color: "var(--pastel-lime)" }} />
                ) : isCurrent ? (
                  <ArrowPathIcon
                    style={{
                      width: 11,
                      height: 11,
                      color: "var(--forte-brand)",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 9, color: "var(--forte-text-muted)" }}>{i + 1}</span>
                )}
              </div>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
