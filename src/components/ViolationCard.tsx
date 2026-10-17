"use client";

import { useState } from "react";
import type { Violation } from "@/types";

interface ViolationCardProps {
  violation: Violation;
  index: number;
  onSeek: (timecode: number) => void;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s % 1) * 10);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${ms}`;
}

export default function ViolationCard({ violation, index, onSeek }: ViolationCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);

  return (
    <>
      <div
        className="glass-2 animate-fadeInUp"
        style={{
          borderRadius: 12,
          overflow: "hidden",
          animationDelay: `${index * 0.1}s`,
          border: "1px solid rgba(164,16,52,0.25)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 16px",
            background: "rgba(164,16,52,0.08)",
            cursor: "pointer",
            borderBottom: expanded ? "1px solid rgba(164,16,52,0.15)" : "none"
          }}
          onClick={() => setExpanded((e) => !e)}
        >
          {/* Number badge */}
          <div style={{
            flexShrink: 0, width: 28, height: 28,
            borderRadius: "50%", background: "rgba(164,16,52,0.3)",
            border: "1px solid rgba(164,16,52,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#f87171"
          }}>
            {index + 1}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#f4f4f5", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {violation.type}
            </p>
          </div>

          {/* Timecode button */}
          <button
            className="badge-red"
            style={{ flexShrink: 0, cursor: "pointer", background: "rgba(164,16,52,0.25)" }}
            onClick={(e) => { e.stopPropagation(); onSeek(violation.timecode_sec); }}
            title="Перейти к моменту нарушения"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
            {formatTime(violation.timecode_sec)}
          </button>

          {/* Expand chevron */}
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            style={{ color: "#71717a", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Body */}
        {expanded && (
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Description */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#71717a", marginBottom: 6 }}>
                Описание события
              </p>
              <p style={{ fontSize: 13, color: "#d4d4d8", lineHeight: 1.65 }}>
                {violation.description}
              </p>
            </div>

            {/* Evidence frames */}
            {violation.evidence_frames.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#71717a", marginBottom: 8 }}>
                  Кадры-доказательства ({violation.evidence_frames.length})
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {violation.evidence_frames.map((frame, fi) => (
                    <div
                      key={fi}
                      className="evidence-frame"
                      style={{ width: 100, height: 70, position: "relative" }}
                      onClick={() => setSelectedFrame(`data:image/jpeg;base64,${frame.image_base64}`)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`data:image/jpeg;base64,${frame.image_base64}`}
                        alt={`Кадр ${fi + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {/* Zoom overlay */}
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "rgba(0,0,0,0)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: 0, transition: "opacity 0.2s",
                        borderRadius: 7
                      }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "1") && (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "0") && (e.currentTarget.style.background = "rgba(0,0,0,0)")}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="1.5"/>
                          <path d="M21 21l-4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M11 8v6M8 11h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      {/* Timestamp */}
                      <div style={{
                        position: "absolute", bottom: 3, left: 4,
                        fontSize: 9, color: "#fff",
                        background: "rgba(0,0,0,0.65)",
                        padding: "1px 4px", borderRadius: 3,
                        fontFamily: "var(--font-geist-mono)"
                      }}>
                        {formatTime(frame.timestamp_sec)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regulation */}
            {violation.regulation && (
              <div style={{
                background: "rgba(245,158,11,0.07)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 8, padding: "12px 14px",
                display: "flex", gap: 10, alignItems: "flex-start"
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M2 12l10 5 10-5" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#fbbf24", marginBottom: 4 }}>
                    Нормативный источник
                  </p>
                  <p style={{ fontSize: 12, color: "#d4d4d8", marginBottom: 2 }}>
                    {violation.regulation}
                  </p>
                  {violation.regulation_article && (
                    <p style={{ fontSize: 12, color: "#a1a1aa" }}>
                      {violation.regulation_article}
                    </p>
                  )}
                  {violation.regulation_url && (
                    <a
                      href={violation.regulation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 11, color: "#fbbf24", marginTop: 6,
                        textDecoration: "none"
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Открыть на adilet.zan.kz
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Seek button */}
            <button
              className="btn-ghost"
              style={{ alignSelf: "flex-start" }}
              onClick={() => onSeek(violation.timecode_sec)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <polygon points="5,3 19,12 5,21" fill="currentColor"/>
              </svg>
              Перейти к {formatTime(violation.timecode_sec)} в видео
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedFrame && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24
          }}
          onClick={() => setSelectedFrame(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedFrame}
            alt="Кадр-доказательство"
            style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 8 }}
          />
          <button
            style={{
              position: "absolute", top: 20, right: 20,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%", width: 40, height: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", cursor: "pointer", fontSize: 18
            }}
            onClick={() => setSelectedFrame(null)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
