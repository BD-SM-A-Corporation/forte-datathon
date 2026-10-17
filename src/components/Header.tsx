"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/use-language";
import ForteLogo from "@/components/ForteLogo";
import type { Language } from "@/lib/translations";
import styles from "./Header.module.css";

interface HeaderProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
  onGoHome?: () => void;
}

export function Header({
  currentLang,
  onLanguageChange,
  onGoHome,
}: HeaderProps) {
  const [savedLanguage, setLanguage] = useLanguage();
  currentLang ??= savedLanguage;
  onLanguageChange ??= setLanguage;
  const t = {
    ru: {
      home: "Новый анализ",
      language: "Язык интерфейса",
    },
    kz: {
      home: "Жаңа талдау",
      language: "Интерфейс тілі",
    },
    en: {
      home: "New analysis",
      language: "Interface language",
    },
  }[currentLang];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {onGoHome ? (
          <button
            type="button"
            onClick={onGoHome}
            className={`${styles.brand} ${styles.brandButton}`}
            aria-label={`Forte — ${t.home}`}
          >
            <ForteLogo />
          </button>
        ) : (
          <Link href="/" className={styles.brand} aria-label={`Forte — ${t.home}`}><ForteLogo /></Link>
        )}

        <div className={styles.actions}>
          <Link href="/rules" className={styles.rules}>{currentLang === "ru" ? "Правила и методика" : currentLang === "kz" ? "Ережелер" : "Rules"}</Link>
          <div className={styles.languages} role="group" aria-label={t.language}>
            {(["kz", "ru", "en"] as Language[]).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => onLanguageChange(lng)}
                aria-pressed={currentLang === lng}
                aria-label={lng === "kz" ? "Қазақша" : lng === "ru" ? "Русский" : "English"}
              >
                {lng === "kz" ? "Қаз" : lng === "ru" ? "Рус" : "Eng"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
