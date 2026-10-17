"use client";

import type { AnalysisResult } from "@/types";
import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ShieldExclamationIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface ExecutiveVerdictCardProps {
  result: AnalysisResult;
  processingMs: number;
  onReset: () => void;
  lang?: "ru" | "kz" | "en";
}

export default function ExecutiveVerdictCard({
  result,
  processingMs,
  onReset,
  lang = "ru",
}: ExecutiveVerdictCardProps) {
  const isViolation = result.verdict === "violation";
  const violationsCount = result.violations.length;

  // Calculate a realistic compliance score
  // If 0 violations -> 100%, each violation deducts ~15%
  const complianceScore = Math.max(10, 100 - violationsCount * 18);

  const t = {
    ru: {
      statusPassed: "Соответствует нормативам",
      statusFailed: "Обнаружены нарушения",
      descPassed: "Рекламный видеоролик прошёл проверку. Все требования НБРК и АРРФР соблюдены.",
      descFailed: "Обнаружены отклонения от нормативных требований НБРК к финансовой рекламе.",
      complianceScore: "Индекс соответствия",
      totalViolations: "Всего замечаний",
      criticalCount: "Критических",
      mediumCount: "Предупреждений",
      duration: "Время аудита",
      jobId: "ID проверки",
      newAudit: "Новый аудит",
    },
    kz: {
      statusPassed: "Талаптарға толық сай келеді",
      statusFailed: "Бұзушылықтар анықталды",
      descPassed: "Жарнамалық бейне тексеруден сәтті өтті. ҰБ мен ҚҚРА барлық талаптары орындалған.",
      descFailed: "Қаржылық жарнамаға қойылатын ҰБ талаптарынан ауытқулар тіркелді.",
      complianceScore: "Сәйкестік индексі",
      totalViolations: "Барлық ескертулер",
      criticalCount: "Қауіпті",
      mediumCount: "Ескертулер",
      duration: "Аудит уақыты",
      jobId: "Тексеру ID",
      newAudit: "Жаңа аудит",
    },
    en: {
      statusPassed: "Fully Compliant",
      statusFailed: "Violations Detected",
      descPassed: "The promotional video passed automated inspection. NBRK and ARDFM standards satisfied.",
      descFailed: "Identified non-compliant discrepancies regarding NBRK financial advertising rules.",
      complianceScore: "Compliance Score",
      totalViolations: "Total Findings",
      criticalCount: "Critical",
      mediumCount: "Warnings",
      duration: "Audit Duration",
      jobId: "Job Reference",
      newAudit: "New Audit",
    },
  }[lang];

  return (
    <div
      className="card-corporate animate-fadeIn"
      style={{
        padding: "18px 20px",
        background: "var(--forte-surface)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        borderTop: isViolation
          ? "4px solid var(--pastel-red)"
          : "4px solid var(--pastel-lime)",
      }}
    >
      {/* Top Status & Badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isViolation ? (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "var(--pastel-red-bg)",
                border: "1px solid var(--pastel-red-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--pastel-red)",
                flexShrink: 0,
              }}
            >
              <ExclamationCircleIcon style={{ width: 22, height: 22 }} />
            </div>
          ) : (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "var(--pastel-lime-bg)",
                border: "1px solid var(--pastel-lime-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--pastel-lime)",
                flexShrink: 0,
              }}
            >
              <CheckBadgeIcon style={{ width: 22, height: 22 }} />
            </div>
          )}

          <div>
            <span
              className={isViolation ? "badge-red" : "badge-lime"}
              style={{ marginBottom: 4 }}
            >
              {isViolation ? t.statusFailed : t.statusPassed}
            </span>
            <p
              style={{
                fontSize: 12,
                color: "var(--forte-text-secondary)",
                marginTop: 4,
                lineHeight: 1.4,
              }}
            >
              {isViolation ? t.descFailed : t.descPassed}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={onReset}
          style={{ fontSize: 11, padding: "5px 10px", flexShrink: 0 }}
          title={t.newAudit}
        >
          <ArrowPathIcon style={{ width: 13, height: 13 }} />
          <span>{t.newAudit}</span>
        </button>
      </div>

      {/* Compliance Score Bar */}
      <div
        style={{
          padding: "12px 14px",
          borderRadius: 8,
          backgroundColor: "var(--forte-surface-2)",
          border: "1px solid var(--forte-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--forte-text-secondary)" }}>
            {t.complianceScore}
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: isViolation ? "var(--forte-brand)" : "var(--pastel-lime)",
            }}
          >
            {complianceScore}%
          </span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "var(--forte-surface)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${complianceScore}%`,
              backgroundColor: isViolation
                ? "var(--forte-brand)"
                : "var(--pastel-lime)",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
        }}
      >
        <div
          style={{
            padding: "8px 10px",
            borderRadius: 6,
            backgroundColor: "var(--forte-surface-subtle)",
            border: "1px solid var(--forte-border)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: violationsCount > 0 ? "var(--pastel-red)" : "var(--forte-text-primary)",
            }}
          >
            {violationsCount}
          </div>
          <div style={{ fontSize: 10, color: "var(--forte-text-muted)", marginTop: 2 }}>
            {t.totalViolations}
          </div>
        </div>

        <div
          style={{
            padding: "8px 10px",
            borderRadius: 6,
            backgroundColor: "var(--forte-surface-subtle)",
            border: "1px solid var(--forte-border)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--forte-text-primary)",
            }}
          >
            {(processingMs / 1000).toFixed(1)}s
          </div>
          <div style={{ fontSize: 10, color: "var(--forte-text-muted)", marginTop: 2 }}>
            {t.duration}
          </div>
        </div>

        <div
          style={{
            padding: "8px 10px",
            borderRadius: 6,
            backgroundColor: "var(--forte-surface-subtle)",
            border: "1px solid var(--forte-border)",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "monospace",
              color: "var(--forte-brand)",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {result.job_id}
          </div>
          <div style={{ fontSize: 10, color: "var(--forte-text-muted)", marginTop: 2 }}>
            {t.jobId}
          </div>
        </div>
      </div>
    </div>
  );
}
