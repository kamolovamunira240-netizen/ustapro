import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Sun,
  Moon,
  User,
  Phone,
  Briefcase,
  Clock,
  Coins,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Language, Theme } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    theme,
    toggleTheme,
    profile,
    updateProfile,
    resetToDemoData,
    exportDataJSON,
    importDataJSON,
    showToast,
  } = useApp();

  const [formData, setFormData] = useState({ ...profile });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: 'O‘zbekcha', flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast(t.msg.requiredFields, 'error');
      return;
    }
    updateProfile(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDataJSON(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm(t.settings.resetConfirm)) {
      resetToDemoData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          {t.settings.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t.settings.subtitle}
        </p>
      </div>

      {/* Language Selection Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.settings.language}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {languages.map((l) => {
            const isSelected = language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{l.flag}</span>
                  <span className="text-xs font-bold">{l.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Mode Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-indigo-500" />
          ) : (
            <Sun className="w-5 h-5 text-amber-500" />
          )}
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.settings.theme}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => {
              if (theme !== 'light') toggleTheme();
            }}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 ring-2 ring-amber-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-xs font-bold">{t.settings.lightMode}</div>
                <div className="text-[11px] text-slate-400">Yorug‘ va toza interfeys</div>
              </div>
            </div>
            {theme === 'light' && <Check className="w-4 h-4 text-amber-600" />}
          </button>

          <button
            onClick={() => {
              if (theme !== 'dark') toggleTheme();
            }}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-950/40 text-blue-300 ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-xs font-bold">{t.settings.darkMode}</div>
                <div className="text-[11px] text-slate-400">Ko‘zni charchatmaydigan qoramtir rejim</div>
              </div>
            </div>
            {theme === 'dark' && <Check className="w-4 h-4 text-blue-400" />}
          </button>
        </div>
      </div>

      {/* Technician Profile Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.settings.profile}
          </h3>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settings.name}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settings.phone}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Specialty */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settings.specialty}
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Work hours */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settings.workHours}
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.workHours}
                  onChange={(e) => setFormData({ ...formData, workHours: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Currency */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settings.currency}
              </label>
              <div className="relative max-w-xs">
                <Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="so‘m">so‘m (UZS)</option>
                  <option value="₽">₽ (RUB)</option>
                  <option value="$">$ (USD)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              {t.actions.save}
            </button>
          </div>
        </form>
      </div>

      {/* Backup and Data Storage Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.settings.dataManagement}
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {t.settings.dataInfo}
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={exportDataJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{t.actions.exportData}</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.actions.importData}</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-all cursor-pointer ml-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.actions.resetDemo}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
