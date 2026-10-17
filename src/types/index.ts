// Shared types for the ForteBank AI Inspector

export type ProcessingStatus = "idle" | "uploading" | "processing" | "done" | "failed";

export interface EvidenceFrame {
  timestamp_sec: number;
  image_base64: string; // JPEG base64
}

export interface Violation {
  type: string;
  timecode_sec: number;
  description: string;
  evidence_frames: EvidenceFrame[];
  // Normative reference – returned by our backend or enriched on frontend
  regulation?: string;
  regulation_article?: string;
  regulation_url?: string;
}

export interface AnalysisResult {
  job_id: string;
  status: "processing" | "done" | "failed";
  verdict: "no_violation" | "violation";
  violations: Violation[];
  processing_time_ms?: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  ok: boolean;
  timecode_sec?: number;
}

// Demo preset
export interface DemoCase {
  id: string;
  label: string;
  description: string;
  result: AnalysisResult;
}
