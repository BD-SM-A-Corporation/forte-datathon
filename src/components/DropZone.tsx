"use client";

import { useCallback, useState } from "react";
import { ArrowUpTrayIcon, FilmIcon } from "@heroicons/react/24/outline";

interface DropZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
  lang?: "ru" | "kz" | "en";
}

const ACCEPT = ".mov,video/quicktime,video/mp4,video/webm";

export default function DropZone({ onFile, disabled, lang = "ru" }: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false);

  const t = {
    ru: {
      dragTitle: "Перетащите рекламный видеоролик сюда",
      orBrowse: "или выберите файл на компьютере",
      formats: "Поддерживаются MP4, MOV, WEBM (до 150 МБ)",
      buttonText: "Выбрать видеофайл",
    },
    kz: {
      dragTitle: "Жарнамалық бейнероликті осында сүйреңіз",
      orBrowse: "немесе компьютерден файлды таңдаңыз",
      formats: "MP4, MOV, WEBM қолдау көрсетіледі (150 МБ дейін)",
      buttonText: "Бейнефайлды таңдау",
    },
    en: {
      dragTitle: "Drag and drop promotional video here",
      orBrowse: "or browse from your computer",
      formats: "Supports MP4, MOV, WEBM (up to 150 MB)",
      buttonText: "Choose Video File",
    },
  }[lang];

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
      className="card-corporate"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        gap: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        minHeight: 220,
        border: dragOver
          ? "2px dashed var(--forte-brand)"
          : "2px dashed var(--forte-border)",
        backgroundColor: dragOver
          ? "var(--forte-surface-2)"
          : "var(--forte-surface)",
        transition: "all 0.15s ease",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
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

      {/* Upload icon container */}
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          backgroundColor: dragOver
            ? "rgba(14, 133, 230, 0.12)"
            : "var(--forte-surface-2)",
          border: "1px solid var(--forte-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: dragOver ? "var(--forte-brand)" : "var(--forte-text-secondary)",
          transition: "all 0.15s ease",
        }}
      >
        <ArrowUpTrayIcon style={{ width: 24, height: 24 }} />
      </div>

      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--forte-text-primary)",
            marginBottom: 4,
          }}
        >
          {t.dragTitle}
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--forte-text-muted)",
          }}
        >
          {t.orBrowse}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <FilmIcon style={{ width: 14, height: 14, color: "var(--forte-text-muted)" }} />
        <span style={{ fontSize: 11, color: "var(--forte-text-muted)" }}>
          {t.formats}
        </span>
      </div>

      <span className="btn-secondary" style={{ marginTop: 4 }}>
        {t.buttonText}
      </span>
    </label>
  );
}
