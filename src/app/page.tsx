"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import DropZone from "@/components/DropZone";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import VerdictBanner from "@/components/VerdictBanner";
import ViolationCard from "@/components/ViolationCard";
import ComplianceChecklist from "@/components/ComplianceChecklist";
import JsonInspector from "@/components/JsonInspector";
import type { AnalysisResult, ProcessingStatus } from "@/types";
import { DEMO_CASES } from "@/lib/demo-cases";

type TabId = "results" | "checklist" | "json";

const TABS: { id: TabId; label: string }[] = [
  { id: "results", label: "Нарушения" },
  { id: "checklist", label: "Чеклист регламентов" },
  { id: "json", label: "API · JSON" },
];

// ---------- Mock API call ----------
async function mockAnalyze(file: File): Promise<AnalysisResult> {
  // Simulate latency 10–20s
  const delay = 10000 + Math.random() * 10000;
  await new Promise((r) => setTimeout(r, delay));
  // Random result for demo: 50% chance violation
  if (Math.random() > 0.5) {
    return DEMO_CASES[2].result; // violation
  }
  return DEMO_CASES[0].result; // clean
}
// -----------------------------------

export default function Home() {
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [seekTo, setSeekTo] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("results");
  const [apiKey, setApiKey] = useState("forte-demo-key-2026");
  const [demoOpen, setDemoOpen] = useState(false);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);
  };

  const handleFile = useCallback(async (file: File) => {
    stopTimer();
    setResult(null);
    setSeekTo(null);
    setFileName(file.name);
    setVideoSrc(URL.createObjectURL(file));
    setStatus("uploading");
    setElapsedMs(0);

    const fakeJobId = `job-${Math.random().toString(36).slice(2, 10)}`;
    setJobId(fakeJobId);

    await new Promise((r) => setTimeout(r, 800)); // upload delay
    setStatus("processing");
    startTimer();

    try {
      const res = await mockAnalyze(file);
      stopTimer();
      setElapsedMs(Date.now() - startTimeRef.current);
      setResult({ ...res, job_id: fakeJobId });
      setStatus("done");
    } catch {
      stopTimer();
      setStatus("failed");
    }
  }, []);

  const handleDemo = (demoId: string) => {
    stopTimer();
    const demo = DEMO_CASES.find((d) => d.id === demoId);
    if (!demo) return;
    setDemoOpen(false);
    setResult(null);
    setSeekTo(null);
    setVideoSrc(null);
    setFileName(`[Демо] ${demo.label}`);
    setJobId(demo.result.job_id);
    setStatus("processing");
    setElapsedMs(0);
    startTimer();

    // Simulate quick processing for demo
    setTimeout(() => {
      stopTimer();
      setElapsedMs(demo.result.processing_time_ms ?? 3000);
      setResult(demo.result);
      setStatus("done");
    }, 2500);
  };

  const handleReset = () => {
    stopTimer();
    setStatus("idle");
    setVideoSrc(null);
    setFileName(null);
    setResult(null);
    setJobId(null);
    setSeekTo(null);
    setElapsedMs(0);
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (videoSrc && videoSrc.startsWith("blob:")) URL.revokeObjectURL(videoSrc);
      stopTimer();
    };
  }, [videoSrc]);

  const violations = result?.violations ?? [];
  const isProcessing = status === "uploading" || status === "processing";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(12,12,14,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 24px",
        display: "flex", alignItems: "center", height: 56, gap: 16
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #a41034, #e53e6b)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 10l-4 4L7 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: "#f4f4f5" }}>ForteBank</p>
            <p style={{ fontSize: 10, color: "#71717a", lineHeight: 1, marginTop: 2 }}>AI Cash Inspector</p>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Server status */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#71717a" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
          API Online
        </div>

        {/* Demo button */}
        <div style={{ position: "relative" }}>
          <button
            className="btn-ghost"
            style={{ fontSize: 12 }}
            onClick={() => setDemoOpen((o) => !o)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>
            Демо-кейсы
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ transform: demoOpen ? "rotate(180deg)" : "rotate(0)" }}>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {demoOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              background: "#1c1c21",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: 8, minWidth: 220,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              zIndex: 50
            }}>
              {DEMO_CASES.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => handleDemo(demo.id)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                    width: "100%", padding: "10px 12px", borderRadius: 7,
                    background: "transparent", border: "none",
                    cursor: "pointer", textAlign: "left",
                    transition: "background 0.15s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5" }}>{demo.label}</span>
                  <span style={{ fontSize: 11, color: "#71717a", marginTop: 2 }}>{demo.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset */}
        {status !== "idle" && (
          <button className="btn-ghost" style={{ fontSize: 12 }} onClick={handleReset}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M3 12a9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9c-2.52 0-4.8.97-6.5 2.57" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M3 6v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Сбросить
          </button>
        )}
      </nav>

      {/* ── MAIN ────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "24px", maxWidth: 1280, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Title row */}
        {status === "idle" && (
          <div style={{ textAlign: "center", paddingTop: 32, paddingBottom: 8 }}>
            <div className="badge-red" style={{ marginBottom: 16, display: "inline-flex" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171", display: "inline-block" }} className="animate-pulse-red" />
              Datathon 26 · ForteBank
            </div>
            <h1 className="gradient-text" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 14 }}>
              AI-сервис контроля<br />кассовой дисциплины
            </h1>
            <p style={{ color: "#71717a", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
              Загрузите видеозапись работы кассира. AI-модель выявит признаки нарушений, укажет таймкод и приведёт соответствующий нормативный акт РК.
            </p>
          </div>
        )}

        {/* ── IDLE: Upload ── */}
        {status === "idle" && (
          <div style={{ maxWidth: 560, margin: "0 auto", width: "100%" }}>
            <DropZone onFile={handleFile} />
            {/* Feature badges */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 20 }}>
              {["🔒 Локальный анализ", "⚖ Нормативы НБРК", "📸 Кадры-доказательства", "⏱ Таймкод события"].map((f) => (
                <span key={f} style={{
                  fontSize: 12, color: "#71717a",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 100, padding: "4px 12px"
                }}>{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── UPLOADING / PROCESSING ── */}
        {isProcessing && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }} className="responsive-grid">
            {/* Left: player or placeholder */}
            <div className="glass" style={{ borderRadius: 14, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} className="animate-pulse-red" />
                <span style={{ fontSize: 13, color: "#a1a1aa", fontWeight: 500 }}>
                  {fileName}
                </span>
              </div>
              <VideoPlayer src={videoSrc} violations={[]} seekTo={null} />
            </div>
            {/* Right: processing */}
            <div className="glass" style={{ borderRadius: 14 }}>
              <ProcessingOverlay jobId={jobId} elapsedMs={elapsedMs} />
            </div>
          </div>
        )}

        {/* ── DONE / FAILED ── */}
        {(status === "done" || status === "failed") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Verdict banner */}
            {result && status === "done" && (
              <VerdictBanner result={result} processingMs={elapsedMs} />
            )}
            {status === "failed" && (
              <div style={{
                borderRadius: 14, padding: "20px 24px",
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.3)",
                color: "#fbbf24", fontWeight: 600
              }}>
                ⚠ Ошибка обработки. Сервис недоступен или превышено время ожидания (5 мин). Попробуйте снова.
              </div>
            )}

            {/* Two-column layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20, alignItems: "start" }}>
              {/* Left: video */}
              <div className="glass" style={{ borderRadius: 14, padding: 20, position: "sticky", top: 72 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="4" width="20" height="16" rx="3" stroke="#71717a" strokeWidth="1.5"/>
                      <polygon points="9,8 17,12 9,16" fill="#71717a"/>
                    </svg>
                    <span style={{ fontSize: 13, color: "#a1a1aa", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {fileName}
                    </span>
                  </div>
                  {violations.length > 0 && (
                    <div className="badge-red" style={{ flexShrink: 0 }}>
                      {violations.length} {violations.length === 1 ? "нарушение" : "нарушения"}
                    </div>
                  )}
                </div>
                <VideoPlayer
                  src={videoSrc}
                  violations={violations}
                  seekTo={seekTo}
                  onTimeUpdate={() => {}}
                />
                {/* Upload new */}
                <label style={{ display: "block", marginTop: 14, cursor: "pointer" }}>
                  <input type="file" accept=".mov,video/quicktime" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
                  <div className="btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Загрузить другое видео
                  </div>
                </label>
              </div>

              {/* Right: tabs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {/* Tabs */}
                <div style={{ display: "flex", gap: 20, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 16, paddingLeft: 2 }}>
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={activeTab === tab.id ? "tab-active" : "tab-inactive"}
                      style={{ background: "none", border: "none", outline: "none", cursor: "pointer", fontSize: 13 }}
                    >
                      {tab.label}
                      {tab.id === "results" && violations.length > 0 && (
                        <span style={{
                          marginLeft: 6, fontSize: 10, fontWeight: 700,
                          background: "rgba(164,16,52,0.3)",
                          color: "#f87171",
                          padding: "1px 6px", borderRadius: 100
                        }}>{violations.length}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab: Results */}
                {activeTab === "results" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {violations.length === 0 ? (
                      <div style={{
                        padding: "40px 24px", textAlign: "center",
                        color: "#52525b", border: "1px dashed rgba(16,185,129,0.25)",
                        borderRadius: 12, background: "rgba(16,185,129,0.03)"
                      }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 12px" }}>
                          <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="10" stroke="rgba(16,185,129,0.3)" strokeWidth="1"/>
                        </svg>
                        <p style={{ color: "#34d399", fontWeight: 600, marginBottom: 4 }}>Нарушений не обнаружено</p>
                        <p style={{ fontSize: 13 }}>Кассовая дисциплина в норме</p>
                      </div>
                    ) : (
                      violations.map((v, i) => (
                        <ViolationCard
                          key={i}
                          violation={v}
                          index={i}
                          onSeek={(t) => setSeekTo(t)}
                        />
                      ))
                    )}
                  </div>
                )}

                {/* Tab: Checklist */}
                {activeTab === "checklist" && (
                  <ComplianceChecklist
                    violations={violations}
                    onSeek={(t) => setSeekTo(t)}
                  />
                )}

                {/* Tab: JSON */}
                {activeTab === "json" && (
                  <JsonInspector
                    result={result}
                    jobId={jobId}
                    apiKey={apiKey}
                    onApiKeyChange={setApiKey}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 8
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            width: 20, height: 20, borderRadius: 5,
            background: "linear-gradient(135deg, #a41034, #e53e6b)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ fontSize: 10, color: "#fff" }}>F</span>
          </div>
          <span style={{ fontSize: 12, color: "#52525b" }}>ForteBank AI Inspector · Datathon 26</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="https://adilet.zan.kz" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#52525b", textDecoration: "none" }}>
            adilet.zan.kz
          </a>
          <a href="https://nationalbank.kz" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#52525b", textDecoration: "none" }}>
            НБРК
          </a>
          <span style={{ fontSize: 11, color: "#3f3f46" }}>
            🔒 Полностью локальная обработка
          </span>
        </div>
      </footer>

      {/* Overlay click outside demo menu */}
      {demoOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 35 }}
          onClick={() => setDemoOpen(false)}
        />
      )}
    </div>
  );
}
