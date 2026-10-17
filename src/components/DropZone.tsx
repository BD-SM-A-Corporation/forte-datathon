"use client";

import { useCallback, useState } from "react";

interface DropZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

const ACCEPT = ".mov,video/quicktime,video/mp4";

export default function DropZone({ onFile, disabled }: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [disabled, onFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  };

  return (
    <label
      className={`drop-zone${dragOver ? " drag-over" : ""}${disabled ? " opacity-50 pointer-events-none" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        gap: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        minHeight: 200,
      }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
      />

      {/* Upload icon */}
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: dragOver ? "rgba(164,16,52,0.15)" : "rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid",
        borderColor: dragOver ? "rgba(164,16,52,0.5)" : "rgba(255,255,255,0.1)",
        transition: "all 0.3s"
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 16V8M12 8L9 11M12 8L15 11"
            stroke={dragOver ? "#f87171" : "#71717a"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 15v2a4 4 0 004 4h10a4 4 0 004-4v-2"
            stroke={dragOver ? "#f87171" : "#71717a"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="text-center">
        <p style={{ fontSize: 15, fontWeight: 600, color: dragOver ? "#f87171" : "#d4d4d8", marginBottom: 6 }}>
          {dragOver ? "Отпустите файл" : "Перетащите видео сюда"}
        </p>
        <p style={{ fontSize: 13, color: "#71717a" }}>
          или <span style={{ color: "#f87171", textDecoration: "underline" }}>выберите файл</span>
        </p>
        <p style={{ fontSize: 12, color: "#52525b", marginTop: 8 }}>
          Поддерживается .mov · до ~50 МБ
        </p>
      </div>
    </label>
  );
}
