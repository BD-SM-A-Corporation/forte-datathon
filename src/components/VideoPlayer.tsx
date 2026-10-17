'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, AlertTriangle, SkipForward, SkipBack, Maximize2 } from 'lucide-react';
import { ViolationResponse } from '@/lib/types';
import { formatTimestamp } from '@/lib/api';

interface VideoPlayerProps {
  videoUrl?: string | null;
  violations: ViolationResponse[];
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  seekTime?: number | null;
  onSeekComplete?: () => void;
}

export function VideoPlayer({
  videoUrl,
  violations,
  currentTime,
  onTimeUpdate,
  onDurationChange,
  seekTime,
  onSeekComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeViolation, setActiveViolation] = useState<ViolationResponse | null>(null);

  // Handle external seek requests from timeline or cards
  useEffect(() => {
    if (seekTime !== null && seekTime !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekTime;
      onSeekComplete?.();
    }
  }, [seekTime, onSeekComplete]);

  // Sync active violation with current playback time
  useEffect(() => {
    const currentViol = violations.find((v) => {
      const end = v.end_timestamp_sec && v.end_timestamp_sec > v.timestamp_sec
        ? v.end_timestamp_sec
        : v.timestamp_sec + 4.0;
      return currentTime >= v.timestamp_sec && currentTime <= end;
    });
    setActiveViolation(currentViol || null);
  }, [currentTime, violations]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skipSeconds = (delta: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + delta);
  };

  const jumpToNextViolation = () => {
    if (!videoRef.current || violations.length === 0) return;
    const next = violations.find((v) => v.timestamp_sec > currentTime + 0.5);
    if (next) {
      videoRef.current.currentTime = next.timestamp_sec;
    } else {
      videoRef.current.currentTime = violations[0].timestamp_sec;
    }
  };

  const jumpToPrevViolation = () => {
    if (!videoRef.current || violations.length === 0) return;
    const prev = [...violations].reverse().find((v) => v.timestamp_sec < currentTime - 1.0);
    if (prev) {
      videoRef.current.currentTime = prev.timestamp_sec;
    } else {
      videoRef.current.currentTime = violations[violations.length - 1].timestamp_sec;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-white/[0.12] bg-black shadow-2xl group"
    >
      {/* Video Container */}
      <div className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={() => {
              if (videoRef.current) {
                onTimeUpdate(videoRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                onDurationChange(videoRef.current.duration);
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
            muted={isMuted}
          />
        ) : (
          /* Placeholder player with simulated CCTV footage view */
          <div
            onClick={togglePlay}
            className="relative h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-[#12131c] cursor-pointer"
          >
            <div className="text-center space-y-2 p-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#a11042]/20 text-[#f43f5e] border border-[#a11042]/40">
                <Play className="h-7 w-7 ml-1" />
              </div>
              <p className="text-sm font-semibold text-white">Исходная запись недоступна</p>
              <p className="text-xs text-zinc-400 max-w-sm">
                Откройте кадры-доказательства ниже или загрузите запись заново.
              </p>
            </div>
          </div>
        )}

        {/* ACTIVE VIOLATION OVERLAY HUD - Pulses when incident occurs */}
        {activeViolation && (
          <div className="pointer-events-none absolute top-4 inset-x-4 z-30 flex items-center justify-between rounded-xl border border-red-500/60 bg-red-950/85 p-3 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-red-200">
                    АКТИВНОЕ СОБЫТИЕ:
                  </span>
                  <span className="font-mono text-xs text-red-300 font-bold">
                    {formatTimestamp(activeViolation.timestamp_sec)}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{activeViolation.title}</div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] uppercase tracking-wider text-red-300">Уверенность AI</span>
              <span className="font-mono text-xs font-bold text-white">
                {Math.round(activeViolation.confidence * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between border-t border-white/10 bg-zinc-950/90 px-4 py-3 backdrop-blur-md text-zinc-300">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-[#a11042] hover:text-white transition-colors"
            title={isPlaying ? 'Пауза' : 'Воспроизведение'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>

          {/* Jump to Violations */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            <button
              onClick={jumpToPrevViolation}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Предыдущее нарушение"
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={jumpToNextViolation}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Следующее нарушение"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Rewind / Fast Forward 5s */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => skipSeconds(-5)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
              title="-5 секунд"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => skipSeconds(5)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
              title="+5 секунд"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Current time */}
          <span className="font-mono text-xs font-semibold text-white ml-1">
            {formatTimestamp(currentTime)}
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-zinc-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Во весь экран"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
