"use client";

import type { ChecklistItem } from "@/types";

const BASE_CHECKLIST: Omit<ChecklistItem, "ok" | "timecode_sec">[] = [
  { id: "cash-supervised", label: "Денежные средства под контролем кассира" },
  { id: "desk-clear", label: "Кассовый стол свободен от посторонних предметов" },
  { id: "no-strangers", label: "Посторонние лица отсутствуют в кассовой зоне" },
  { id: "safe-closed", label: "Сейф / кассовый ящик закрыт при отходе" },
  { id: "inkasso-protocol", label: "Соблюдён протокол инкассации" },
  { id: "counting-visible", label: "Пересчёт наличности в поле зрения камеры" },
  { id: "no-phone", label: "Мобильное устройство не используется при операции" },
  { id: "id-checked", label: "Проверка документов клиента / инкассатора" },
];

interface ComplianceChecklistProps {
  violations: { type: string; timecode_sec: number }[];
  onSeek: (t: number) => void;
}

// Heuristic mapping: if violation type matches keyword → fail that item
function buildChecklist(violations: { type: string; timecode_sec: number }[]): ChecklistItem[] {
  const types = violations.map((v) => v.type.toLowerCase());
  return BASE_CHECKLIST.map((item) => {
    let ok = true;
    let timecode: number | undefined;
    if (item.id === "cash-supervised" && types.some((t) => t.includes("присмотр") || t.includes("оставл"))) {
      ok = false;
      timecode = violations.find((v) => v.type.toLowerCase().includes("присмотр") || v.type.toLowerCase().includes("оставл"))?.timecode_sec;
    }
    if (item.id === "no-strangers" && types.some((t) => t.includes("посторон"))) {
      ok = false;
      timecode = violations.find((v) => v.type.toLowerCase().includes("посторон"))?.timecode_sec;
    }
    if (item.id === "inkasso-protocol" && types.some((t) => t.includes("инкасс"))) {
      ok = false;
      timecode = violations.find((v) => v.type.toLowerCase().includes("инкасс"))?.timecode_sec;
    }
    if (item.id === "no-phone" && types.some((t) => t.includes("телефон") || t.includes("устройств"))) {
      ok = false;
      timecode = violations.find((v) => v.type.toLowerCase().includes("телефон"))?.timecode_sec;
    }
    return { ...item, ok, timecode_sec: timecode };
  });
}

export default function ComplianceChecklist({ violations, onSeek }: ComplianceChecklistProps) {
  const items = buildChecklist(violations);
  const passCount = items.filter((i) => i.ok).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 4 }}>
        <div style={{
          flex: 1, padding: "10px 14px", borderRadius: 8,
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.2)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#34d399" }}>{passCount}</div>
          <div style={{ fontSize: 11, color: "#71717a" }}>Соответствует</div>
        </div>
        <div style={{
          flex: 1, padding: "10px 14px", borderRadius: 8,
          background: "rgba(164,16,52,0.08)",
          border: "1px solid rgba(164,16,52,0.2)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#f87171" }}>{items.length - passCount}</div>
          <div style={{ fontSize: 11, color: "#71717a" }}>Нарушений</div>
        </div>
      </div>

      {/* Items */}
      {items.map((item) => (
        <div key={item.id} className={item.ok ? "checklist-ok" : "checklist-fail"}>
          <div style={{
            flexShrink: 0, width: 20, height: 20,
            borderRadius: "50%",
            background: item.ok ? "rgba(16,185,129,0.2)" : "rgba(164,16,52,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {item.ok ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: item.ok ? "#d4d4d8" : "#fca5a5", fontWeight: item.ok ? 400 : 500 }}>
              {item.label}
            </p>
          </div>
          {!item.ok && item.timecode_sec !== undefined && (
            <button
              onClick={() => onSeek(item.timecode_sec!)}
              style={{
                flexShrink: 0, fontSize: 11,
                color: "#f87171", cursor: "pointer",
                background: "rgba(164,16,52,0.15)",
                border: "1px solid rgba(164,16,52,0.3)",
                borderRadius: 4, padding: "2px 8px",
                fontFamily: "var(--font-geist-mono)"
              }}
            >
              {String(Math.floor(item.timecode_sec / 60)).padStart(2, "0")}:{String(Math.floor(item.timecode_sec % 60)).padStart(2, "0")}
            </button>
          )}
        </div>
      ))}

      <p style={{ fontSize: 11, color: "#52525b", marginTop: 4 }}>
        * Чеклист основан на результате анализа видео. Финальная оценка — за аудитором.
      </p>
    </div>
  );
}
