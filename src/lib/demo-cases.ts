import type { DemoCase } from "@/types";

// Placeholder base64 JPEG (grey square, ~1KB)
const PLACEHOLDER_FRAME =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoH" +
  "BwYIDAoMCwsKCwsNCxAQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQME" +
  "BAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU" +
  "FBQUFBQUFBT/wAARCAAyADIDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAACAgJ" +
  "/8QAIRAAAgICAQUBAAAAAAAAAAAABAUDBhESEyExQlH/xAAUAQEAAAAAAAAAAAAAAAAA" +
  "AAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A3TgAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAHjlXKj5O3Lp+YABEklFJJJJL2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z";

export const DEMO_CASES: DemoCase[] = [
  {
    id: "demo-clean",
    label: "Кейс 1: Чистая смена",
    description: "Нет нарушений · 2:05",
    result: {
      job_id: "demo-001",
      status: "done",
      verdict: "no_violation",
      violations: [],
      processing_time_ms: 8200,
    },
  },
  {
    id: "demo-cashdesk",
    label: "Кейс 2: Деньги без присмотра",
    description: "1 нарушение · 1:43",
    result: {
      job_id: "demo-002",
      status: "done",
      verdict: "violation",
      violations: [
        {
          type: "Оставление денежных средств без присмотра",
          timecode_sec: 44.2,
          description:
            "Кассир покинул рабочее место, оставив купюры на столе без укладки в кассовый ящик. На кадре видно: стопка купюр лежит на открытом кассовом лотке, дверца сейфа открыта, кассир стоит спиной. Согласно регламенту, наличность должна быть немедленно убрана в закрытый ящик при любом отходе от рабочего места.",
          evidence_frames: [
            { timestamp_sec: 44.2, image_base64: PLACEHOLDER_FRAME },
            { timestamp_sec: 45.8, image_base64: PLACEHOLDER_FRAME },
          ],
          regulation: "Постановление Правления НБРК № 201 «Об организации кассовой работы в банках»",
          regulation_article: "п. 14, гл. 3",
          regulation_url: "https://adilet.zan.kz/rus/docs/V1700015764",
        },
      ],
      processing_time_ms: 14300,
    },
  },
  {
    id: "demo-inkass",
    label: "Кейс 3: Нарушение инкассации",
    description: "2 нарушения · 2:25",
    result: {
      job_id: "demo-003",
      status: "done",
      verdict: "violation",
      violations: [
        {
          type: "Нарушение регламента приёма инкассаторской сумки",
          timecode_sec: 23.0,
          description:
            "Пересчёт ценностей производится не в зоне прямой видимости видеокамеры. Инкассаторская сумка раскрыта до завершения оформления сопроводительных документов.",
          evidence_frames: [
            { timestamp_sec: 23.0, image_base64: PLACEHOLDER_FRAME },
          ],
          regulation: "Постановление Правления НБРК № 201 «Об организации кассовой работы в банках»",
          regulation_article: "п. 22, гл. 4",
          regulation_url: "https://adilet.zan.kz/rus/docs/V1700015764",
        },
        {
          type: "Нахождение постороннего лица в кассовой зоне",
          timecode_sec: 72.5,
          description:
            "В кадре виден силуэт человека, не являющегося кассиром или инкассатором, в зоне ограниченного доступа у кассового окна. Нахождение третьих лиц в кассовой кабине запрещено.",
          evidence_frames: [
            { timestamp_sec: 72.5, image_base64: PLACEHOLDER_FRAME },
            { timestamp_sec: 74.1, image_base64: PLACEHOLDER_FRAME },
          ],
          regulation: "Закон РК «О банках и банковской деятельности» ст. 50",
          regulation_article: "ст. 50, ч. 2",
          regulation_url: "https://adilet.zan.kz/rus/docs/Z950002444_",
        },
      ],
      processing_time_ms: 21600,
    },
  },
];
