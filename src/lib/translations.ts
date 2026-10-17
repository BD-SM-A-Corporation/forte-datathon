export type Language = "ru" | "kz" | "en";

export interface Translations {
  brandName: string;
  brandDescriptor: string;
  brandTagline: string;
  systemOnline: string;
  themeLight: string;
  themeDark: string;
  casesButton: string;
  uploadTitle: string;
  uploadSubtitle: string;
  uploadDropText: string;
  uploadBrowse: string;
  uploadFormatNote: string;
  checkLanguageLabel: string;
  langRu: string;
  langKz: string;
  langBoth: string;
  runAnalysisBtn: string;
  processingTitle: string;
  processingStep1: string;
  processingStep2: string;
  processingStep3: string;
  processingStep4: string;
  verdictPassed: string;
  verdictViolations: string;
  complianceScore: string;
  totalViolations: string;
  criticalViolations: string;
  mediumViolations: string;
  lowViolations: string;
  processingTime: string;
  tabOverview: string;
  tabViolations: string;
  tabChecklist: string;
  tabApi: string;
  videoPlayerTitle: string;
  timecodeJump: string;
  resetAnalysis: string;
  exportReport: string;
  copyJson: string;
  copied: string;
  filterAll: string;
  filterCritical: string;
  filterMedium: string;
  filterLow: string;
  casesModalTitle: string;
  casesModalSubtitle: string;
  selectCase: string;
  ruleCategoryOcr: string;
  ruleCategoryAudio: string;
  ruleCategoryRate: string;
  ruleCategoryLang: string;
  recommendationTitle: string;
  officialRegulationTitle: string;
  viewLawText: string;
  placeholderLogoBadge: string;
}

export const translations: Record<Language, Translations> = {
  ru: {
    brandName: "Forte",
    brandDescriptor: "Compliance",
    brandTagline: "Автоматизированный аудит рекламы и медиа-материалов",
    systemOnline: "Система активна",
    themeLight: "Светлая",
    themeDark: "Тёмная",
    casesButton: "Типовые сценарии",
    uploadTitle: "Загрузка медиа-материала",
    uploadSubtitle: "Перетащите рекламный видеоролик для нормативной проверки НБРК и АРРФР",
    uploadDropText: "Перетащите файл сюда или",
    uploadBrowse: "выберите на компьютере",
    uploadFormatNote: "Поддерживаются MP4, MOV, WEBM до 150 МБ",
    checkLanguageLabel: "Язык ролика для анализа:",
    langRu: "Русский",
    langKz: "Казахский",
    langBoth: "Оба языка (паритет)",
    runAnalysisBtn: "Запустить проверку",
    processingTitle: "Выполняется нормативный аудит...",
    processingStep1: "Извлечение аудиодорожки и транскрибация речи",
    processingStep2: "Оптическое распознавание текста (OCR дисклеймеров)",
    processingStep3: "Сверка с требованиями НБРК (ГЭСВ, лицензия, паритет)",
    processingStep4: "Формирование юридического отчёта о соответствии",
    verdictPassed: "Соответствует нормативам",
    verdictViolations: "Обнаружены нарушения",
    complianceScore: "Индекс соответствия",
    totalViolations: "Всего нарушений",
    criticalViolations: "Критические",
    mediumViolations: "Средние",
    lowViolations: "Низкие",
    processingTime: "Время обработки",
    tabOverview: "Сводка аудита",
    tabViolations: "Нарушения",
    tabChecklist: "Чеклист требований",
    tabApi: "API / Экспорт JSON",
    videoPlayerTitle: "Анализ видеодорожки",
    timecodeJump: "Перейти к моменту",
    resetAnalysis: "Новая проверка",
    exportReport: "Экспорт отчёта (.JSON)",
    copyJson: "Скопировать JSON",
    copied: "Скопировано",
    filterAll: "Все",
    filterCritical: "Критические",
    filterMedium: "Внимание",
    filterLow: "Инфо",
    casesModalTitle: "Библиотека типовых сценариев",
    casesModalSubtitle: "Выберите готовый сценарий для проверки алгоритмов детекции",
    selectCase: "Загрузить сценарий",
    ruleCategoryOcr: "OCR / Дисклеймеры",
    ruleCategoryAudio: "Аудио / Озвучка",
    ruleCategoryRate: "Достоверность ставки",
    ruleCategoryLang: "Языковой паритет",
    recommendationTitle: "Рекомендация по устранению",
    officialRegulationTitle: "Нормативно-правовой акт",
    viewLawText: "Открыть в «Әділет»",
    placeholderLogoBadge: "Brand Architecture: Asset Slot",
  },
  kz: {
    brandName: "Forte",
    brandDescriptor: "Compliance",
    brandTagline: "Жарнама мен медиа-материалдарды автоматтандырылған аудиттеу",
    systemOnline: "Жүйе белсенді",
    themeLight: "Ашық",
    themeDark: "Күңгірт",
    casesButton: "Үлгілік сценарийлер",
    uploadTitle: "Медиа-материалды жүктеу",
    uploadSubtitle: "ҰБ мен ҚҚРА талаптарына сәйкестігін тексеру үшін бейнені жүктеңіз",
    uploadDropText: "Файлды осында сүйреңіз немесе",
    uploadBrowse: "компьютерден таңдаңыз",
    uploadFormatNote: "MP4, MOV, WEBM 150 МБ дейін қолдау көрсетіледі",
    checkLanguageLabel: "Тексерілетін бейне тілі:",
    langRu: "Орысша",
    langKz: "Қазақша",
    langBoth: "Қос тіл (паритет)",
    runAnalysisBtn: "Тексеруді бастау",
    processingTitle: "Нормативтік аудит жүргізілуде...",
    processingStep1: "Аудиожолды шығару және сөзді мәтінге айналдыру",
    processingStep2: "Оптикалық мәтінді тану (OCR ескертулері)",
    processingStep3: "ҰБ талаптарымен сәйкестендіру (ЖТСМ, лицензия, паритет)",
    processingStep4: "Заңдық сәйкестік есебін қалыптастыру",
    verdictPassed: "Талаптарға сай келеді",
    verdictViolations: "Бұзушылықтар табылды",
    complianceScore: "Сәйкестік индексі",
    totalViolations: "Барлық бұзушылықтар",
    criticalViolations: "Қауіпті",
    mediumViolations: "Орташа",
    lowViolations: "Төмен",
    processingTime: "Өңдеу уақыты",
    tabOverview: "Аудит қорытындысы",
    tabViolations: "Бұзушылықтар",
    tabChecklist: "Талаптар тізімі",
    tabApi: "API / JSON экспорттау",
    videoPlayerTitle: "Бейнежазбаны талдау",
    timecodeJump: "Сәтке өту",
    resetAnalysis: "Жаңа тексеру",
    exportReport: "Есепті экспорттау (.JSON)",
    copyJson: "JSON көшіру",
    copied: "Көшірілді",
    filterAll: "Барлығы",
    filterCritical: "Қауіпті",
    filterMedium: "Назар аударыңыз",
    filterLow: "Ақпараттық",
    casesModalTitle: "Үлгілік сценарийлер кітапханасы",
    casesModalSubtitle: "Анықтау алгоритмдерін сынау үшін дайын сценарийді таңдаңыз",
    selectCase: "Сценарийді жүктеу",
    ruleCategoryOcr: "OCR / Ескертулер",
    ruleCategoryAudio: "Аудио / Дауыстау",
    ruleCategoryRate: "Мөлшерлеме шынайылығы",
    ruleCategoryLang: "Тілдік паритет",
    recommendationTitle: "Түзету жөніндегі ұсыныс",
    officialRegulationTitle: "Нормативтік-құқықтық акт",
    viewLawText: "«Әділет» базасынан ашу",
    placeholderLogoBadge: "Brand Architecture: Asset Slot",
  },
  en: {
    brandName: "Forte",
    brandDescriptor: "Compliance",
    brandTagline: "Automated Advertising & Media Compliance Auditing",
    systemOnline: "System Online",
    themeLight: "Light",
    themeDark: "Dark",
    casesButton: "Audit Scenarios",
    uploadTitle: "Upload Media Asset",
    uploadSubtitle: "Upload promotional video to verify regulatory compliance against NBRK & ARDFM standards",
    uploadDropText: "Drag and drop video here or",
    uploadBrowse: "browse computer",
    uploadFormatNote: "Supports MP4, MOV, WEBM up to 150 MB",
    checkLanguageLabel: "Video language to inspect:",
    langRu: "Russian",
    langKz: "Kazakh",
    langBoth: "Dual language (Parity)",
    runAnalysisBtn: "Start Compliance Audit",
    processingTitle: "Executing regulatory compliance audit...",
    processingStep1: "Extracting audio track & speech transcription",
    processingStep2: "Optical character recognition (OCR on fine-print disclosures)",
    processingStep3: "Cross-referencing NBRK directives (GESV, licensing, parity)",
    processingStep4: "Compiling legal audit findings and recommendations",
    verdictPassed: "Fully Compliant",
    verdictViolations: "Non-Compliant Findings",
    complianceScore: "Compliance Score",
    totalViolations: "Total Findings",
    criticalViolations: "Critical",
    mediumViolations: "Medium",
    lowViolations: "Low",
    processingTime: "Processing Time",
    tabOverview: "Audit Summary",
    tabViolations: "Violations",
    tabChecklist: "Regulatory Checklist",
    tabApi: "API / JSON Export",
    videoPlayerTitle: "Video Stream Inspection",
    timecodeJump: "Jump to Timecode",
    resetAnalysis: "New Audit",
    exportReport: "Export Report (.JSON)",
    copyJson: "Copy JSON",
    copied: "Copied",
    filterAll: "All",
    filterCritical: "Critical",
    filterMedium: "Warning",
    filterLow: "Info",
    casesModalTitle: "Audit Preset Library",
    casesModalSubtitle: "Select a standardized audit scenario to verify detection algorithms",
    selectCase: "Load Scenario",
    ruleCategoryOcr: "OCR / Disclaimers",
    ruleCategoryAudio: "Audio / Voiceover",
    ruleCategoryRate: "Interest Rate Veracity",
    ruleCategoryLang: "Language Parity",
    recommendationTitle: "Remediation Recommendation",
    officialRegulationTitle: "Regulatory Reference",
    viewLawText: "Open in Adilet Legal Portal",
    placeholderLogoBadge: "Brand Architecture: Asset Slot",
  },
};
