"use client";

import { useState } from "react";
import type { Violation } from "@/types";
import {
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
  onSeek?: (timecode: number) => void;
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
      evidence: "Кадры события",
      observation: "Видимое наблюдение",
      rationale: "Почему событие вынесено на просмотр",
      missingRationale: "Обоснование не предоставлено. Событие требует просмотра специалистом.",
      recommendation: "Проверка специалистом",
      recommendationText: "Просмотрите последовательность до и после события. Сопоставьте видимое действие с применимым документом, если он предоставлен. Не делайте выводов о намерениях, личности участников или записях в банковской системе по одним кадрам.",
      regulation: "Нормативный источник",
      missingSource: "Источник не предоставлен. Нельзя подтвердить нарушение конкретного требования без применимого документа.",
      openSource: "Открыть предоставленный источник",
      reviewStatus: "Требует проверки",
      close: "Закрыть",
    },
    kz: {
      seek: "Таймкодқа өту",
      evidence: "Оқиға кадрлары",
      observation: "Көрінетін бақылау",
      rationale: "Оқиғаны қарауға белгілеу себебі",
      missingRationale: "Негіздеме берілмеген. Оқиғаны маман қарап шығуы қажет.",
      recommendation: "Маманның тексеруі",
      recommendationText: "Оқиғаға дейінгі және кейінгі реттілікті қараңыз. Қолданылатын құжат берілсе, көрінетін әрекетті сонымен салыстырыңыз. Тек кадрларға сүйеніп ниет, қатысушылардың жеке басы немесе банк жүйесіндегі жазбалар туралы қорытынды жасамаңыз.",
      regulation: "Нормативтік дереккөз",
      missingSource: "Дереккөз берілмеген. Қолданылатын құжатсыз нақты талаптың бұзылғанын растау мүмкін емес.",
      openSource: "Берілген дереккөзді ашу",
      reviewStatus: "Тексеру қажет",
      close: "Жабу",
    },
    en: {
      seek: "Seek to timecode",
      evidence: "Event frames",
      observation: "Visible observation",
      rationale: "Reason for review",
      missingRationale: "No rationale was provided. A specialist needs to review the event.",
      recommendation: "Specialist review",
      recommendationText: "Review the sequence before and after the event. Compare the visible action with the applicable document, if supplied. Do not infer intent, participant identity, or banking system entries from frames alone.",
      regulation: "Regulatory source",
      missingSource: "No source was provided. A breach of a specific requirement cannot be confirmed without the applicable document.",
      openSource: "Open supplied source",
      reviewStatus: "Needs review",
      close: "Close",
    },
  }[lang];
  const hasSource = Boolean(violation.regulation?.trim() || violation.regulation_article?.trim() || violation.regulation_url?.trim());
  const sourceUrl = /^https?:\/\//i.test(violation.regulation_url ?? "") ? violation.regulation_url : undefined;

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
              title={violation.type}
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
          {onSeek ? <button
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
          </button> : (
            <span className="badge-red" style={{ flexShrink: 0 }}>
              <ClockIcon style={{ width: 13, height: 13 }} />
              {formatTime(violation.timecode_sec)}
            </span>
          )}

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
            <span className="badge-amber" style={{ alignSelf: "flex-start" }}>{labels.reviewStatus}</span>
            {/* Visible observation */}
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--forte-text-primary)", marginBottom: 5 }}>{labels.observation}</h3>
              <p
              style={{
                fontSize: 13,
                color: "var(--forte-text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {violation.description}
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--forte-text-primary)", marginBottom: 5 }}>{labels.rationale}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--forte-text-secondary)" }}>{violation.rationale?.trim() || labels.missingRationale}</p>
            </div>

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
                  {violation.evidence_frames.slice(0, 3).map((frame, fi) => (
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
                        alt={`${labels.evidence}: ${formatTime(frame.timestamp_sec)}`}
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
                  {labels.recommendationText}
                </span>
              </div>
            </div>

            {/* Supplied source, or an explicit absence of source */}
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
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
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
                    <strong style={{ display: "block", marginBottom: 4 }}>{labels.regulation}</strong>
                    {hasSource ? [violation.regulation, violation.regulation_article].filter(Boolean).join(" · ") || violation.regulation_url : labels.missingSource}
                  </span>
                </div>
                {sourceUrl && (
                  <a
                    href={sourceUrl}
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
                    {labels.openSource}
                    <ArrowTopRightOnSquareIcon style={{ width: 13, height: 13 }} />
                  </a>
                )}
              </div>
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
                {labels.close}
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedFrame}
              alt={labels.evidence}
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
