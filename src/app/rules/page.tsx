import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BookOpen, Cpu, Lock } from 'lucide-react';

export default function RulesPage() {
  return <div className="min-h-screen flex flex-col bg-cyber-grid"><Header />
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 space-y-8">
      <Link href="/" className="text-sm text-zinc-400 hover:text-white">← К анализу видео</Link>
      <div><p className="text-xs uppercase tracking-widest text-rose-400">Методика</p><h1 className="mt-3 text-4xl font-bold">От наблюдения к проверке</h1><p className="mt-4 max-w-2xl text-zinc-400">Сервис ищет визуальные признаки возможных нарушений. Оценка относится только к видимым действиям и настроенным правилам.</p></div>
      <div className="grid gap-4 md:grid-cols-3">{[
        { Icon: Cpu, title: 'Локальная модель', text: 'Бекенд использует локальную Qwen2.5-VL. Для работы необходимы веса модели и запущенный обработчик очереди.' },
        { Icon: Lock, title: 'Только видео', text: 'Звук и идентификация лиц не используются. Кадры обрабатываются внутри развёрнутого сервиса.' },
        { Icon: BookOpen, title: 'Нормативные основания', text: 'Правила задаются в реестре бекенда. Для каждого правила нужны источник РК, раздел и объяснение связи с видимым действием.' },
      ].map(({Icon, title, text}, i) => <article key={i} className="glass-panel rounded-2xl p-6"><Icon className="text-rose-400" size={24} /><h2 className="mt-4 font-semibold">{title as string}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-400">{text as string}</p></article>)}</div>
      <section className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6"><h2 className="font-semibold text-amber-200">Реестр ещё требует заполнения</h2><p className="mt-2 text-sm leading-relaxed text-zinc-300">В текущем файле backend/rules/regulations.json список правил пуст. До заполнения и проверки нормативной базы бекенд возвращает ошибку: нормативный вердикт недоступен. Интерфейс не подставляет вымышленные пункты или ссылки.</p></section>
      <p className="text-sm text-zinc-500">Ракурс камеры, перекрытия и выборка кадров могут влиять на результат. Сервис не проверяет проводки, системную сверку или полномочия человека по внешности.</p>
    </main><Footer /></div>;
}
