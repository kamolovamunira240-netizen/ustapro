import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  MapPin,
} from 'lucide-react';
import { formatCurrency, formatDateDisplay, getServiceMeta, getStatusMeta } from '../../utils/formatters';

export const ScheduleView: React.FC = () => {
  const {
    t,
    language,
    orders,
    profile,
    openOrderDetailModal,
    openNewOrderModal,
  } = useApp();

  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const todayStr = new Date().toISOString().slice(0, 10);
  const selectedDateStr = selectedDate.toISOString().slice(0, 10);

  // Navigate date
  const handlePrev = () => {
    const d = new Date(selectedDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() - 1);
    } else {
      d.setDate(d.getDate() - 7);
    }
    setSelectedDate(d);
  };

  const handleNext = () => {
    const d = new Date(selectedDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() + 1);
    } else {
      d.setDate(d.getDate() + 7);
    }
    setSelectedDate(d);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // 1. DAY VIEW LOGIC
  const dayOrders = orders.filter((o) => o.date === selectedDateStr);

  // Time slots for Day View (from 08:00 to 20:00)
  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
  ];

  // 2. WEEK VIEW LOGIC (get 7 days starting from Monday of selectedDate)
  const getWeekDates = (current: Date): Date[] => {
    const d = new Date(current);
    const day = d.getDay();
    // Monday is 1, Sunday is 0 -> adjust so Monday is first day
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      week.push(nextDay);
    }
    return week;
  };

  const weekDays = getWeekDates(selectedDate);

  const dayNamesShort: Record<string, string[]> = {
    uz: ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'],
    ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.schedule.title}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              {viewMode === 'day' ? `${dayOrders.length} ish` : t.actions.weekView}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.schedule.subtitle}
          </p>
        </div>

        {/* View Mode Toggle & Add Button */}
        <div className="flex items-center gap-2">
          {/* Day / Week switch */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.actions.dayView}
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.actions.weekView}
            </button>
          </div>

          <button
            onClick={() => openNewOrderModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.actions.newOrder}</span>
          </button>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Oldingi"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {t.actions.today}
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Keyingi"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Selected date title */}
        <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
          <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>
            {viewMode === 'day'
              ? formatDateDisplay(selectedDateStr, language)
              : `${formatDateDisplay(weekDays[0].toISOString().slice(0, 10), language)} — ${formatDateDisplay(weekDays[6].toISOString().slice(0, 10), language)}`}
          </span>
        </div>
      </div>

      {/* 1. DAY VIEW */}
      {viewMode === 'day' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {/* Day view timeline */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {timeSlots.map((slot) => {
              const slotHour = parseInt(slot.split(':')[0], 10);
              // Find orders in this hour slot
              const slotOrders = dayOrders.filter((o) => {
                const orderHour = parseInt(o.time.split(':')[0], 10);
                return orderHour === slotHour;
              });

              return (
                <div
                  key={slot}
                  className="flex flex-col sm:flex-row items-stretch min-h-[75px] hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Time label column */}
                  <div className="w-full sm:w-24 p-3 sm:py-4 sm:px-4 text-xs font-black text-slate-500 dark:text-slate-400 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center sm:justify-start gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slot}</span>
                  </div>

                  {/* Orders content in this slot */}
                  <div className="flex-1 p-2 sm:p-3 flex flex-wrap gap-2 items-center">
                    {slotOrders.length === 0 ? (
                      <span className="text-xs text-slate-300 dark:text-slate-600 italic select-none pl-2">
                        {t.schedule.noJobsAtTime}
                      </span>
                    ) : (
                      slotOrders.map((order) => {
                        const statusMeta = getStatusMeta(order.status);
                        const serviceMeta = getServiceMeta(order.serviceType);

                        return (
                          <div
                            key={order.id}
                            onClick={() => openOrderDetailModal(order)}
                            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer flex-1 min-w-[240px]"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{serviceMeta.icon}</span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  {order.time} — {order.customerName}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusMeta.badgeClass}`}
                              >
                                {t.status[order.status]}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 line-clamp-1">
                              {order.description}
                            </p>

                            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="truncate max-w-[150px]">{order.address}</span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {formatCurrency(order.price, profile.currency)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((d, index) => {
            const dStr = d.toISOString().slice(0, 10);
            const isToday = dStr === todayStr;
            const isSelected = dStr === selectedDateStr;
            const weekOrders = orders.filter((o) => o.date === dStr);

            const dayLabel = dayNamesShort[language]?.[index] || 'Day';

            return (
              <div
                key={dStr}
                onClick={() => {
                  setSelectedDate(d);
                  setViewMode('day');
                }}
                className={`p-3.5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between min-h-[220px] ${
                  isSelected
                    ? 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-400 dark:border-blue-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Column header */}
                <div className="pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {dayLabel}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-600 text-white">
                        {t.actions.today}
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {d.getDate()}
                  </div>
                </div>

                {/* Day's orders pills */}
                <div className="flex-1 py-2 space-y-1.5 overflow-y-auto">
                  {weekOrders.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[11px] text-slate-300 dark:text-slate-600 italic">
                      {t.schedule.noJobsAtTime}
                    </div>
                  ) : (
                    weekOrders.map((ord) => {
                      const serviceMeta = getServiceMeta(ord.serviceType);
                      const statusMeta = getStatusMeta(ord.status);

                      return (
                        <div
                          key={ord.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrderDetailModal(ord);
                          }}
                          className={`p-2 rounded-xl text-left border text-xs font-bold transition-all shadow-2xs hover:scale-102 ${statusMeta.badgeClass}`}
                        >
                          <div className="flex items-center justify-between gap-1 text-[11px]">
                            <span>{ord.time}</span>
                            <span>{serviceMeta.icon}</span>
                          </div>
                          <div className="truncate mt-0.5">{ord.customerName}</div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Day footer count */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] font-bold text-slate-400">
                  {weekOrders.length} {t.orders.title.toLowerCase()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
