"use client";

import type { AnalysisResult } from "@/types";

interface VerdictBannerProps {
  result: AnalysisResult;
  processingMs: number;
  lang?: "ru" | "kz" | "en";
}

export default function VerdictBanner({ result, processingMs, lang = "ru" }: VerdictBannerProps) {
  const isViolation = result.verdict === "violation";
  const count = result.violations.length;
  const t = {
    ru: {
      passed: "Нарушение не обнаружено",
      flagged: "Обнаружены признаки возможных нарушений",
      passedDescription: "События для просмотра не отмечены. Это не подтверждает соблюдение всех правил кассовой дисциплины.",
      flaggedDescription: "Отмеченные визуальные события требуют просмотра уполномоченным сотрудником.",
      caveat: "Результат является подсказкой для проверки, а не юридическим или дисциплинарным заключением.",
      events: "События",
    },
    kz: {
      passed: "Бұзушылық анықталған жоқ",
      flagged: "Ықтимал бұзушылықтардың белгілері анықталды",
      passedDescription: "Қарауға арналған оқиғалар белгіленбеген. Бұл кассалық тәртіптің барлық ережелері сақталғанын растамайды.",
      flaggedDescription: "Белгіленген визуалды оқиғаларды уәкілетті қызметкер қарап шығуы қажет.",
      caveat: "Нәтиже тексеруге көмек ретінде беріледі, заңдық немесе тәртіптік қорытынды емес.",
      events: "Оқиғалар",
    },
    en: {
      passed: "No violation detected",
      flagged: "Signs of possible violations detected",
      passedDescription: "No events are marked for review. This does not confirm compliance with every cash-handling rule.",
      flaggedDescription: "The marked visual events require review by an authorized person.",
      caveat: "This result assists review; it is not a legal or disciplinary conclusion.",
      events: "Events",
    },
  }[lang];

  if (!isViolation) {
    return (
      <div className="glow-green" style={{
        borderRadius: 14,
        padding: "20px 24px",
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(16,185,129,0.3)",
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap"
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
            {t.passed}
          </h2>
          <p style={{ fontSize: 13, color: "#6ee7b7", opacity: 0.8 }}>
            {t.passedDescription} {t.caveat}
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className="badge-lime">{t.events}: {count}</div>
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
      display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap"
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
          {t.flagged}
        </h2>
        <p style={{ fontSize: 13, color: "#fca5a5", opacity: 0.85 }}>
          {t.flaggedDescription} {t.caveat}
        </p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div className="badge-amber">{t.events}: {count}</div>
        <p style={{ fontSize: 11, color: "#71717a", marginTop: 6, fontFamily: "var(--font-geist-mono)" }}>
          {(processingMs / 1000).toFixed(1)}s · {result.job_id}
        </p>
      </div>
    </div>
  );
}
