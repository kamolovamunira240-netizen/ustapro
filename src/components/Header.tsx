import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  Sun,
  Moon,
  Plus,
  Globe,
  Check,
  Wrench,
} from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    t,
    language,
    setLanguage,
    theme,
    toggleTheme,
    openNewOrderModal,
    activeTab,
    profile,
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: 'O‘zbekcha', flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const pageTitles: Record<string, string> = {
    dashboard: t.nav.dashboard,
    customers: t.nav.customers,
    orders: t.nav.orders,
    schedule: t.nav.schedule,
    revenue: t.nav.revenue,
    settings: t.nav.settings,
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Left: Mobile hamburger & Current page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/30">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base">
            Usta<span className="text-blue-600 dark:text-blue-400">Pro</span>
          </span>
        </div>

        <div className="hidden lg:block">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {pageTitles[activeTab] || 'UstaPro'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.brandTagline}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Order Button */}
        <button
          onClick={() => openNewOrderModal()}
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm shadow-blue-600/30 transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.actions.newOrder}</span>
        </button>

        {/* Small screen mobile icon button */}
        <button
          onClick={() => openNewOrderModal()}
          className="sm:hidden p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-600/30 transition-all"
          title={t.actions.newOrder}
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Language Switcher Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm font-medium transition-colors"
            title="Tilni o'zgartirish"
          >
            <span className="text-base leading-none">{currentLangObj.flag}</span>
            <span className="hidden sm:inline font-semibold">{currentLangObj.code.toUpperCase()}</span>
            <Globe className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 text-sm animate-in fade-in duration-150">
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t.settings.language}
              </div>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    language === l.code
                      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                  {language === l.code && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 sm:px-2.5 sm:py-2 flex items-center gap-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-sm font-medium transition-colors"
          title={theme === 'dark' ? t.settings.lightMode : t.settings.darkMode}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
          )}
          <span className="hidden md:inline text-xs font-semibold">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* Technician Avatar Badge */}
        <div
          onClick={() => {}}
          className="hidden lg:flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {profile.name.charAt(0)}
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
              {profile.name}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
