"use client";

import { useEffect, useState } from "react";
import ForteLogo from "@/components/ForteLogo";
import type { Language } from "@/lib/translations";
import {
  SunIcon,
  MoonIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenPresets: () => void;
  onGoHome?: () => void;
}

export default function Header({
  currentLang,
  onLanguageChange,
  onOpenPresets,
  onGoHome,
}: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check initial preference from localStorage or html attribute
    const stored = localStorage.getItem("forte-theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("forte-theme", nextTheme);
  };

  const t = {
    ru: {
      presets: "Типовые сценарии",
      themeLight: "Светлая",
      themeDark: "Тёмная",
    },
    kz: {
      presets: "Үлгілік сценарийлер",
      themeLight: "Ашық",
      themeDark: "Күңгірт",
    },
    en: {
      presets: "Audit Scenarios",
      themeLight: "Light",
      themeDark: "Dark",
    },
  }[currentLang];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backgroundColor: "var(--forte-surface)",
        borderBottom: "1px solid var(--forte-border)",
        boxShadow: "var(--forte-shadow-sm)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Left: Full Logo with Click-to-Home */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <ForteLogo onClick={onGoHome} />
        </div>

        {/* Right: Actions, Language Switcher, Theme Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Presets Button */}
          <button
            type="button"
            className="btn-secondary"
            onClick={onOpenPresets}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <FolderOpenIcon style={{ width: 15, height: 15, color: "var(--forte-brand)" }} />
            <span>{t.presets}</span>
          </button>

          {/* Language Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "var(--forte-surface-2)",
              border: "1px solid var(--forte-border)",
              borderRadius: 8,
              padding: 2,
            }}
          >
            {(["kz", "ru", "en"] as Language[]).map((lng) => {
              const isActive = currentLang === lng;
              const title = lng === "kz" ? "Қаз" : lng === "ru" ? "Рус" : "Eng";
              return (
                <button
                  key={lng}
                  type="button"
                  onClick={() => onLanguageChange(lng)}
                  style={{
                    padding: "4px 9px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive
                      ? "var(--forte-brand)"
                      : "transparent",
                    color: isActive ? "#FFFFFF" : "var(--forte-text-secondary)",
                    transition: "all 0.12s ease",
                  }}
                >
                  {title}
                </button>
              );
            })}
          </div>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-secondary"
            title={theme === "light" ? t.themeDark : t.themeLight}
            style={{
              padding: "7px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {theme === "light" ? (
              <MoonIcon style={{ width: 16, height: 16, color: "var(--forte-text-primary)" }} />
            ) : (
              <SunIcon style={{ width: 16, height: 16, color: "var(--forte-brand-cyan)" }} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
