'use client';

import { useEffect, useState } from 'react';
import { Clock, Loader2, AlertCircle } from 'lucide-react';

export function StageProgress({ status, error, onRetry }: { progress: number; status: 'pending' | 'processing' | 'completed' | 'failed'; error?: string | null; onRetry?: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (status === 'completed' || status === 'failed') return;
    const timer = setInterval(() => setElapsed(value => value + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);
  return <div aria-live="polite" className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
    <div className="flex justify-between text-xs text-zinc-400"><span className="flex items-center gap-2"><Clock size={14} />{Math.floor(elapsed / 60).toString().padStart(2, '0')}:{(elapsed % 60).toString().padStart(2, '0')}</span><span>Лимит ожидания: 5 минут</span></div>
    {status === 'failed' ? <div role="alert" className="space-y-3"><p className="flex gap-2 text-sm text-red-300"><AlertCircle size={18} />{error || 'Анализ не завершён. Вердикт недоступен.'}</p>{onRetry && <button onClick={onRetry} className="rounded-lg bg-rose-800 px-4 py-2 text-sm">Вернуться к загрузке</button>}</div> : <p className="flex items-center gap-2 text-sm"><Loader2 className="animate-spin text-rose-400" size={18} />{status === 'completed' ? 'Анализ завершён' : 'Ожидаем результат локального анализа'}</p>}
  </div>;
}
