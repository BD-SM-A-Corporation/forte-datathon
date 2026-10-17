'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DropZone } from '@/components/DropZone';
import { ScanPreview } from '@/components/ScanPreview';
import { StageProgress } from '@/components/StageProgress';
import { VerdictBanner } from '@/components/VerdictBanner';
import { Timeline } from '@/components/Timeline';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ViolationCard } from '@/components/ViolationCard';
import { EvidenceGallery } from '@/components/EvidenceGallery';
import { Activity, ArrowDownToLine, ArrowRight, Check, ChevronRight, Clock3, FileVideo, Focus, Layers3, ListChecks, ScanLine, ShieldCheck } from 'lucide-react';
import { JobResponse } from '@/lib/types';
import { uploadVideo, getJobStatus, juryResult } from '@/lib/api';

type ScreenStep = 'upload' | 'processing' | 'result';

export default function CashDisciplineApp() {
  const [currentStep, setCurrentStep] = useState<ScreenStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);

  // Processing state
  const [progress, setProgress] = useState(0);
  const [jobStatus, setJobStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stageName, setStageName] = useState('Загрузка видео');

  // Result state
  const [jobResult, setJobResult] = useState<JobResponse | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTargetTime, setSeekTargetTime] = useState<number | null>(null);
  const [activeViolationId, setActiveViolationId] = useState<number | null>(null);

  const playerSectionRef = useRef<HTMLDivElement>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (videoObjectUrl) {
        URL.revokeObjectURL(videoObjectUrl);
      }
    };
  }, [videoObjectUrl]);

  const runRef = useRef(0);
  useEffect(() => () => { runRef.current += 1; }, []);

  const handleStartAnalysis = async (file: File | null) => {
    if (!file) return;
    const run = ++runRef.current;
    setSelectedFile(file);
    setVideoObjectUrl(URL.createObjectURL(file));
    setErrorMessage(null);
    setProgress(5);
    setCurrentStep('processing');
    setJobStatus('processing');
    setStageName('Загрузка видеозаписи');
    const started = Date.now();
    try {
      const init = await uploadVideo(file);
      if (run !== runRef.current) return;
      setStageName('Локальный анализ. Ожидаем результат сервера');
      setProgress(15);
      while (run === runRef.current) {
        if (Date.now() - started >= 300000) throw new Error('Превышен лимит ожидания 5 минут. Результат недоступен.');
        const job = await getJobStatus(init.job_id);
        if (run !== runRef.current) return;
        if (job.status === 'failed') throw new Error(job.error || 'Ошибка обработки видео');
        if (job.status === 'completed') {
          setProgress(100);
          setJobStatus('completed');
          setJobResult({ ...job, filename: file.name });
          setCurrentStep('result');
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      if (run !== runRef.current) return;
      setJobStatus('failed');
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось выполнить анализ');
    }
  };

  const handleSeek = (seconds: number) => {
    setSeekTargetTime(seconds);
    setCurrentTime(seconds);
    playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleDownloadJson = () => {
    if (!jobResult) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(juryResult(jobResult), null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `forte_compliance_${jobResult.job_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    runRef.current += 1;
    setErrorMessage(null);
    setActiveViolationId(null);
    setSeekTargetTime(null);
    setVideoObjectUrl(null);
    setSelectedFile(null);
    setJobResult(null);
    setProgress(0);
    setJobStatus('pending');
    setCurrentTime(0);
    setDuration(0);
    setCurrentStep('upload');
  };

  const steps = ['Загрузка записи', 'Локальный анализ', 'Проверка результата'];
  const stepIndex = currentStep === 'upload' ? 0 : currentStep === 'processing' ? 1 : 2;

  return (
    <div className="workspace-app">
      <Header />
      <main className="workspace-main">
        <div className="workspace-page-heading animate-fadeIn">
          <div><div className="page-kicker"><span />ВИДЕОАНАЛИТИКА КАССОВЫХ ОПЕРАЦИЙ</div><h1>Центр проверки<span>.</span></h1><p>От видеозаписи к наблюдению. От наблюдения — к обоснованному решению.</p></div>
          <div className="heading-actions"><span className="subtle-badge"><ShieldCheck size={14} />Контроль кассовой дисциплины</span>{currentStep !== 'upload' && <button className="secondary-button" onClick={handleReset}>Новая проверка <ArrowRight size={15} /></button>}</div>
        </div>

        <div className="workflow-bar">{steps.map((step, i) => <div key={step} className={`workflow-item ${i === stepIndex ? 'current' : ''} ${i < stepIndex ? 'complete' : ''}`}><span className="workflow-number">{i < stepIndex ? <Check size={13} /> : `0${i + 1}`}</span><span>{step}</span>{i < 2 && <ChevronRight size={14} className="workflow-chevron" />}</div>)}<span className="workflow-caption"><Clock3 size={13} />До 5 минут на запись</span></div>

        {currentStep === 'upload' && <div className="workspace-entry-grid workspace-enter" key="upload">
          <div className="space-y-5">
            <DropZone onStartAnalysis={handleStartAnalysis} isLoading={jobStatus === 'processing'} />
            <section className="work-panel session-empty"><span className="empty-session-icon"><Layers3 size={20} /></span><div><h3>Всё начинается с одной записи</h3><p>После анализа здесь появятся результат, события и кадры-доказательства.</p></div><span className="subtle-badge">Текущая сессия</span></section>
          </div>
          <aside className="workspace-inspector stagger-children">
            <section className="work-panel"><div className="inspector-heading"><ScanLine size={17} /><h2>Что покажет анализ</h2></div><div className="outcome-list">{[
              { icon: Focus, title: 'События и таймкоды', text: 'Конкретный момент для просмотра вместо поиска по всей записи.' },
              { icon: FileVideo, title: 'Кадры-доказательства', text: 'До трёх кадров на событие для визуальной проверки.' },
              { icon: ListChecks, title: 'Обоснование результата', text: 'Описание видимого действия и связь с настроенным правилом.' },
            ].map(({ icon: Icon, title, text }) => <div key={title}><span><Icon size={18} /></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>
            <section className="work-panel checklist-panel"><div className="inspector-heading"><ListChecks size={17} /><h2>Перед загрузкой</h2></div>{['Кассовая зона видна в кадре', 'Файл в исходном формате MOV', 'Без монтажа и ускорения записи'].map(text => <p key={text}><Check size={14} />{text}</p>)}<div className="inspector-note"><span className="note-dot" /><p>Анализ строго визуальный. Звук и идентификация лиц не используются.</p></div></section>
            <section className="human-review-note"><ShieldCheck size={20} /><div><h3>Решение остаётся за человеком</h3><p>AI отмечает признаки возможных нарушений. Окончательную оценку даёт проверяющий.</p></div></section>
          </aside>
        </div>}

        {currentStep === 'processing' && <div className="workspace-processing-grid workspace-enter" key="processing">
          <section className="work-panel"><div className="panel-heading"><div><span className="eyebrow">{jobStatus === 'failed' ? 'ОБРАБОТКА ПРЕРВАНА' : 'ПРОВЕРКА В ПРОЦЕССЕ'}</span><h2>{jobStatus === 'failed' ? 'Не удалось завершить анализ' : 'Анализируем видеозапись'}</h2></div><span className={`processing-status ${jobStatus === 'failed' ? 'is-error' : ''}`}><Activity size={14} />{jobStatus === 'failed' ? 'Ошибка' : 'В обработке'}</span></div><div className="mt-6"><ScanPreview videoUrl={videoObjectUrl} filename={selectedFile?.name} stageName={stageName} progress={progress} /></div></section>
          <aside className="space-y-5"><section className="work-panel"><div className="inspector-heading"><Activity size={17} /><h2>Статус обработки</h2></div><div className="mt-5"><StageProgress progress={progress} status={jobStatus} error={errorMessage} onRetry={handleReset} /></div></section><section className="work-panel processing-explainer"><div className={`analysis-wave ${jobStatus === 'failed' ? 'is-stopped' : ''}`} aria-hidden="true">{Array.from({ length: 19 }, (_, i) => <span key={i} style={{ animationDelay: `${i * 0.09}s` }} />)}</div><h3>Локальный анализ видео</h3><p>Сервис исследует видимые действия и сопоставляет наблюдения с настроенными правилами. Результат появится автоматически.</p><span>Точный процент готовности сервер не передаёт</span></section></aside>
        </div>}

        {currentStep === 'result' && jobResult && <div className="space-y-5 workspace-enter" key="result">
          <VerdictBanner assessment={jobResult.assessment} violationsCount={jobResult.violations_count} filename={jobResult.filename} onDownloadJson={handleDownloadJson} onReset={handleReset} />
          <div className="result-workspace-grid">
            <div className="space-y-5 min-w-0"><section className="work-panel video-review-panel" ref={playerSectionRef}><div className="panel-heading"><div className="inspector-heading"><FileVideo size={17} /><h2>Просмотр записи</h2></div><span className="subtle-badge">Исходное видео</span></div><div className="mt-5 space-y-4"><VideoPlayer videoUrl={videoObjectUrl} violations={jobResult.violations} currentTime={currentTime} onTimeUpdate={setCurrentTime} onDurationChange={setDuration} seekTime={seekTargetTime} onSeekComplete={() => setSeekTargetTime(null)} /><Timeline key={jobResult.job_id} duration={jobResult.video_duration_sec ?? duration} currentTime={currentTime} violations={jobResult.violations} observations={jobResult.observations} observationsStatus={jobResult.observations_status} onSeek={handleSeek} activeViolationId={activeViolationId} /></div></section>{jobResult.violations.length > 0 && <EvidenceGallery violations={jobResult.violations} jobId={jobResult.job_id} />}</div>
            <aside className="result-events"><div className="events-heading"><div><span className="eyebrow">РЕЗУЛЬТАТ АНАЛИЗА</span><h2>Совпадения <span>{jobResult.violations.length}</span></h2></div><ListChecks size={19} /></div><p className="text-xs text-zinc-500 mb-4">Выберите событие, чтобы перейти к фрагменту</p>{jobResult.violations.length === 0 ? <div className="work-panel clean-result"><ShieldCheck size={30} /><h3>Совпадений с правилами не найдено</h3><p>В рамках настроенных правил. Результат требует проверки человеком.</p></div> : <div className="space-y-3 stagger-children">{jobResult.violations.map((violation, idx) => <ViolationCard key={violation.id || idx} violation={violation} index={idx} isActive={activeViolationId === violation.id} onSeek={handleSeek} onSelect={() => { setActiveViolationId(violation.id || null); handleSeek(violation.timestamp_sec); }} />)}</div>}<button className="secondary-button w-full mt-4 justify-center" onClick={handleDownloadJson}><ArrowDownToLine size={15} />Экспорт результата JSON</button></aside>
          </div>
        </div>}
      </main><Footer />
    </div>
  );
}
