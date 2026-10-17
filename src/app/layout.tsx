import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Forte Compliance — Проверка кассовых операций по видео",
  description:
    "Forte Compliance — рабочее пространство для просмотра видеозаписей кассовых операций и проверки событий специалистом.",
  icons: {
    icon: [
      { url: "/Logo/short_Logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/Logo/short_Logo.svg",
    apple: "/Logo/short_Logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${openSans.variable} h-full`}>
      <head>
        <link rel="icon" href="/Logo/short_Logo.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
