"use client";

import { useCallback, useRef, useState } from "react";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import DropZone from "@/components/DropZone";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import ExecutiveVerdictCard from "@/components/ExecutiveVerdictCard";
import ViolationCard from "@/components/ViolationCard";
import ComplianceChecklist from "@/components/ComplianceChecklist";
import JsonInspector from "@/components/JsonInspector";
import type { AnalysisResult, ProcessingStatus, DemoCase } from "@/types";
import { DEMO_CASES } from "@/lib/demo-cases";
import { translations, type Language } from "@/lib/translations";
import {
  FilmIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CommandLineIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

type TabId = "violations" | "checklist" | "json";

export default function Home() {
  const [lang, setLang] = useState<Language>("ru");
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [seekTo, setSeekTo] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("violations");
  const [apiKey, setApiKey] = useState("forte-corp-key-prod");
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [selectedLanguageOption, setSelectedLanguageOption] = useState<"ru" | "kz" | "both">("both");

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const t = translations[lang];

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);
  };

  // Mock analysis execution
  const runMockAnalysis = useCallback(async (file: File) => {
    stopTimer();
    setResult(null);
    setSeekTo(null);
    setFileName(file.name);
    setVideoSrc(URL.createObjectURL(file));
    setStatus("uploading");
    setElapsedMs(0);

    const generatedJobId = `JOB-${new Date().getFullYear()}-FT-${Math.floor(1000 + Math.random() * 9000)}`;
    setJobId(generatedJobId);

    await new Promise((r) => setTimeout(r, 600));
    setStatus("processing");
    startTimer();

    try {
      // Simulate realistic processing time: 4-6 seconds
      const delay = 4500 + Math.random() * 2000;
      await new Promise((r) => setTimeout(r, delay));

      // Select preset based on file name or default to case 1
      const preset = DEMO_CASES[0].result;
      stopTimer();
      setElapsedMs(Date.now() - startTimeRef.current);
      setResult({ ...preset, job_id: generatedJobId });
      setStatus("done");
    } catch {
      stopTimer();
      setStatus("failed");
    }
  }, []);

  const loadPresetCase = (c: DemoCase) => {
    stopTimer();
    setFileName(`${c.label}.mp4`);
    setVideoSrc("/demo-sample.mp4");
    setResult(c.result);
    setJobId(c.result.job_id);
    setStatus("done");
    setElapsedMs(c.result.processing_time_ms ?? 3500);
    setSeekTo(null);
    setPresetsOpen(false);
    setActiveTab("violations");
  };

  const resetAll = () => {
    stopTimer();
    setStatus("idle");
    setVideoSrc(null);
    setFileName(null);
    setResult(null);
    setJobId(null);
    setSeekTo(null);
    setElapsedMs(0);
    setActiveTab("violations");
  };

  const violations = result?.violations ?? [];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Corporate Header */}
      <Header
        currentLang={lang}
        onLanguageChange={setLang}
        onOpenPresets={() => setPresetsOpen(true)}
        onGoHome={resetAll}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: 1280, width: "100%", margin: "0 auto", padding: "24px 20px" }}>
        {/* ====================================================================
            STATE 1: IDLE / UPLOAD
           ==================================================================== */}
        {status === "idle" && (
          <div
            className="animate-fadeIn"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              maxWidth: 960,
              margin: "20px auto 0",
            }}
          >
            {/* Title & Tagline Banner */}
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <span className="badge-forte">
                  <ShieldCheckIcon style={{ width: 14, height: 14 }} />
                  {t.brandName} {t.brandDescriptor}
                </span>
                <span className="badge-neutral">
                  Регламенты НБРК & АРРФР РК
                </span>
              </div>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--forte-text-primary)",
                  marginBottom: 8,
                }}
              >
                {t.brandTagline}
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--forte-text-secondary)",
                  maxWidth: 640,
                  margin: "0 auto",
                  lineHeight: 1.5,
                }}
              >
                {t.uploadSubtitle}
              </p>
            </div>

            {/* Language inspection selector */}
            <div
              className="card-corporate"
              style={{
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <InformationCircleIcon style={{ width: 18, height: 18, color: "var(--forte-brand)" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--forte-text-primary)" }}>
                  {t.checkLanguageLabel}
                </span>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { id: "both", label: t.langBoth },
                  { id: "kz", label: t.langKz },
                  { id: "ru", label: t.langRu },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedLanguageOption(opt.id as any)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "1px solid",
                      borderColor:
                        selectedLanguageOption === opt.id
                          ? "var(--forte-brand)"
                          : "var(--forte-border)",
                      backgroundColor:
                        selectedLanguageOption === opt.id
                          ? "rgba(14, 133, 230, 0.08)"
                          : "var(--forte-surface)",
                      color:
                        selectedLanguageOption === opt.id
                          ? "var(--forte-brand)"
                          : "var(--forte-text-secondary)",
                      transition: "all 0.12s ease",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DropZone */}
            <DropZone onFile={runMockAnalysis} lang={lang} />

            {/* Presets Grid */}
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FilmIcon style={{ width: 16, height: 16, color: "var(--forte-brand)" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--forte-text-primary)" }}>
                    {t.casesModalTitle}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "var(--forte-text-muted)" }}>
                  Готовые материалы для демонстрации алгоритмов проверки
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                {DEMO_CASES.map((c) => {
                  const hasViolations = c.result.violations.length > 0;
                  return (
                    <div
                      key={c.id}
                      className="card-corporate"
                      onClick={() => loadPresetCase(c)}
                      style={{
                        padding: 16,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        borderTop: hasViolations
                          ? "3px solid var(--pastel-red)"
                          : "3px solid var(--pastel-lime)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--forte-text-primary)" }}>
                          {c.label}
                        </span>
                        <span className={hasViolations ? "badge-red" : "badge-lime"}>
                          {hasViolations ? `${c.result.violations.length} замеч.` : "100% OK"}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "var(--forte-text-muted)", lineHeight: 1.4 }}>
                        {c.description}
                      </p>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--forte-brand)",
                          marginTop: "auto",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {t.selectCase} →
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE 2: PROCESSING / UPLOADING
           ==================================================================== */}
        {(status === "uploading" || status === "processing") && (
          <div style={{ maxWidth: 680, margin: "40px auto 0" }}>
            <ProcessingOverlay
              jobId={jobId}
              elapsedMs={elapsedMs}
              lang={lang}
            />
          </div>
        )}

        {/* ====================================================================
            STATE 3: DONE / RESULTS VIEW
            User requirement: "В кейсах выводи результат не сверху одной строкой
            а справа что бы проще читать было"
           ==================================================================== */}
        {status === "done" && result && (
          <div
            className="animate-fadeIn"
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 24,
              alignItems: "start",
            }}
          >
            {/* --------------------------------------------------------------
                LEFT COLUMN: Video Player & Media Technical Inspection
               -------------------------------------------------------------- */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Media Header Strip */}
              <div
                className="card-corporate"
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                  <FilmIcon style={{ width: 16, height: 16, color: "var(--forte-brand)", flexShrink: 0 }} />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--forte-text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fileName}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="badge-neutral" style={{ fontSize: 11 }}>
                    1080p · 25 FPS
                  </span>
                  <span className="badge-neutral" style={{ fontSize: 11 }}>
                    Stereo Audio
                  </span>
                </div>
              </div>

              {/* Video Player Component */}
              <VideoPlayer
                src={videoSrc}
                violations={violations}
                seekTo={seekTo}
                lang={lang}
              />

              {/* Video Inspection Guide Note */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  backgroundColor: "var(--forte-surface-2)",
                  border: "1px solid var(--forte-border)",
                  fontSize: 12,
                  color: "var(--forte-text-muted)",
                  lineHeight: 1.5,
                  display: "flex",
                  gap: 8,
                }}
              >
                <InformationCircleIcon style={{ width: 16, height: 16, color: "var(--forte-brand)", flexShrink: 0, marginTop: 1 }} />
                <span>
                  Точки на шкале времени соответствуют моментам фиксации нарушений.
                  Кликните по маркеру или по таймкоду в карточке справа для моментального позиционирования видеокадра.
                </span>
              </div>
            </div>

            {/* --------------------------------------------------------------
                RIGHT COLUMN: Executive Verdict & Detailed Audit Results
                (Everything displayed on the right for superior readability!)
               -------------------------------------------------------------- */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Executive Verdict Card (Right Side Top) */}
              <ExecutiveVerdictCard
                result={result}
                processingMs={elapsedMs}
                onReset={resetAll}
                lang={lang}
              />

              {/* Tab Navigation for Detailed Inspection */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  borderBottom: "1px solid var(--forte-border)",
                  paddingBottom: 6,
                }}
              >
                {[
                  {
                    id: "violations",
                    label: `${t.tabViolations} (${violations.length})`,
                    icon: ExclamationTriangleIcon,
                  },
                  {
                    id: "checklist",
                    label: t.tabChecklist,
                    icon: DocumentTextIcon,
                  },
                  {
                    id: "json",
                    label: t.tabApi,
                    icon: CommandLineIcon,
                  },
                ].map((tb) => {
                  const isActive = activeTab === tb.id;
                  const Icon = tb.icon;
                  return (
                    <button
                      key={tb.id}
                      type="button"
                      onClick={() => setActiveTab(tb.id as TabId)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 12px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: isActive ? 700 : 500,
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: isActive
                          ? "var(--forte-surface-2)"
                          : "transparent",
                        color: isActive
                          ? "var(--forte-brand)"
                          : "var(--forte-text-secondary)",
                        borderBottom: isActive
                          ? "2px solid var(--forte-brand)"
                          : "2px solid transparent",
                        transition: "all 0.12s ease",
                      }}
                    >
                      <Icon style={{ width: 14, height: 14 }} />
                      <span>{tb.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content 1: Violations List */}
              {activeTab === "violations" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {violations.length === 0 ? (
                    <div
                      className="card-corporate"
                      style={{
                        padding: "36px 20px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          backgroundColor: "var(--pastel-lime-bg)",
                          border: "1px solid var(--pastel-lime-border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--pastel-lime)",
                        }}
                      >
                        <CheckCircleIcon style={{ width: 24, height: 24 }} />
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "var(--forte-text-primary)" }}>
                        {t.verdictPassed}
                      </p>
                      <p style={{ fontSize: 13, color: "var(--forte-text-secondary)", maxWidth: 360 }}>
                        В данном материале нарушений законодательства РК о рекламе и регламентов НБРК не обнаружено.
                      </p>
                    </div>
                  ) : (
                    violations.map((v, i) => (
                      <ViolationCard
                        key={i}
                        violation={v}
                        index={i}
                        onSeek={(tc) => setSeekTo(tc)}
                        lang={lang}
                      />
                    ))
                  )}
                </div>
              )}

              {/* Tab Content 2: Regulatory Checklist */}
              {activeTab === "checklist" && (
                <ComplianceChecklist
                  violations={violations}
                  onSeek={(tc) => setSeekTo(tc)}
                  lang={lang}
                />
              )}

              {/* Tab Content 3: API & JSON Inspector */}
              {activeTab === "json" && (
                <JsonInspector
                  result={result}
                  jobId={jobId}
                  apiKey={apiKey}
                  onApiKeyChange={setApiKey}
                  lang={lang}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Corporate Presets Modal */}
      {presetsOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
          onClick={() => setPresetsOpen(false)}
        >
          <div
            className="card-corporate"
            style={{
              maxWidth: 720,
              width: "100%",
              padding: 24,
              backgroundColor: "var(--forte-surface)",
              boxShadow: "var(--forte-shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "var(--forte-text-primary)",
                  }}
                >
                  {t.casesModalTitle}
                </h3>
                <p style={{ fontSize: 12, color: "var(--forte-text-muted)" }}>
                  {t.casesModalSubtitle}
                </p>
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setPresetsOpen(false)}
                style={{ padding: "6px 10px" }}
              >
                <XMarkIcon style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {DEMO_CASES.map((c) => {
                const hasViolations = c.result.violations.length > 0;
                return (
                  <div
                    key={c.id}
                    className="card-corporate"
                    onClick={() => loadPresetCase(c)}
                    style={{
                      padding: 16,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      borderLeft: hasViolations
                        ? "4px solid var(--pastel-red)"
                        : "4px solid var(--pastel-lime)",
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--forte-text-primary)", marginBottom: 4 }}>
                        {c.label}
                      </h4>
                      <p style={{ fontSize: 12, color: "var(--forte-text-secondary)" }}>
                        {c.description}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className={hasViolations ? "badge-red" : "badge-lime"}>
                        {hasViolations ? `${c.result.violations.length} замеч.` : "Соответствует"}
                      </span>
                      <span className="btn-secondary" style={{ fontSize: 12, padding: "5px 10px" }}>
                        {t.selectCase}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
