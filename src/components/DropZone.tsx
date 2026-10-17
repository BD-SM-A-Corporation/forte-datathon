"use client";

import { useId, useState } from "react";
import { ArrowUpTrayIcon, FilmIcon } from "@heroicons/react/24/outline";

interface DropZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
  lang?: "ru" | "kz" | "en";
}

const ACCEPT = ".mov,.mp4,.webm,video/quicktime,video/mp4,video/webm";
const VIDEO_TYPES = new Set(["video/quicktime", "video/mp4", "video/webm"]);

function isSupportedVideo(file: File) {
  const hasExtension = /\.[^.]+$/.test(file.name);
  const supportedExtension = /\.(mov|mp4|webm)$/i.test(file.name);
  const supportedType = VIDEO_TYPES.has(file.type.toLowerCase());

  if (hasExtension && !supportedExtension) return false;
  if (file.type && !supportedType) return false;
  return supportedExtension || supportedType;
}

export default function DropZone({ onFile, disabled, lang = "ru" }: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [error, setError] = useState<"multiple" | "unsupported" | null>(null);
  const descriptionId = useId();
  const errorId = useId();
  const isDragging = dragOver && !disabled;

  const t = {
    ru: {
      dragTitle: "Перетащите видео кассовой операции сюда",
      orBrowse: "или выберите файл на компьютере",
      formats: "MOV · также можно выбрать MP4 и WEBM",
      buttonText: "Выбрать видеофайл",
      multiple: "Выберите один видеофайл. Несколько файлов одновременно не поддерживаются.",
      unsupported: "Выберите видео в формате MOV, MP4 или WEBM.",
    },
    kz: {
      dragTitle: "Кассалық операция бейнесін осында сүйреңіз",
      orBrowse: "немесе компьютерден файлды таңдаңыз",
      formats: "MOV · MP4 және WEBM файлдарын да таңдауға болады",
      buttonText: "Бейнефайлды таңдау",
      multiple: "Бір бейнефайлды таңдаңыз. Бірнеше файлды қатар жүктеуге болмайды.",
      unsupported: "MOV, MP4 немесе WEBM форматындағы бейнені таңдаңыз.",
    },
    en: {
      dragTitle: "Drag a video of a cash operation here",
      orBrowse: "or browse from your computer",
      formats: "MOV · MP4 and WEBM files can also be selected",
      buttonText: "Choose video file",
      multiple: "Choose one video file. Multiple files cannot be selected at the same time.",
      unsupported: "Choose a video in MOV, MP4 or WEBM format.",
    },
  }[lang];

  const selectFiles = (files: FileList | null) => {
    if (disabled || !files?.length) return;
    if (files.length !== 1) {
      setError("multiple");
      return;
    }
    const file = files[0];
    if (!isSupportedVideo(file)) {
      setError("unsupported");
      return;
    }
    setError(null);
    onFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    selectFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    selectFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <label
      className="card-corporate"
      aria-disabled={disabled || undefined}
      onFocus={() => setFocusWithin(true)}
      onBlur={() => setFocusWithin(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        gap: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        minHeight: 220,
        border: isDragging
          ? "2px dashed var(--forte-brand)"
          : "2px dashed var(--forte-border)",
        backgroundColor: isDragging
          ? "var(--forte-surface-2)"
          : "var(--forte-surface)",
        transition: "all 0.15s ease",
        outline: focusWithin && !disabled ? "2px solid var(--forte-brand)" : undefined,
        outlineOffset: 4,
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (disabled) return;
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={ACCEPT}
        className="sr-only"
        aria-label={t.buttonText}
        aria-describedby={error ? `${descriptionId} ${errorId}` : descriptionId}
        aria-invalid={error ? true : undefined}
        onChange={handleChange}
        disabled={disabled}
      />

      {/* Upload icon container */}
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          backgroundColor: isDragging
            ? "rgba(14, 133, 230, 0.12)"
            : "var(--forte-surface-2)",
          border: "1px solid var(--forte-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isDragging ? "var(--forte-brand)" : "var(--forte-text-secondary)",
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
        <span id={descriptionId} style={{ fontSize: 11, color: "var(--forte-text-muted)", textAlign: "center" }}>
          {t.formats}
        </span>
      </div>

      <span className="btn-secondary" style={{ marginTop: 4 }}>
        {t.buttonText}
      </span>
      {error && (
        <p id={errorId} role="alert" style={{ color: "var(--pastel-red-text)", fontSize: 12, lineHeight: 1.5, textAlign: "center" }}>
          {t[error]}
        </p>
      )}
    </label>
  );
}
