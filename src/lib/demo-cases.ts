import type { DemoCase } from "@/types";

// Clean lightweight preview placeholder
const PLACEHOLDER_FRAME =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'><rect width='320' height='180' fill='%231c1d22'/><rect x='20' y='140' width='160' height='12' rx='2' fill='%230e85e6' opacity='0.7'/><rect x='20' y='156' width='120' height='8' rx='2' fill='%2371717a' opacity='0.5'/><text x='160' y='95' fill='%23a1a1aa' font-family='sans-serif' font-size='12' text-anchor='middle'>OCR Frame Evidence</text></svg>";

export const DEMO_CASES: DemoCase[] = [
  {
    id: "case-loan-violation",
    label: "Кейс 1: Кредит наличными (ГЭСВ & Аудио)",
    description: "2 нарушения · Критический риск · 0:30",
    result: {
      job_id: "JOB-2026-FT-0841",
      status: "done",
      verdict: "violation",
      processing_time_ms: 4210,
      violations: [
        {
          type: "Несоответствие размера шрифта ГЭСВ (OCR)",
          timecode_sec: 8.5,
          description:
            "Номинальная ставка «от 9.9%» указана крупным шрифтом по центру (высота символов 14.2% кадра), тогда как годовая эффективная ставка вознаграждения (ГЭСВ от 21.4%) набрана трудночитаемым шрифтом внизу экрана высотой 1.3% кадра. Согласно нормативам НБРК, размер шрифта ГЭСВ обязан быть визуально соразмерным и не менее половины от размера привлекающей ставки.",
          evidence_frames: [
            { timestamp_sec: 8.5, image_base64: PLACEHOLDER_FRAME },
            { timestamp_sec: 12.0, image_base64: PLACEHOLDER_FRAME },
          ],
          regulation: "Правила предоставления банковских услуг и раскрытия информации (НБРК)",
          regulation_article: "Статья 8, п. 3 (Требования к публикации ГЭСВ в рекламе)",
          regulation_url: "https://adilet.zan.kz/rus/docs/V1900019683",
        },
        {
          type: "Отсутствие предупреждения о переплате в аудио",
          timecode_sec: 24.0,
          description:
            "В звуковой дорожке видеоролика не озвучено обязательное голосовое предупреждение о полной стоимости кредита и предельной ставке вознаграждения. По нормативам финансовой рекламы при аудиосопровождении обязателен дисклеймер хронометражем не менее 2 секунд.",
          evidence_frames: [
            { timestamp_sec: 24.0, image_base64: PLACEHOLDER_FRAME },
          ],
          regulation: "Закон РК «О рекламе» и регламенты финмониторинга",
          regulation_article: "Статья 13 (Особенности рекламы финансовых и банковских услуг)",
          regulation_url: "https://adilet.zan.kz/rus/docs/Z030000508_",
        },
      ],
    },
  },
  {
    id: "case-mortgage-parity",
    label: "Кейс 2: Ипотечная программа (Лицензия & Паритет)",
    description: "2 нарушения · Средний риск · 0:45",
    result: {
      job_id: "JOB-2026-FT-0914",
      status: "done",
      verdict: "violation",
      processing_time_ms: 5120,
      violations: [
        {
          type: "Отсутствие номера банковской лицензии АРРФР",
          timecode_sec: 15.0,
          description:
            "В финальном титре не указан официальный номер и дата выдачи лицензии Агентства Республики Казахстан по регулированию и развитию финансового рынка (АРРФР № 1.2.29/197/36).",
          evidence_frames: [
            { timestamp_sec: 15.0, image_base64: PLACEHOLDER_FRAME },
          ],
          regulation: "Закон РК «О банках и банковской деятельности в Республике Казахстан»",
          regulation_article: "Статья 33 (Обязательные реквизиты и лицензирование в рекламе)",
          regulation_url: "https://adilet.zan.kz/rus/docs/Z950002444_",
        },
        {
          type: "Нарушение паритета государственного языка (ҚР Тіл туралы заңы)",
          timecode_sec: 32.5,
          description:
            "Текстовая информация на государственном языке (казахском) расположена ниже русскоязычного блока и имеет уменьшенный на 35% кегль шрифта. По закону о рекламе в РК текстовые блоки на обоих языках должны иметь идентичный визуальный вес и читаемость.",
          evidence_frames: [
            { timestamp_sec: 32.5, image_base64: PLACEHOLDER_FRAME },
            { timestamp_sec: 36.0, image_base64: PLACEHOLDER_FRAME },
          ],
          regulation: "Закон Республики Казахстан «О языках в Республике Казахстан»",
          regulation_article: "Статья 21 (Язык реквизитов и визуальной информации)",
          regulation_url: "https://adilet.zan.kz/rus/docs/Z970000151_",
        },
      ],
    },
  },
  {
    id: "case-deposit-compliant",
    label: "Кейс 3: Депозит «Forte Премиум» (Полный комплаенс)",
    description: "0 нарушений · 100% комплаенс · 0:25",
    result: {
      job_id: "JOB-2026-FT-1002",
      status: "done",
      verdict: "no_violation",
      processing_time_ms: 3890,
      violations: [],
    },
  },
];
