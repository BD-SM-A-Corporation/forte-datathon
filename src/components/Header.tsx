'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ArrowUpRight, BookOpen, ChevronRight, Command, FileVideo, LayoutDashboard, PanelLeftClose, ShieldCheck, LockKeyhole } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  return <>
    {mobileOpen && <button className="workspace-scrim" aria-label="Закрыть меню" onClick={() => setMobileOpen(false)} />}
    <aside className={`workspace-sidebar ${mobileOpen ? 'is-open' : ''}`}>
      <Link href="/" className="workspace-brand"><span className="brand-symbol"><Command size={23} /></span><span>forte<span className="text-rose-400">.</span><small>COMPLIANCE WORKSPACE</small></span></Link>
      <div className="workspace-switch"><span className="workspace-avatar">F</span><div><strong>Кассовый контроль</strong><span>Рабочее пространство</span></div><ChevronRight size={14} /></div>
      <p className="nav-label">РАБОЧАЯ ОБЛАСТЬ</p>
      <nav className="workspace-nav" aria-label="Основная навигация">
        {[
          { href: '/', icon: LayoutDashboard, title: 'Проверка видео', hint: '01' },
          { href: '/rules', icon: BookOpen, title: 'Правила и методика', hint: '02' },
        ].map(({ href, icon: Icon, title, hint }) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={pathname === href ? 'active' : ''} aria-current={pathname === href ? 'page' : undefined}><Icon size={17} /><span>{title}</span><small>{hint}</small></Link>)}
      </nav>
      <div className="sidebar-workflow"><p className="nav-label">ПРОЦЕСС ПРОВЕРКИ</p><div><FileVideo size={15} /><span>Загрузка видеозаписи</span></div><div><Activity size={15} /><span>Локальный AI-анализ</span></div><div><ShieldCheck size={15} /><span>Проверка доказательств</span></div></div>
      <div className="sidebar-bottom"><div className="local-card"><LockKeyhole size={18} /><strong>Данные внутри контура</strong><p>Локальная обработка видео.<br />Без облачных AI-сервисов.</p><span>ON-PREMISE <ArrowUpRight size={12} /></span></div><div className="workspace-profile"><span className="workspace-avatar">АК</span><div><strong>Аналитик контроля</strong><span>Datathon 26</span></div><span className="profile-dot" /></div></div>
    </aside>
    <header className="workspace-topbar"><div className="flex items-center gap-3"><button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu" aria-label="Открыть навигацию" aria-expanded={mobileOpen}><PanelLeftClose size={20} /></button><span className="text-zinc-500 hidden sm:inline">Рабочее пространство</span><ChevronRight size={13} className="text-zinc-600" /><span>{pathname === '/rules' ? 'Правила и методика' : pathname.startsWith('/jobs/') ? 'Результат проверки' : 'Проверка видео'}</span></div><div className="topbar-right"><span className="local-indicator"><span />Локальная обработка</span><span className="topbar-separator" /><span className="text-zinc-500">DATATHON <b className="text-zinc-300">26</b></span></div></header>
  </>;
}
