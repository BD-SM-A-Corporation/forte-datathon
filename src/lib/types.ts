export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type Verdict = 'violation' | 'no_violation' | 'pending';

export interface ReviewAssessment {
  status: 'potential_violation' | 'no_supported_match';
  review_required: true;
  decision_status: 'pending_human_review';
}

export interface ViolationResponse {
  id?: number;
  event_type: string;
  title: string;
  description: string;
  timestamp_sec: number;
  end_timestamp_sec?: number | null;
  confidence: number | null;
  confidence_kind: 'self_reported_observation';
  uncertainties: string[];
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
  assessment: ReviewAssessment | null;
  progress: number;
  filename: string;
  error?: string | null;
  created_at: string;
  completed_at?: string | null;
  violations_count: number;
  violations: ViolationResponse[];
  observations: ObservationResponse[];
  observations_status: 'available' | 'unavailable';
  video_duration_sec: number | null;
}

export interface ObservationResponse {
  event_type: string;
  start_sec: number;
  end_sec: number;
  description: string;
  confidence: number | null;
  evidence_timestamps: number[];
  facts: Record<string, number[]>;
  uncertainties: string[];
  matched_rules: string[];
}

export interface RuleItem {
  id: string;
  name: string;
  kind: 'potential_violation' | 'context';
  applicability: string;
  explanation_template: string;
  source: {
    document: string;
    section: string;
    url: string;
    excerpt: string;
    verified_on: string;
  };
}

export interface RuleCatalogue {
  configured: boolean;
  review_required: true;
  rules: RuleItem[];
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
