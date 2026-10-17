'use client';

import { ArrowUpRight, Clock3, FileText } from 'lucide-react';
import { ViolationResponse } from '@/lib/types';
import { formatTimestamp } from '@/lib/api';
import { confidenceExplanation, formatConfidence } from '@/lib/confidence';

export function ViolationCard({ violation, index, isActive, onSeek, onSelect }: { violation: ViolationResponse; index: number; isActive: boolean; onSeek: (seconds: number) => void; onSelect?: () => void }) {
  const select = () => { if (onSelect) onSelect(); else onSeek(violation.timestamp_sec); };
  return <article className={`event-card ${isActive ? 'is-active' : ''}`}>
    <div className="event-card-top"><span className="event-number">СОБЫТИЕ {String(index + 1).padStart(2, '0')}</span><button onClick={select} className="event-time" aria-label={`Перейти к событию на ${formatTimestamp(violation.timestamp_sec)}`}><Clock3 size={12} />{formatTimestamp(violation.timestamp_sec)}<ArrowUpRight size={12} /></button></div>
    <button className="event-title" onClick={select}>{violation.title}</button>
    <p className="event-description">{violation.description}</p>
    <div className="event-rule"><FileText size={14} /><div><span>Нормативное основание</span>{violation.rule_source ? <><p>{violation.rule_source}{violation.rule_section ? ` · ${violation.rule_section}` : ''}</p>{violation.rule_url && <a href={violation.rule_url} target="_blank" rel="noopener noreferrer">Открыть источник <ArrowUpRight size={11} /></a>}</> : <p className="event-rule-missing">Не предоставлено сервером</p>}</div></div>
    <div className="event-card-bottom"><span><i />Требует проверки</span><span title={confidenceExplanation}>Индекс уверенности: {formatConfidence(violation.confidence)}</span></div>
    <p className="text-xs text-zinc-500 mt-2">{confidenceExplanation}</p>
    {violation.uncertainties.length > 0 && <p className="text-xs text-zinc-500 mt-2">Неопределённости: {violation.uncertainties.join('; ')}</p>}
  </article>;
}
