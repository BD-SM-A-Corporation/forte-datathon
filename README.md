Forte Compliance — интерфейс для просмотра видеозаписей кассовых операций по кейсу ForteBank Datathon 26. Пользователь выбирает локальный видеофайл и открывает его в плеере. Серверный API анализа пока не подключён, поэтому события, таймкоды и отчёты автоматически не формируются.

## Рабочая страница

В приложении одна рабочая страница — `/`. Слева пользователь выбирает одну видеозапись работы кассира и просматривает её. Справа находится панель анализа: до выбора файла она показывает начальное состояние, после выбора — сообщение о недоступном сервисе анализа. На узком экране панели располагаются последовательно.

Выбранный файл используется только для локального предпросмотра и не отправляется на сервер. Состояние выбора хранится в памяти страницы и сбрасывается при её перезагрузке. Истории проверок, экспорта отчётов, авторизации и пакетной обработки в интерфейсе нет.

Компоненты отчёта оставлены для будущей интеграции с реальным API. Они рассчитаны на данные сервиса: видимое наблюдение, таймкод, кадры, объяснение и предоставленный нормативный источник. Вывод должен проверяться специалистом и не является окончательным юридическим или дисциплинарным заключением.

## Контракт из кейса

Контракт ниже приведён только как документация требований кейса к будущему серверному сервису. Он не описывает реализованные возможности этого интерфейса.

- `POST /api/v1/analyze` — MOV в поле `file`.
- `GET /api/v1/jobs/{job_id}` — статус и результат.
- Доступ серверного API по `X-API-Key`; ввод ключа и авторизация в текущей странице не реализованы.

По заданию модели должны работать локально, без облачных AI-сервисов и без доступа к интернету после загрузки весов. Два результата: «Нарушение не обнаружено» и «Обнаружены признаки возможных нарушений». Перечень типов событий и релевантные источники должна обосновать команда; в кейсе готового перечня нет.

## Getting Started

First, run the development server:

```
bun install
bun --bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` to load Open Sans.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
