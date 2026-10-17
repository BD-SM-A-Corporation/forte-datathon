'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, FileVideo, UploadCloud, X, AlertCircle, LockKeyhole } from 'lucide-react';
import { formatFileSize } from '@/lib/api';

export function DropZone({ onStartAnalysis, isLoading }: { onStartAnalysis: (file: File | null) => void; isLoading: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const select = (next: File) => {
    setError(null);
    if (!next.name.toLowerCase().endsWith('.mov')) { setError('Поддерживается формат .mov. Выберите другую запись.'); return; }
    if (!next.size || next.size > 512 * 1024 * 1024) { setError('Выберите непустую запись размером до 512 МБ.'); return; }
    setFile(next);
    setPreview(URL.createObjectURL(next));
  };
  return <section className="work-panel upload-panel">
    <div className="panel-heading"><div><span className="eyebrow">НОВАЯ ПРОВЕРКА</span><h2>Загрузите видеозапись</h2></div><span className="subtle-badge">.MOV</span></div>
    <p className="panel-description">Добавьте запись кассовой зоны, чтобы найти события, требующие внимания.</p>
    <input ref={input} type="file" accept=".mov,video/quicktime" className="sr-only" tabIndex={-1} onChange={e => { if (e.target.files?.[0]) select(e.target.files[0]); e.target.value = ''; }} />
    <button type="button" disabled={isLoading} onClick={() => input.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) select(e.dataTransfer.files[0]); }} className={`upload-target ${dragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`}>
      {file && preview ? <video src={preview} muted playsInline preload="metadata" className="upload-preview" /> : <><span className="upload-orbit orbit-one" /><span className="upload-orbit orbit-two" /></>}
      <span className="upload-target-content"><span className="upload-icon">{file ? <Check size={26} /> : <UploadCloud size={28} />}</span><strong>{file ? 'Видеозапись готова к проверке' : 'Перетащите видео в эту область'}</strong><span>{file ? 'Нажмите, чтобы выбрать другой файл' : 'или нажмите, чтобы выбрать файл на компьютере'}</span>{!file && <span className="upload-format">MOV <i /> до 512 МБ <i /> одна запись</span>}</span>
    </button>
    {file ? <div className="selected-file animate-fadeIn"><span className="file-symbol"><FileVideo size={20} /></span><div><strong>{file.name}</strong><span>{formatFileSize(file.size)} · QuickTime video</span></div><button aria-label="Убрать файл" onClick={() => { setFile(null); setPreview(null); }}><X size={16} /></button></div> : <div className="file-requirements"><FileVideo size={15} /><span>Для лучшего результата используйте исходную запись камеры</span></div>}
    {error && <p role="alert" className="upload-error"><AlertCircle size={16} />{error}</p>}
    <div className="upload-actions"><span><LockKeyhole size={14} />Без передачи в облачный AI</span><button className="primary-button" disabled={!file || isLoading} onClick={() => onStartAnalysis(file)}>Начать проверку<ArrowRight size={16} /></button></div>
  </section>;
}
