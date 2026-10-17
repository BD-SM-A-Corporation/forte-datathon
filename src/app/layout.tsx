import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Forte Cash Discipline Check — Контроль кассовой зоны AI',
  description: 'Автоматический анализ видеозаписей на соблюдение кассовой дисциплины и регламентов НБРК. Локальная обработка без распознавания лиц и звука.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#090a0f] text-zinc-100 selection:bg-[#a11042] selection:text-white">
        {children}
      </body>
    </html>
  );
}
