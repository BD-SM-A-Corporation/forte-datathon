"use client";

import { useEffect, useRef, useState } from "react";
import { DocumentMagnifyingGlassIcon, FilmIcon } from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import DropZone from "@/components/DropZone";
import { StageProgress } from "@/components/StageProgress";
import { VerdictBanner } from "@/components/VerdictBanner";
import { Timeline } from "@/components/Timeline";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ViolationCard } from "@/components/ViolationCard";
import { EvidenceGallery } from "@/components/EvidenceGallery";
import { JobResponse } from "@/lib/types";
import { uploadVideo, getJobStatus, juryResult } from "@/lib/api";
import { translations } from "@/lib/translations";
import { workspaceTranslations } from "@/lib/workspace-translations";
import { useLanguage } from "@/lib/use-language";
import styles from "./page.module.css";

type ScreenStep = "upload" | "processing" | "result";

export default function CashDisciplineApp() {
  const [lang, setLang] = useLanguage();
  const t = translations[lang];
  const copy = workspaceTranslations[lang];
  const [currentStep, setCurrentStep] = useState<ScreenStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);

  // Processing state
  const [progress, setProgress] = useState(0);
  const [jobStatus, setJobStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    setErrorMessage(null);
    setProgress(5);
    setCurrentStep('processing');
    setJobStatus('processing');

    const started = Date.now();
    try {
      const init = await uploadVideo(file);
      if (run !== runRef.current) return;
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

  const selectVideo = (file: File) => {
    handleReset();
    setSelectedFile(file);
    setVideoObjectUrl(URL.createObjectURL(file));
  };

  const labels = {
    ru: { start: "Начать анализ", ready: "Видео готово к анализу", readyDescription: "Запустите проверку: здесь появятся события, наблюдения модели и кадры-доказательства.", processing: "Анализируем запись", complete: "Анализ завершён", events: "События для проверки", empty: "Совпадений с правилами не найдено", timeout: "Обычно анализ занимает до 5 минут. Точный процент готовности сервер не передаёт." },
    kz: { start: "Талдауды бастау", ready: "Бейне талдауға дайын", readyDescription: "Тексеруді бастаңыз: оқиғалар, модель бақылаулары және дәлел кадрлары осында көрсетіледі.", processing: "Бейне талдануда", complete: "Талдау аяқталды", events: "Тексерілетін оқиғалар", empty: "Ережелермен сәйкестік табылмады", timeout: "Талдау әдетте 5 минутқа дейін созылады. Сервер дайындықтың нақты пайызын бермейді." },
    en: { start: "Start analysis", ready: "Video ready for analysis", readyDescription: "Start the review to see events, model observations and evidence frames here.", processing: "Analyzing recording", complete: "Analysis complete", events: "Events for review", empty: "No rule matches found", timeout: "Analysis usually takes up to 5 minutes. The server does not report exact progress." },
  }[lang];

  return (
    <div className={styles.page}>
      <Header currentLang={lang} onLanguageChange={setLang} onGoHome={handleReset} />
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>{t.brandTagline}</h1>
          <p>{copy.subtitle}</p>
        </div>
        <div className={styles.workspace}>
          <section className={styles.column} aria-labelledby="upload-title" ref={playerSectionRef}>
            <div className={styles.sectionHeading}>
              <div className={styles.headingLabel}><span className={styles.step}>1</span><h2 id="upload-title">{copy.uploadTitle}</h2></div>
              <span className={styles.hint}>{copy.singleVideo}</span>
            </div>
            {videoObjectUrl ? <>
              <div className={styles.fileBar}>
                <FilmIcon width={16} height={16} aria-hidden="true" />
                <span title={selectedFile?.name}>{selectedFile?.name}</span>
                <button className="btn-secondary" onClick={handleReset}>{copy.replaceVideo}</button>
              </div>
              <VideoPlayer key={videoObjectUrl} videoUrl={videoObjectUrl} violations={jobResult?.violations ?? []} currentTime={currentTime} onTimeUpdate={setCurrentTime} onDurationChange={setDuration} seekTime={seekTargetTime} onSeekComplete={() => setSeekTargetTime(null)} lang={lang} />
            </> : <DropZone onFile={selectVideo} lang={lang} />}
            {jobResult && <>
              <Timeline key={jobResult.job_id} duration={jobResult.video_duration_sec ?? duration} currentTime={currentTime} violations={jobResult.violations} observations={jobResult.observations} observationsStatus={jobResult.observations_status} onSeek={handleSeek} activeViolationId={activeViolationId} />
              {jobResult.violations.length > 0 && <EvidenceGallery violations={jobResult.violations} jobId={jobResult.job_id} />}
            </>}
          </section>
          <section className={styles.column} aria-labelledby="analysis-title">
            <div className={styles.sectionHeading}>
              <div className={styles.headingLabel}><span className={styles.step}>2</span><h2 id="analysis-title">{copy.analysisTitle}</h2></div>
              <span className={styles.hint} role="status">{jobStatus === "failed" ? copy.failed : currentStep === "result" ? labels.complete : currentStep === "processing" ? labels.processing : selectedFile ? copy.videoSelected : copy.waiting}</span>
            </div>
            {currentStep === "upload" && <div className={`card-corporate ${styles.emptyState}`}>
              <div className={styles.emptyIcon}><DocumentMagnifyingGlassIcon width={32} height={32} /></div>
              <h3>{selectedFile ? labels.ready : copy.emptyTitle}</h3>
              <p>{selectedFile ? labels.readyDescription : copy.emptyDescription}</p>
              {selectedFile && <button className="btn-primary" onClick={() => void handleStartAnalysis(selectedFile)}>{labels.start}</button>}
            </div>}
            {currentStep === "processing" && <div className="card-corporate p-5 space-y-4">
              <h3 className="font-semibold">{jobStatus === "failed" ? copy.failedTitle : labels.processing}</h3>
              <StageProgress progress={progress} status={jobStatus} error={errorMessage} onRetry={handleReset} />
              <p className="text-sm text-zinc-600">{labels.timeout}</p>
            </div>}
            {currentStep === "result" && jobResult && <>
              <VerdictBanner assessment={jobResult.assessment} violationsCount={jobResult.violations_count} filename={jobResult.filename} onDownloadJson={handleDownloadJson} onReset={handleReset} />
              <h3 className="font-semibold">{labels.events} · {jobResult.violations.length}</h3>
              {jobResult.violations.length === 0 ? <div className="card-corporate p-5 text-sm">{labels.empty}</div> : jobResult.violations.map((violation, index) => <ViolationCard key={violation.id ?? index} violation={violation} index={index} isActive={activeViolationId === violation.id} onSeek={handleSeek} onSelect={() => { setActiveViolationId(violation.id ?? null); handleSeek(violation.timestamp_sec); }} />)}
            </>}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
