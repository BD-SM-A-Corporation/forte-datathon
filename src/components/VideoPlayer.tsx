"use client";

import { useEffect, useRef, useState } from "react";
import type { Violation } from "@/types";
import {
  PlayIcon,
  PauseIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  FilmIcon,
} from "@heroicons/react/24/solid";

interface VideoPlayerProps {
  src: string | null;
  violations: Violation[];
  onTimeUpdate?: (currentTime: number) => void;
  seekTo?: number | null;
  lang?: "ru" | "kz" | "en";
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

export default function VideoPlayer({
  src,
  violations,
  onTimeUpdate,
  seekTo,
  lang = "ru",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [hoverMarker, setHoverMarker] = useState<Violation | null>(null);
  const labels = {
    ru: { play: "Воспроизвести", pause: "Приостановить", silent: "Без звука", fullscreen: "На весь экран", unavailable: "Видео не выбрано", unavailableDescription: "Выберите видеофайл, чтобы открыть предпросмотр." },
    kz: { play: "Ойнату", pause: "Кідірту", silent: "Дыбыссыз", fullscreen: "Толық экран", unavailable: "Бейне таңдалмаған", unavailableDescription: "Алдын ала көру үшін бейнефайлды таңдаңыз." },
    en: { play: "Play", pause: "Pause", silent: "Muted", fullscreen: "Fullscreen", unavailable: "No video selected", unavailableDescription: "Select a video file to open the preview." },
  }[lang];

  useEffect(() => {
    if (seekTo !== null && seekTo !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekTo;
      videoRef.current.play().catch(() => {});
    }
  }, [seekTo]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, [speed]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    onTimeUpdate?.(v.currentTime);
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration);
    v.playbackRate = speed;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = timelineRef.current;
    if (!bar || !videoRef.current || duration === 0) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const target = ratio * duration;
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const toggleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      v.requestFullscreen();
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!src) {
    return (
      <div
        className="card-corporate"
        style={{ aspectRatio: "16 / 9", minHeight: 220, padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 12, textAlign: "center", background: "var(--forte-surface-2)" }}
      >
        <FilmIcon aria-hidden="true" style={{ width: 36, height: 36, color: "var(--forte-text-muted)" }} />
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--forte-text-primary)" }}>{labels.unavailable}</p>
        <p style={{ maxWidth: 380, fontSize: 12, lineHeight: 1.6, color: "var(--forte-text-muted)" }}>{labels.unavailableDescription}</p>
      </div>
    );
  }

  return (
    <div
      className="card-corporate"
      style={{
        overflow: "hidden",
        backgroundColor: "#000000",
        position: "relative",
      }}
    >
      {/* Video Element */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
          backgroundColor: "#0A0B0D",
          cursor: "pointer",
        }}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={src || undefined}
          muted
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEmptied={() => {
            setCurrentTime(0);
            setDuration(0);
            setPlaying(false);
          }}
          onEnded={() => setPlaying(false)}
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />

        {/* Center play icon when paused */}
        {!playing && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.35)",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: "var(--forte-brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
              }}
            >
              <PlayIcon style={{ width: 24, height: 24, marginLeft: 2 }} />
            </div>
          </div>
        )}

        {/* Marker Hover Tooltip */}
        {hoverMarker && (
          <div
            style={{
              position: "absolute",
              bottom: 48,
              left: `${Math.min(
                90,
                Math.max(10, (hoverMarker.timecode_sec / (duration || 1)) * 100)
              )}%`,
              transform: "translateX(-50%)",
              backgroundColor: "var(--forte-surface)",
              color: "var(--forte-text-primary)",
              border: "1px solid var(--pastel-red-border)",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 11,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 20,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ color: "var(--pastel-red)", fontWeight: 700 }}>
              {formatTime(hoverMarker.timecode_sec)}
            </span>{" "}
            — {hoverMarker.type}
          </div>
        )}
      </div>

      {/* Corporate Controls Strip */}
      <div
        style={{
          padding: "10px 14px",
          background: "var(--forte-surface)",
          borderTop: "1px solid var(--forte-border)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Timeline Bar */}
        <div
          ref={timelineRef}
          onClick={handleTimelineClick}
          style={{
            position: "relative",
            height: 10,
            borderRadius: 5,
            backgroundColor: "var(--forte-surface-2)",
            border: "1px solid var(--forte-border)",
            cursor: "pointer",
          }}
        >
          {/* Active progress */}
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              borderRadius: 5,
              backgroundColor: "var(--forte-brand)",
              transition: "width 0.1s linear",
            }}
          />

        {/* Timestamps of events marked for human review */}
          {duration > 0 &&
            violations.map((v, i) => {
              const leftPct = (v.timecode_sec / duration) * 100;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoverMarker(v)}
                  onMouseLeave={() => setHoverMarker(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (videoRef.current) {
                      videoRef.current.currentTime = v.timecode_sec;
                      videoRef.current.play().catch(() => {});
                      setPlaying(true);
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: -2,
                    left: `${leftPct}%`,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "var(--pastel-red)",
                    border: "2px solid var(--forte-surface)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                  title={`${v.type} (${formatTime(v.timecode_sec)})`}
                />
              );
            })}
        </div>

        {/* Buttons Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {/* Left: Play/Pause, visual-only preview, Time display */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={togglePlay}
              aria-label={playing ? labels.pause : labels.play}
              style={{ padding: "6px 10px" }}
            >
              {playing ? (
                <PauseIcon style={{ width: 16, height: 16 }} />
              ) : (
                <PlayIcon style={{ width: 16, height: 16 }} />
              )}
            </button>

            <span title={labels.silent} aria-label={labels.silent} role="img" style={{ display: "inline-flex", color: "var(--forte-text-muted)" }}>
              <SpeakerXMarkIcon aria-hidden="true" style={{ width: 16, height: 16 }} />
            </span>

            <div
              style={{
                fontSize: 12,
                fontFamily: "monospace",
                color: "var(--forte-text-secondary)",
                whiteSpace: "nowrap",
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right: Speeds & Fullscreen */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 6px",
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor:
                      speed === s
                        ? "var(--forte-brand)"
                        : "var(--forte-border)",
                    backgroundColor:
                      speed === s
                        ? "var(--forte-brand)"
                        : "var(--forte-surface-2)",
                    color: speed === s ? "#FFFFFF" : "var(--forte-text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={toggleFullscreen}
              style={{ padding: "6px 8px" }}
              title={labels.fullscreen}
            >
              <ArrowsPointingOutIcon style={{ width: 15, height: 15 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
