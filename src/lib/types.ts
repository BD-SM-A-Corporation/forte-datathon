export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type Verdict = 'violation' | 'no_violation' | 'pending';

export interface ViolationResponse {
  id?: number;
  event_type: string;
  title: string;
  description: string;
  timestamp_sec: number;
  end_timestamp_sec?: number | null;
  confidence: number;
  frame_url?: string | null;
  frame_b64?: string | null;
  evidence_frames?: { timestamp_sec: number; image_base64: string }[];
  rule_source?: string | null;
  rule_section?: string | null;
  rule_url?: string | null;
}

export interface JobResponse {
  job_id: string;
  status: JobStatus;
  verdict: Verdict;
  progress: number;
  filename: string;
  error?: string | null;
  created_at: string;
  completed_at?: string | null;
  violations_count: number;
  violations: ViolationResponse[];
}

export interface RuleItem {
  event_type: string;
  title: string;
  description: string;
  source: string;
  section: string;
  url: string;
  verified: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AnalyzeInitiateResponse {
  job_id: string;
  status: JobStatus;
  message: string;
}

export type ProcessingStageId = 'upload' | 'decode' | 'detect' | 'classify' | 'evidence';

export interface ProcessingStage {
  id: ProcessingStageId;
  label: string;
  description: string;
  minProgress: number;
  maxProgress: number;
}
