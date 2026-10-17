import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ForteBank AI Inspector — Контроль кассовой дисциплины",
  description:
    "AI-сервис для выявления нарушений кассовой дисциплины по видеозаписям. ForteBank Datathon 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0c0c0e] text-zinc-100">
        {children}
      </body>
    </html>
  );
}
