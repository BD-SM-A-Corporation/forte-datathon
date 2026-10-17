'use client';

import React, { useRef } from 'react';
import { ViolationResponse } from '@/lib/types';
import { formatTimestamp } from '@/lib/api';
import { AlertCircle, Clock } from 'lucide-react';

interface TimelineProps {
  duration: number; // in seconds
  currentTime: number; // in seconds
  violations: ViolationResponse[];
  onSeek: (seconds: number) => void;
  activeViolationId?: number | null;
}

export function Timeline({
  duration,
  currentTime,
  violations,
  onSeek,
  activeViolationId,
}: TimelineProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const totalDuration = duration > 0 ? duration : 60; // fallback duration if not loaded

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(fraction * totalDuration);
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  return (
    <div className="w-full rounded-xl border border-white/[0.08] bg-black/40 p-4 space-y-3 backdrop-blur-md">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#f43f5e]" />
          <span className="font-semibold text-white">Таймлайн записи</span>
          <span className="text-[11px] text-zinc-400">({violations.length} событий на шкале)</span>
        </div>
        <div className="font-mono text-xs text-zinc-300">
          <span className="text-white font-bold">{formatTimestamp(currentTime)}</span> / {formatTimestamp(totalDuration)}
        </div>
      </div>

      {/* Main Track Bar */}
      <div
        ref={barRef}
        onClick={handleBarClick}
        className="relative h-6 w-full cursor-pointer select-none rounded-lg bg-zinc-800/80 hover:bg-zinc-800 transition-colors"
      >
        {/* Playback progress bar */}
        <div
          className="absolute inset-y-0 left-0 rounded-l-lg bg-white/15 pointer-events-none transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Current Playhead cursor */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none z-30 transition-all duration-100"
          style={{ left: `${progressPercent}%` }}
        >
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-white ring-2 ring-[#c21350] shadow" />
        </div>

        {/* Violation Event Markers on the timeline */}
        {violations.map((violation, idx) => {
          const markerPercent = Math.min(100, Math.max(0, (violation.timestamp_sec / totalDuration) * 100));
          const isActive = activeViolationId === violation.id ||
            (currentTime >= violation.timestamp_sec && (!violation.end_timestamp_sec || currentTime <= violation.end_timestamp_sec));

          // Calculate duration width if end_timestamp_sec is present
          let rangeWidth = 0;
          if (violation.end_timestamp_sec && violation.end_timestamp_sec > violation.timestamp_sec) {
            rangeWidth = ((violation.end_timestamp_sec - violation.timestamp_sec) / totalDuration) * 100;
          }

          return (
            <React.Fragment key={violation.id || idx}>
              {/* Highlight range zone on the bar */}
              {rangeWidth > 0 && (
                <div
                  className={`absolute inset-y-0 pointer-events-none rounded transition-opacity ${
                    isActive ? 'bg-[#a11042]/50' : 'bg-[#a11042]/25'
                  }`}
                  style={{
                    left: `${markerPercent}%`,
                    width: `${Math.min(100 - markerPercent, rangeWidth)}%`,
                  }}
                />
              )}

              {/* Pin marker button with tooltip */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSeek(violation.timestamp_sec);
                }}
                className={`group absolute -top-1.5 z-20 -translate-x-1/2 flex flex-col items-center transition-transform hover:scale-125 focus:outline-none`}
                style={{ left: `${markerPercent}%` }}
                title={`${violation.title} (${formatTimestamp(violation.timestamp_sec)})`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all shadow-lg ${
                    isActive
                      ? 'border-white bg-[#c21350] text-white scale-110 ring-4 ring-[#a11042]/40'
                      : 'border-[#f43f5e] bg-[#a11042] text-white'
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                </div>

                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute bottom-11 hidden w-48 -translate-x-1/2 flex-col rounded-lg border border-white/10 bg-zinc-950 p-2 text-left text-xs text-white shadow-2xl group-hover:flex z-50">
                  <div className="flex items-center justify-between text-[10px] text-[#f43f5e] font-mono font-semibold">
                    <span>{formatTimestamp(violation.timestamp_sec)}</span>
                    <span>{Math.round(violation.confidence * 100)}% conf</span>
                  </div>
                  <span className="font-semibold line-clamp-1 text-zinc-100">{violation.title}</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Клик для перехода</span>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#a11042]" />
          Маркер нарушения (кликните для перемотки)
        </span>
        <span>Клик по шкале перемещает воспроизведение</span>
      </div>
    </div>
  );
}
