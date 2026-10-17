"use client";

import { useEffect, useRef, useState } from "react";
import type { Violation } from "@/types";

interface VideoPlayerProps {
  src: string | null;
  violations: Violation[];
  onTimeUpdate?: (currentTime: number) => void;
  seekTo?: number | null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const SPEEDS = [0.25, 0.5, 1, 1.5, 2];

export default function VideoPlayer({ src, violations, onTimeUpdate, seekTo }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [tooltipMarker, setTooltipMarker] = useState<Violation | null>(null);
  const [tooltipX, setTooltipX] = useState(0);

  // Seek from outside
  useEffect(() => {
    if (seekTo !== null && seekTo !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekTo;
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }, [seekTo]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;
    v.src = src;
    v.load();
    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);
  }, [src]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, [speed]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    onTimeUpdate?.(v.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const tl = timelineRef.current;
    const v = videoRef.current;
    if (!tl || !v || !duration) return;
    const rect = tl.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * duration;
  };

  const skip = (delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(duration, v.currentTime + delta));
  };

  const stepFrame = (dir: 1 | -1) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(duration, v.currentTime + dir * (1 / 30)));
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Video */}
      <div className="video-wrapper aspect-video" style={{ background: "#000", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
        {src ? (
          <>
            <video
              ref={videoRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setPlaying(false)}
              className="w-full h-full object-contain"
              playsInline
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ minHeight: 200 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
              <polygon points="9,8 17,12 9,16" fill="rgba(255,255,255,0.15)"/>
            </svg>
            <span style={{ color: "#52525b", fontSize: 14 }}>Загрузите видео для просмотра</span>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-2">
        {/* Violations timeline bar */}
        <div
          ref={timelineRef}
          className="relative cursor-pointer"
          style={{ height: 32 }}
          onClick={handleTimelineClick}
          onMouseLeave={() => setTooltipMarker(null)}
        >
          {/* Track */}
          <div style={{
            position: "absolute", top: "50%", transform: "translateY(-50%)",
            left: 0, right: 0, height: 4,
            background: "rgba(255,255,255,0.08)", borderRadius: 2
          }} />
          {/* Progress fill */}
          <div style={{
            position: "absolute", top: "50%", transform: "translateY(-50%)",
            left: 0, width: `${progress}%`, height: 4,
            background: "linear-gradient(90deg, #a41034, #e53e6b)",
            borderRadius: 2, transition: "width 0.1s"
          }} />
          {/* Playhead */}
          <div style={{
            position: "absolute", top: "50%",
            left: `${progress}%`, transform: "translate(-50%, -50%)",
            width: 12, height: 12, borderRadius: "50%",
            background: "#e53e6b",
            boxShadow: "0 0 6px rgba(229,62,107,0.6)",
            transition: "left 0.1s",
            pointerEvents: "none"
          }} />
          {/* Violation markers */}
          {duration > 0 && violations.map((v, i) => {
            const pct = (v.timecode_sec / duration) * 100;
            return (
              <div
                key={i}
                className="timeline-marker tooltip"
                style={{ left: `${pct}%` }}
                onMouseEnter={(e) => {
                  setTooltipMarker(v);
                  setTooltipX(e.clientX);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    videoRef.current.currentTime = v.timecode_sec;
                    videoRef.current.play().catch(() => {});
                    setPlaying(true);
                  }
                }}
              >
                {/* Red triangle above */}
                <div style={{
                  position: "absolute", bottom: "100%",
                  left: "50%", transform: "translateX(-50%)",
                  width: 0, height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderBottom: "7px solid #a41034",
                  marginBottom: 2
                }} />
              </div>
            );
          })}
        </div>

        {/* Tooltip for violation marker */}
        {tooltipMarker && (
          <div style={{
            background: "#1c1c21",
            border: "1px solid rgba(164,16,52,0.4)",
            borderRadius: 8, padding: "8px 12px",
            fontSize: 12, color: "#f4f4f5",
            maxWidth: 260
          }}>
            <div style={{ color: "#f87171", fontWeight: 600, marginBottom: 2 }}>
              ⚠ {tooltipMarker.type}
            </div>
            <div style={{ color: "#a1a1aa" }}>
              Таймкод: {formatTime(tooltipMarker.timecode_sec)}
            </div>
          </div>
        )}

        {/* Time display */}
        <div className="flex items-center justify-between" style={{ color: "#71717a", fontSize: 12 }}>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatTime(currentTime)}</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Left: play controls */}
        <div className="flex items-center gap-1">
          {/* -1 frame */}
          <button className="btn-ghost" style={{ padding: "6px 10px" }} onClick={() => stepFrame(-1)} title="−1 кадр" disabled={!src}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 5v14M17 5L7 12l10 7V5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {/* -5s */}
          <button className="btn-ghost" style={{ padding: "6px 10px", fontSize: 11 }} onClick={() => skip(-5)} disabled={!src}>−5s</button>
          {/* Play/Pause */}
          <button
            className="btn-primary"
            style={{ padding: "8px 16px", borderRadius: 8, minWidth: 44 }}
            onClick={togglePlay}
            disabled={!src}
          >
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            )}
          </button>
          {/* +5s */}
          <button className="btn-ghost" style={{ padding: "6px 10px", fontSize: 11 }} onClick={() => skip(5)} disabled={!src}>+5s</button>
          {/* +1 frame */}
          <button className="btn-ghost" style={{ padding: "6px 10px" }} onClick={() => stepFrame(1)} title="+1 кадр" disabled={!src}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 5v14M7 5l10 7-10 7V5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Right: speed */}
        <div className="flex items-center gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                padding: "4px 8px", fontSize: 11, borderRadius: 6,
                background: speed === s ? "rgba(164,16,52,0.25)" : "transparent",
                border: speed === s ? "1px solid rgba(164,16,52,0.5)" : "1px solid transparent",
                color: speed === s ? "#f87171" : "#71717a",
                cursor: "pointer", transition: "all 0.15s",
                fontFamily: "var(--font-geist-mono)"
              }}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
