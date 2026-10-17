"use client";

import { useState } from "react";
import type { Violation } from "@/types";
import {
  ExclamationTriangleIcon,
  ClockIcon,
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon,
  PhotoIcon,
  ShieldCheckIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

interface ViolationCardProps {
  violation: Violation;
  index: number;
  onSeek: (timecode: number) => void;
  lang?: "ru" | "kz" | "en";
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s % 1) * 10);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${ms}`;
}

export default function ViolationCard({
  violation,
  index,
  onSeek,
  lang = "ru",
}: ViolationCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);

  const labels = {
    ru: {
      seek: "Перейти к таймкоду",
      evidence: "Кадры фиксации (OCR)",
      recommendation: "Рекомендация юридического комплаенса",
      regulation: "Нормативно-правовое основание",
      openAdilet: "Открыть статью в «Әділет»",
      riskLevel: "Критический риск",
    },
    kz: {
      seek: "Таймкодқа өту",
      evidence: "Тіркелген кадрлар (OCR)",
      recommendation: "Заңдық комплаенс ұсынысы",
      regulation: "Нормативтік-құқықтық негіз",
      openAdilet: "«Әділет» базасынан ашу",
      riskLevel: "Қауіпті деңгей",
    },
    en: {
      seek: "Seek to timecode",
      evidence: "Frame Evidence (OCR)",
      recommendation: "Legal Remediation Recommendation",
      regulation: "Regulatory Mandate Reference",
      openAdilet: "View in Adilet Legal Archive",
      riskLevel: "Critical Risk",
    },
  }[lang];

  return (
    <>
      <div
        className="card-corporate animate-fadeIn"
        style={{
          overflow: "hidden",
          borderLeft: "4px solid var(--pastel-red)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            background: "var(--forte-surface)",
            cursor: "pointer",
            borderBottom: expanded ? "1px solid var(--forte-border)" : "none",
          }}
          onClick={() => setExpanded((e) => !e)}
        >
          {/* Violation index */}
          <div
            style={{
              flexShrink: 0,
              width: 26,
              height: 26,
              borderRadius: "50%",
              backgroundColor: "var(--pastel-red-bg)",
              border: "1px solid var(--pastel-red-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--pastel-red-text)",
            }}
          >
            {index + 1}
          </div>

          {/* Title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--forte-text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {violation.type}
            </p>
          </div>

          {/* Timecode Button */}
          <button
            type="button"
            className="badge-red"
            style={{
              cursor: "pointer",
              transition: "transform 0.1s ease",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSeek(violation.timecode_sec);
            }}
            title={labels.seek}
          >
            <ClockIcon style={{ width: 13, height: 13 }} />
            {formatTime(violation.timecode_sec)}
          </button>

          {/* Chevron */}
          <ChevronDownIcon
            style={{
              width: 16,
              height: 16,
              color: "var(--forte-text-muted)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              background: "var(--forte-surface-subtle)",
            }}
          >
            {/* Description */}
            <p
              style={{
                fontSize: 13,
                color: "var(--forte-text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {violation.description}
            </p>

            {/* Evidence Frames */}
            {violation.evidence_frames.length > 0 && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--forte-text-muted)",
                    marginBottom: 8,
                  }}
                >
                  <PhotoIcon style={{ width: 14, height: 14 }} />
                  {labels.evidence}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {violation.evidence_frames.map((frame, fi) => (
                    <div
                      key={fi}
                      style={{
                        position: "relative",
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1px solid var(--forte-border)",
                        cursor: "pointer",
                        background: "var(--forte-surface-2)",
                      }}
                      onClick={() => setSelectedFrame(frame.image_base64)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={frame.image_base64}
                        alt={`Evidence at ${frame.timestamp_sec}s`}
                        style={{
                          width: 120,
                          height: 68,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          bottom: 4,
                          right: 4,
                          fontSize: 10,
                          fontWeight: 600,
                          background: "rgba(0,0,0,0.65)",
                          color: "#FFFFFF",
                          padding: "1px 5px",
                          borderRadius: 4,
                        }}
                      >
                        {formatTime(frame.timestamp_sec)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation Box */}
            <div
              style={{
                borderRadius: 8,
                padding: "10px 12px",
                background: "var(--pastel-amber-bg)",
                border: "1px solid var(--pastel-amber-border)",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <LightBulbIcon
                style={{
                  width: 18,
                  height: 18,
                  color: "var(--pastel-amber)",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--pastel-amber-text)",
                    display: "block",
                    marginBottom: 2,
                  }}
                >
                  {labels.recommendation}
                </span>
                <span style={{ color: "var(--forte-text-secondary)" }}>
                  Увеличить размер шрифта ГЭСВ минимум до 50% от размера
                  привлекающей ставки вознаграждения и дополнить голосовое
                  сопровождение текстом обязательного дисклеймера.
                </span>
              </div>
            </div>

            {/* Legal Reference */}
            {violation.regulation && (
              <div
                style={{
                  paddingTop: 10,
                  borderTop: "1px solid var(--forte-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <ShieldCheckIcon
                    style={{
                      width: 15,
                      height: 15,
                      color: "var(--forte-brand)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--forte-text-muted)",
                    }}
                  >
                    {violation.regulation_article || violation.regulation}
                  </span>
                </div>
                {violation.regulation_url && (
                  <a
                    href={violation.regulation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--forte-brand)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      textDecoration: "none",
                    }}
                  >
                    {labels.openAdilet}
                    <ArrowTopRightOnSquareIcon style={{ width: 13, height: 13 }} />
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Frame Fullscreen Preview Modal */}
      {selectedFrame && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 24,
          }}
          onClick={() => setSelectedFrame(null)}
        >
          <div
            className="card-corporate"
            style={{
              maxWidth: 720,
              width: "100%",
              padding: 16,
              background: "var(--forte-surface)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--forte-text-primary)",
                }}
              >
                {labels.evidence}
              </span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: "4px 10px", fontSize: 12 }}
                onClick={() => setSelectedFrame(null)}
              >
                Закрыть
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedFrame}
              alt="Evidence full"
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid var(--forte-border)",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
