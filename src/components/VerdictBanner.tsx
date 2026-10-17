'use client';

import { ArrowDownToLine, ArrowUpRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Verdict } from '@/lib/types';

export function VerdictBanner({ verdict, violationsCount, filename, onDownloadJson, onReset }: { verdict: Verdict; violationsCount: number; filename: string; onDownloadJson: () => void; onReset: () => void }) {
  const flagged = verdict === 'violation';
  return <section className={`result-summary ${flagged ? 'flagged' : 'clear'}`}>
    <span className="result-summary-icon">{flagged ? <ShieldAlert size={25} /> : <ShieldCheck size={25} />}</span>
    <div className="result-summary-body"><span className="eyebrow">АНАЛИЗ ЗАВЕРШЁН · {flagged ? 'ТРЕБУЕТ ВНИМАНИЯ' : 'РЕЗУЛЬТАТ ГОТОВ'}</span><h2>{flagged ? 'Обнаружены признаки возможных нарушений' : 'Нарушение не обнаружено'}</h2><p>{flagged ? `Событий для проверки: ${violationsCount}. Изучите фрагменты и кадры-доказательства.` : 'В рамках настроенных правил. Результат предназначен для проверки человеком.'}</p><span className="result-filename">{filename}</span></div>
    <div className="result-summary-actions"><button className="secondary-button" onClick={onDownloadJson}><ArrowDownToLine size={14} />Скачать JSON</button><button className="result-new-button" onClick={onReset}>Другая запись <ArrowUpRight size={14} /></button></div>
  </section>;
}
