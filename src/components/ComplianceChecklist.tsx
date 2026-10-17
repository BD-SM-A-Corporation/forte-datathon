"use client";

import type { ChecklistItem } from "@/types";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface ComplianceChecklistProps {
  violations: { type: string; timecode_sec: number }[];
  onSeek: (t: number) => void;
  lang?: "ru" | "kz" | "en";
}

const CHECKLIST_DEFINITIONS = [
  {
    id: "gesv-scale",
    labelRu: "Указание ГЭСВ в соразмерном масштабе с номинальной ставкой (OCR)",
    labelKz: "ЖТСМ мөлшерін номиналды мөлшерлемемен бірдей масштабта көрсету (OCR)",
    labelEn: "Annual Effective Rate (GESV) displayed at proportional font scale (OCR)",
    keywords: ["гэсв", "шрифт", "размер", "масштаб"],
  },
  {
    id: "ardfm-license",
    labelRu: "Наличие актуального номера банковской лицензии АРРФР",
    labelKz: "ҚҚРА банктік лицензиясының нақты нөмірі мен күнінің болуы",
    labelEn: "Presence of valid ARDFM banking license number and date",
    keywords: ["лицензи", "аррфр", "номер"],
  },
  {
    id: "state-lang-parity",
    labelRu: "Визуальный и смысловой паритет государственного языка (Қазақ тілі)",
    labelKz: "Мемлекеттік тілдің визуалды және мағыналық теңгерімі (паритет)",
    labelEn: "Visual and structural parity of the State language (Kazakh)",
    keywords: ["паритет", "язык", "казах", "тіл"],
  },
  {
    id: "audio-disclaimer",
    labelRu: "Наличие обязательного аудио-дисклеймера в звуковой дорожке (хронометраж >2 сек)",
    labelKz: "Дыбыстық жолда міндетті аудио-ескертудің болуы (>2 сек)",
    labelEn: "Mandatory spoken voiceover disclaimer present in audio track (>2s)",
    keywords: ["аудио", "озвуч", "дисклеймер", "голос"],
  },
  {
    id: "rate-veracity",
    labelRu: "Достоверность финансовых условий и отсутствие скрытых комиссий",
    labelKz: "Қаржылық шарттардың шынайылығы және жасырын төлемдердің болмауы",
    labelEn: "Veracity of advertised loan terms without undisclosed fees",
    keywords: ["комисси", "переплат", "ставка"],
  },
  {
    id: "font-contrast-timing",
    labelRu: "Читаемость сносок: достаточный контраст и хронометраж показа",
    labelKz: "Сілтемелердің оқылуы: фондық контраст және көрсетілу уақыты",
    labelEn: "Fine-print legibility: contrast ratio and screen exposure duration",
    keywords: ["контраст", "читаем", "хронометраж"],
  },
  {
    id: "no-guarantee-risk",
    labelRu: "Отсутствие недостоверных заверений о гарантированной доходности",
    labelKz: "Кепілдендірілген кірістілік туралы жалған уәделердің болмауы",
    labelEn: "Prohibition of false guarantees regarding return on investment",
    keywords: ["доход", "гаранти"],
  },
];

function buildChecklist(
  violations: { type: string; timecode_sec: number }[],
  lang: "ru" | "kz" | "en"
): ChecklistItem[] {
  const types = violations.map((v) => v.type.toLowerCase());

  return CHECKLIST_DEFINITIONS.map((def) => {
    let ok = true;
    let timecode: number | undefined;

    const matchedViolation = violations.find((v) => {
      const vt = v.type.toLowerCase();
      return def.keywords.some((kw) => vt.includes(kw));
    });

    if (matchedViolation) {
      ok = false;
      timecode = matchedViolation.timecode_sec;
    }

    const label =
      lang === "kz" ? def.labelKz : lang === "en" ? def.labelEn : def.labelRu;

    return {
      id: def.id,
      label,
      ok,
      timecode_sec: timecode,
    };
  });
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function ComplianceChecklist({
  violations,
  onSeek,
  lang = "ru",
}: ComplianceChecklistProps) {
  const items = buildChecklist(violations, lang);
  const passCount = items.filter((i) => i.ok).length;
  const failCount = items.length - passCount;
  const compliancePercent = Math.round((passCount / items.length) * 100);

  const t = {
    ru: {
      passed: "Соответствует",
      failed: "Нарушено",
      score: "Индекс соответствия нормативам",
      seek: "К моменту нарушения",
    },
    kz: {
      passed: "Сәйкес келеді",
      failed: "Бұзылған",
      score: "Нормативтерге сәйкестік индексі",
      seek: "Бұзушылық сәтіне өту",
    },
    en: {
      passed: "Passed",
      failed: "Violations",
      score: "Regulatory Compliance Index",
      seek: "Seek to moment",
    },
  }[lang];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Top metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {/* Score */}
        <div
          className="card-corporate"
          style={{
            padding: "12px 14px",
            textAlign: "center",
            background: "var(--forte-surface)",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: failCount === 0 ? "var(--pastel-lime)" : "var(--forte-brand)",
            }}
          >
            {compliancePercent}%
          </div>
          <div style={{ fontSize: 11, color: "var(--forte-text-muted)", marginTop: 2 }}>
            {t.score}
          </div>
        </div>

        {/* Passed count */}
        <div
          className="card-corporate"
          style={{
            padding: "12px 14px",
            textAlign: "center",
            background: "var(--pastel-lime-bg)",
            borderColor: "var(--pastel-lime-border)",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--pastel-lime-text)",
            }}
          >
            {passCount}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--pastel-lime-text)",
              marginTop: 2,
            }}
          >
            {t.passed}
          </div>
        </div>

        {/* Failed count */}
        <div
          className="card-corporate"
          style={{
            padding: "12px 14px",
            textAlign: "center",
            background: failCount > 0 ? "var(--pastel-red-bg)" : "var(--forte-surface-2)",
            borderColor: failCount > 0 ? "var(--pastel-red-border)" : "var(--forte-border)",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: failCount > 0 ? "var(--pastel-red-text)" : "var(--forte-text-muted)",
            }}
          >
            {failCount}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: failCount > 0 ? "var(--pastel-red-text)" : "var(--forte-text-muted)",
              marginTop: 2,
            }}
          >
            {t.failed}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => (
          <div
            key={item.id}
            className="card-corporate"
            style={{
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: item.ok ? "var(--forte-surface)" : "var(--pastel-red-bg)",
              borderColor: item.ok ? "var(--forte-border)" : "var(--pastel-red-border)",
            }}
          >
            {item.ok ? (
              <CheckCircleIcon
                style={{
                  width: 20,
                  height: 20,
                  color: "var(--pastel-lime)",
                  flexShrink: 0,
                }}
              />
            ) : (
              <XCircleIcon
                style={{
                  width: 20,
                  height: 20,
                  color: "var(--pastel-red)",
                  flexShrink: 0,
                }}
              />
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: item.ok
                    ? "var(--forte-text-primary)"
                    : "var(--pastel-red-text)",
                  lineHeight: 1.45,
                  display: "block",
                }}
              >
                {item.label}
              </span>
            </div>

            {/* Timecode jump if failed */}
            {!item.ok && item.timecode_sec !== undefined && (
              <button
                type="button"
                className="badge-red"
                style={{ cursor: "pointer", flexShrink: 0 }}
                onClick={() => onSeek(item.timecode_sec!)}
                title={t.seek}
              >
                <ClockIcon style={{ width: 12, height: 12 }} />
                {formatTime(item.timecode_sec)}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
