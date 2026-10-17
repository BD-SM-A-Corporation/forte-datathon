import { JobResponse, RuleItem, AnalyzeInitiateResponse } from './types';

interface WireJob {
  job_id: string;
  status: 'processing' | 'done' | 'failed';
  verdict?: 'violation' | 'no_violation';
  error?: string;
  violations?: { type: string; timecode_sec: number; description: string; evidence_frames: { timestamp_sec: number; image_base64: string }[] }[];
}

// Empty until the server has a reviewed registry. Never invent legal references.
export const DEMO_RULES: RuleItem[] = [];

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/backend/${path}`, { ...init, cache: 'no-store', signal: AbortSignal.timeout(65_000) });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(typeof data?.detail === 'string' ? data.detail : `Ошибка API: ${response.status}`);
  if (!data) throw new Error('API вернул пустой ответ');
  return data;
}

export async function uploadVideo(file: File): Promise<AnalyzeInitiateResponse> {
  const body = new FormData();
  body.append('file', file);
  const result = await request<{ job_id: string }>('analyze', { method: 'POST', body });
  return { ...result, status: 'processing', message: 'Видео принято в обработку' };
}

export async function getJobStatus(jobId: string): Promise<JobResponse> {
  const raw = await request<WireJob>(`jobs/${encodeURIComponent(jobId)}`);
  type Match = { observation: { start_sec: number; end_sec: number; confidence: number }; rule: { name: string; source: { document: string; section: string; url: string } } };
  let matches: Match[] = [];
  if (raw.status === 'done' && raw.violations?.length) {
    try {
      const audit = await request<{ details: { matches?: Match[] } | null }>(`jobs/${encodeURIComponent(jobId)}/details`);
      matches = audit.details?.matches || [];
    } catch { /* The jury result remains usable if optional audit metadata is unavailable. */ }
  }
  const violations = (raw.violations || []).map((v, index) => {
    const match = matches.find(m => m.rule.name === v.type && m.observation.start_sec === v.timecode_sec);
    return ({
    id: index + 1, event_type: v.type, title: v.type, description: v.description,
    timestamp_sec: v.timecode_sec, confidence: match?.observation.confidence || 0,
    end_timestamp_sec: match?.observation.end_sec,
    rule_source: match?.rule.source.document, rule_section: match?.rule.source.section, rule_url: match?.rule.source.url,
    frame_b64: v.evidence_frames[0]?.image_base64,
    evidence_frames: v.evidence_frames,
  }); });
  return {
    job_id: raw.job_id, status: raw.status === 'done' ? 'completed' : raw.status,
    verdict: raw.verdict || 'pending', progress: raw.status === 'done' ? 100 : 15,
    filename: 'Видеозапись', created_at: '', error: raw.error,
    violations_count: violations.length, violations,
  };
}

export async function getRules(): Promise<RuleItem[]> { return []; }

export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function juryResult(job: JobResponse) {
  return {
    job_id: job.job_id, status: job.status === 'completed' ? 'done' : job.status,
    verdict: job.verdict,
    violations: job.violations.map(v => ({ type: v.title, timecode_sec: v.timestamp_sec, description: v.description, evidence_frames: v.evidence_frames || [] })),
  };
}
