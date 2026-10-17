"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowPathIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  FilmIcon,
} from "@heroicons/react/24/outline";
import Header from "@/components/Header";
import DropZone from "@/components/DropZone";
import VideoPlayer from "@/components/VideoPlayer";
import { translations } from "@/lib/translations";
import { workspaceTranslations } from "@/lib/workspace-translations";
import { useLanguage } from "@/lib/use-language";
import styles from "./page.module.css";

export default function Home() {
  const [lang, setLang] = useLanguage();
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  const t = translations[lang];
  const copy = workspaceTranslations[lang];

  useEffect(() => () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  const clearVideo = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setVideoSrc(null);
    setFileName(null);
  };

  const resetAll = () => {
    clearVideo();
    setLoadFailed(false);
  };

  const selectVideo = (file: File) => {
    clearVideo();
    setLoadFailed(false);
    try {
      objectUrlRef.current = URL.createObjectURL(file);
      setVideoSrc(objectUrlRef.current);
      setFileName(file.name);
    } catch {
      setLoadFailed(true);
    }
  };

  return (
    <div className={styles.page}>
      <Header currentLang={lang} onLanguageChange={setLang} onGoHome={resetAll} />

      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>{t.brandTagline}</h1>
          <p>{copy.subtitle}</p>
        </div>

        <div className={styles.workspace}>
          <section className={styles.column} aria-labelledby="upload-title">
            <div className={styles.sectionHeading}>
              <div className={styles.headingLabel}>
                <span className={styles.step} aria-hidden="true">1</span>
                <h2 id="upload-title">{copy.uploadTitle}</h2>
              </div>
              <span className={styles.hint}>{copy.singleVideo}</span>
            </div>

            {videoSrc ? (
              <>
                <div className={styles.fileBar}>
                  <FilmIcon width={16} height={16} aria-hidden="true" />
                  <span title={fileName ?? undefined}>{fileName}</span>
                  <button type="button" className="btn-secondary" onClick={resetAll}>
                    {copy.replaceVideo}
                  </button>
                </div>
                <VideoPlayer key={videoSrc} src={videoSrc} violations={[]} lang={lang} />
              </>
            ) : (
              <DropZone onFile={selectVideo} lang={lang} />
            )}
          </section>

          <section className={styles.column} aria-labelledby="analysis-title">
            <div className={styles.sectionHeading}>
              <div className={styles.headingLabel}>
                <span className={styles.step} aria-hidden="true">2</span>
                <h2 id="analysis-title">{copy.analysisTitle}</h2>
              </div>
              <span className={styles.hint} role="status">
                {loadFailed ? copy.failed : videoSrc ? copy.videoSelected : copy.waiting}
              </span>
            </div>

            {loadFailed ? (
              <div className={`card-corporate ${styles.emptyState}`} role="alert">
                <ExclamationTriangleIcon width={32} height={32} aria-hidden="true" />
                <h3>{copy.failedTitle}</h3>
                <p>{copy.failedDescription}</p>
                <button type="button" className="btn-primary" onClick={resetAll}>
                  <ArrowPathIcon width={16} height={16} aria-hidden="true" />
                  {t.resetAnalysis}
                </button>
              </div>
            ) : (
              <div className={`card-corporate ${styles.emptyState}`}>
                <div className={styles.emptyIcon}>
                  <DocumentMagnifyingGlassIcon width={32} height={32} aria-hidden="true" />
                </div>
                <h3>{videoSrc ? copy.unavailableTitle : copy.emptyTitle}</h3>
                <p>{videoSrc ? copy.unavailableDescription : copy.emptyDescription}</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
