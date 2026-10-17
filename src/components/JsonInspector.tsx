"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/types";
import {
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowDownTrayIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

interface JsonInspectorProps {
  result: AnalysisResult | null;
  jobId: string | null;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  lang?: "ru" | "kz" | "en";
}

export default function JsonInspector({
  result,
  jobId,
  apiKey,
  onApiKeyChange,
  lang = "ru",
}: JsonInspectorProps) {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const json = result ? JSON.stringify(result, null, 2) : null;

  const t = {
    ru: {
      authTitle: "Аутентификация API шлюза (X-API-Key)",
      keyPlaceholder: "Введите корпоративный API-ключ...",
      keyHint: "Используется для взаимодействия с сервисом автоматического аудита",
      copyBtn: "Копировать JSON",
      copied: "Скопировано",
      downloadBtn: "Скачать отчёт (.JSON)",
      emptyHint: "Запустите проверку видеофайла для формирования нормативного JSON-отчёта.",
    },
    kz: {
      authTitle: "API шлюзінің аутентификациясы (X-API-Key)",
      keyPlaceholder: "Корпоративтік API кілтін енгізіңіз...",
      keyHint: "Автоматтандырылған аудит қызметімен өзара әрекеттесу үшін қолданылады",
      copyBtn: "JSON көшіру",
      copied: "Көшірілді",
      downloadBtn: "Есепті жүктеп алу (.JSON)",
      emptyHint: "Нормативтік JSON есебін жасау үшін бейнефайлды тексеруді іске қосыңыз.",
    },
    en: {
      authTitle: "API Gateway Authentication (X-API-Key)",
      keyPlaceholder: "Enter corporate API key...",
      keyHint: "Used to authenticate against automated compliance auditing endpoints",
      copyBtn: "Copy JSON Payload",
      copied: "Copied to clipboard",
      downloadBtn: "Download Report (.JSON)",
      emptyHint: "Execute a compliance audit run to generate the structured JSON audit payload.",
    },
  }[lang];

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
    a.download = `forte-compliance-report-${jobId ?? "export"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* API Key section */}
      <div
        className="card-corporate"
        style={{
          padding: "16px",
          background: "var(--forte-surface)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "var(--forte-text-secondary)",
            marginBottom: 10,
          }}
        >
          <KeyIcon style={{ width: 15, height: 15, color: "var(--forte-brand)" }} />
          {t.authTitle}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder={t.keyPlaceholder}
            style={{
              flex: 1,
              background: "var(--forte-surface-2)",
              border: "1px solid var(--forte-border)",
              borderRadius: 8,
              padding: "9px 12px",
              color: "var(--forte-text-primary)",
              fontSize: 13,
              fontFamily: "monospace",
              outline: "none",
            }}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowKey(!showKey)}
            title={showKey ? "Скрыть" : "Показать"}
            style={{ padding: "9px 12px" }}
          >
            {showKey ? (
              <EyeSlashIcon style={{ width: 16, height: 16 }} />
            ) : (
              <EyeIcon style={{ width: 16, height: 16 }} />
            )}
          </button>
        </div>
        <p
          style={{
            fontSize: 11,
            color: "var(--forte-text-muted)",
            marginTop: 6,
          }}
        >
          {t.keyHint}
        </p>
      </div>

      {/* JSON actions */}
      {json ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "var(--forte-text-secondary)",
              }}
            >
              <CodeBracketIcon style={{ width: 15, height: 15 }} />
              <span>Job Payload · {jobId}</span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: 12, padding: "6px 12px" }}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <CheckIcon style={{ width: 14, height: 14, color: "var(--pastel-lime)" }} />
                    <span style={{ color: "var(--pastel-lime)" }}>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon style={{ width: 14, height: 14 }} />
                    <span>{t.copyBtn}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-primary"
                style={{ fontSize: 12, padding: "6px 12px" }}
                onClick={handleDownload}
              >
                <ArrowDownTrayIcon style={{ width: 14, height: 14 }} />
                <span>{t.downloadBtn}</span>
              </button>
            </div>
          </div>

          <pre
            className="card-corporate"
            style={{
              padding: 16,
              background: "var(--forte-surface-2)",
              fontSize: 12,
              fontFamily: "monospace",
              color: "var(--forte-text-primary)",
              lineHeight: 1.55,
              maxHeight: 460,
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {json}
          </pre>
        </div>
      ) : (
        <div
          className="card-corporate"
          style={{
            padding: 32,
            textAlign: "center",
            color: "var(--forte-text-muted)",
            fontSize: 13,
          }}
        >
          {t.emptyHint}
        </div>
      )}
    </div>
  );
}
