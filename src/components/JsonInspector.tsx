"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/types";

interface JsonInspectorProps {
  result: AnalysisResult | null;
  jobId: string | null;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export default function JsonInspector({ result, jobId, apiKey, onApiKeyChange }: JsonInspectorProps) {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const json = result ? JSON.stringify(result, null, 2) : null;

  const handleCopy = () => {
    if (!json) return;
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    if (!json) return;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `forte-analysis-${jobId ?? "result"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* API Key section */}
      <div style={{
        padding: "14px 16px", borderRadius: 10,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)"
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#71717a", marginBottom: 10 }}>
          X-API-Key (для жюри)
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Введите API ключ..."
            style={{
              flex: 1, background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6, padding: "8px 12px",
              color: "#f4f4f5", fontSize: 13,
              fontFamily: "var(--font-geist-mono)",
              outline: "none"
            }}
          />
          <button
            className="btn-ghost"
            style={{ padding: "8px 12px" }}
            onClick={() => setShowKey((s) => !s)}
          >
            {showKey ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
            )}
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <code style={{
            flex: 1, fontSize: 11, color: "#71717a", wordBreak: "break-all",
            fontFamily: "var(--font-geist-mono)"
          }}>
            POST https://your-service.example.kz/api/v1/analyze
          </code>
        </div>
      </div>

      {/* JSON Output */}
      <div style={{
        borderRadius: 10,
        background: "#0a0a0c",
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden"
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px",
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          </div>
          <span style={{ fontSize: 11, color: "#52525b", fontFamily: "var(--font-geist-mono)" }}>
            application/json · API Response
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }} onClick={handleCopy} disabled={!json}>
              {copied ? "✓ Скопировано" : "Копировать"}
            </button>
            <button className="btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }} onClick={handleDownload} disabled={!json}>
              ↓ JSON
            </button>
          </div>
        </div>
        <pre style={{
          margin: 0, padding: "14px",
          fontSize: 12, lineHeight: 1.6,
          color: "#d4d4d8",
          fontFamily: "var(--font-geist-mono)",
          overflow: "auto",
          maxHeight: 360,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all"
        }}>
          {json ?? <span style={{ color: "#52525b" }}>// Загрузите видео для получения результата...</span>}
        </pre>
      </div>

      {/* Status indicators */}
      {result && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div className="badge-green">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            status: {result.status}
          </div>
          <div className={result.verdict === "violation" ? "badge-red" : "badge-green"}>
            verdict: {result.verdict}
          </div>
          {result.processing_time_ms && (
            <div className="badge-amber">
              ⏱ {(result.processing_time_ms / 1000).toFixed(1)}s
            </div>
          )}
        </div>
      )}
    </div>
  );
}
