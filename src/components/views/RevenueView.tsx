import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Coins,
  TrendingUp,
  Calendar,
  CheckCircle,
  CreditCard,
  ArrowUpRight,
} from 'lucide-react';
import { formatCurrency, formatDateDisplay, getServiceMeta } from '../../utils/formatters';
import { ServiceType } from '../../types';

export const RevenueView: React.FC = () => {
  const { t, language, orders, profile, openOrderDetailModal } = useApp();

  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('month');

  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date();

  // All completed orders (revenue is counted for completed orders)
  const completedOrders = orders.filter((o) => o.status === 'completed');

  // Today's revenue
  const todayRevenue = completedOrders
    .filter((o) => o.date === todayStr)
    .reduce((sum, o) => sum + o.price, 0);

  // Weekly revenue (last 7 days)
  const weeklyRevenue = completedOrders
    .filter((o) => {
      const orderDate = new Date(o.date);
      const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    })
    .reduce((sum, o) => sum + o.price, 0);

  // Monthly revenue (this month)
  const currentYearMonth = todayStr.slice(0, 7);
  const monthlyRevenue = completedOrders
    .filter((o) => o.date.startsWith(currentYearMonth))
    .reduce((sum, o) => sum + o.price, 0);

  // Total revenue
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price, 0);

  // Filter orders by selected period
  const periodFilteredOrders = completedOrders.filter((o) => {
    if (period === 'today') return o.date === todayStr;
    if (period === 'week') {
      const orderDate = new Date(o.date);
      const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }
    if (period === 'month') return o.date.startsWith(currentYearMonth);
    return true;
  });

  const periodRevenue = periodFilteredOrders.reduce((sum, o) => sum + o.price, 0);
  const averageTicket = periodFilteredOrders.length
    ? Math.round(periodRevenue / periodFilteredOrders.length)
    : 0;

  // Breakdown by service for chart
  const servicesList: ServiceType[] = [
    'electric',
    'plumbing',
    'ac',
    'computer',
    'repair',
    'other',
  ];

  const serviceBreakdown = servicesList.map((st) => {
    const list = periodFilteredOrders.filter((o) => o.serviceType === st);
    const amount = list.reduce((sum, o) => sum + o.price, 0);
    const percentage = periodRevenue > 0 ? Math.round((amount / periodRevenue) * 100) : 0;
    return {
      type: st,
      label: t.services[st],
      count: list.length,
      amount,
      percentage,
      icon: getServiceMeta(st).icon,
    };
  }).filter((s) => s.amount > 0 || period === 'all');

  // 7-day daily trend data for simple responsive bar chart
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().slice(0, 10);
    const dayTotal = completedOrders
      .filter((o) => o.date === dStr)
      .reduce((sum, o) => sum + o.price, 0);
    return {
      date: dStr,
      label: d.toLocaleDateString(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short' }),
      amount: dayTotal,
    };
  });

  const maxDayAmount = Math.max(...last7Days.map((d) => d.amount), 500000);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {t.revenue.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.revenue.subtitle}
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          {[
            { id: 'today', label: t.actions.today },
            { id: 'week', label: t.actions.thisWeek },
            { id: 'month', label: t.actions.thisMonth },
            { id: 'all', label: t.actions.all },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Calendar className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {t.actions.today}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
            {formatCurrency(todayRevenue, profile.currency)}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            {t.revenue.todayRevenue}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              7 kun
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
            {formatCurrency(weeklyRevenue, profile.currency)}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            {t.revenue.weeklyRevenue}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              {t.actions.thisMonth}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight truncate">
            {formatCurrency(monthlyRevenue, profile.currency)}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            {t.revenue.monthlyRevenue}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2.5 rounded-2xl bg-white/20 text-white">
              <Coins className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/25 text-white">
              {t.actions.all}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight truncate">
            {formatCurrency(totalRevenue, profile.currency)}
          </div>
          <div className="text-xs font-medium text-blue-100 mt-1">
            {t.revenue.totalRevenue}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. 7-day visual bar chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>{t.revenue.revenueChart}</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">So‘nggi 7 kun</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kundalik tushumlar ko‘rsatkichi
            </p>
          </div>

          {/* Bar Chart Container */}
          <div className="mt-8 pt-4 flex items-end justify-between gap-2 h-48 border-b border-slate-100 dark:border-slate-800 px-2">
            {last7Days.map((day, idx) => {
              const heightPercent = Math.max(
                Math.round((day.amount / maxDayAmount) * 100),
                8
              );
              const isToday = day.date === todayStr;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  {/* Tooltip on hover */}
                  <div className="text-[10px] font-black text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(day.amount / 1000)}k
                  </div>

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 ${
                      isToday
                        ? 'bg-blue-600 shadow-sm shadow-blue-500/40'
                        : day.amount > 0
                        ? 'bg-blue-400 dark:bg-blue-500/80 group-hover:bg-blue-500'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  />

                  {/* Day label */}
                  <span
                    className={`text-[11px] font-bold ${
                      isToday
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.revenue.completedJobs}: {periodFilteredOrders.length}</span>
            <span>{t.revenue.averageTicket}: <b className="text-slate-900 dark:text-white">{formatCurrency(averageTicket, profile.currency)}</b></span>
          </div>
        </div>

        {/* 2. Service breakdown distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.revenue.byService}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tanlangan davr bo‘yicha xizmatlar ulushi
            </p>
          </div>

          <div className="space-y-4">
            {serviceBreakdown.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                Ushbu davrda daromad qayd etilmagan
              </div>
            ) : (
              serviceBreakdown.map((item) => (
                <div key={item.type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        ({item.count} ish)
                      </span>
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      {formatCurrency(item.amount, profile.currency)}
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Completed Orders Revenue History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.revenue.paymentHistory}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Bajarilgan buyurtmalar va qabul qilingan to‘lovlar
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {periodFilteredOrders.length} to‘lov
          </span>
        </div>

        {periodFilteredOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 italic">
            Bu davr uchun bajarilgan buyurtmalar yo‘q
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {periodFilteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => openOrderDetailModal(order)}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t.services[order.serviceType]} • {formatDateDisplay(order.date, language)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(order.price, profile.currency)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {order.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
