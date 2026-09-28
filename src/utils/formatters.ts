import { OrderStatus, ServiceType } from '../types';

export const formatCurrency = (amount: number, currency: string = 'so‘m'): string => {
  const formatted = new Intl.NumberFormat('ru-RU').format(Math.round(amount || 0));
  return `${formatted} ${currency}`;
};

export const formatDateDisplay = (dateStr: string, lang: 'uz' | 'ru' | 'en'): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));

  const locales: Record<string, string> = {
    uz: 'uz-UZ',
    ru: 'ru-RU',
    en: 'en-US',
  };

  try {
    return dateObj.toLocaleDateString(locales[lang] || 'uz-UZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const getStatusMeta = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return {
        key: 'pending',
        dotClass: 'bg-amber-500',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
        icon: '🟡',
      };
    case 'in_progress':
      return {
        key: 'in_progress',
        dotClass: 'bg-blue-500',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
        icon: '🔵',
      };
    case 'completed':
      return {
        key: 'completed',
        dotClass: 'bg-emerald-500',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
        icon: '🟢',
      };
    case 'cancelled':
      return {
        key: 'cancelled',
        dotClass: 'bg-rose-500',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
        icon: '🔴',
      };
  }
};

export const getServiceMeta = (service: ServiceType) => {
  switch (service) {
    case 'electric':
      return {
        icon: '⚡',
        colorClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      };
    case 'plumbing':
      return {
        icon: '🚰',
        colorClass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
      };
    case 'ac':
      return {
        icon: '❄️',
        colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      };
    case 'computer':
      return {
        icon: '💻',
        colorClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
      };
    case 'repair':
      return {
        icon: '🔧',
        colorClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
      };
    case 'other':
    default:
      return {
        icon: '🛠',
        colorClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      };
  }
};
