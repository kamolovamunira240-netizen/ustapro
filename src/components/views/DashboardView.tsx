import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coins,
  Users,
  Plus,
  Phone,
  ChevronRight,
  Sparkles,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency, getServiceMeta, getStatusMeta } from '../../utils/formatters';

export const DashboardView: React.FC = () => {
  const {
    t,
    orders,
    customers,
    profile,
    openNewOrderModal,
    openNewCustomerModal,
    openOrderDetailModal,
    updateOrderStatus,
    setActiveTab,
  } = useApp();

  const todayStr = new Date().toISOString().slice(0, 10);

  // Today's orders
  const todayOrders = orders.filter((o) => o.date === todayStr);

  // Pending orders
  const pendingOrders = orders.filter((o) => o.status === 'pending');

  // Completed orders
  const completedOrders = orders.filter((o) => o.status === 'completed');

  // Today's revenue (from completed orders today, or today's scheduled revenue)
  const todayRevenue = todayOrders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.price, 0);

  // Next upcoming job for banner alert
  const upcomingJob = todayOrders
    .filter((o) => o.status === 'pending' || o.status === 'in_progress')
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  // Stats cards config
  const statCards = [
    {
      title: t.dashboard.todayOrders,
      value: todayOrders.length,
      icon: <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      bg: 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50',
      badge: `${todayOrders.filter((o) => o.status === 'completed').length} ${t.status.completed.toLowerCase()}`,
      badgeColor: 'text-blue-700 bg-blue-100/80 dark:text-blue-300 dark:bg-blue-900/60',
    },
    {
      title: t.dashboard.pendingOrders,
      value: pendingOrders.length,
      icon: <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      bg: 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-900/50',
      badge: t.status.pending,
      badgeColor: 'text-amber-700 bg-amber-100/80 dark:text-amber-300 dark:bg-amber-900/60',
    },
    {
      title: t.dashboard.completedOrders,
      value: completedOrders.length,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/50',
      badge: `${Math.round((completedOrders.length / (orders.length || 1)) * 100)}% muvaffaqiyat`,
      badgeColor: 'text-emerald-700 bg-emerald-100/80 dark:text-emerald-300 dark:bg-emerald-900/60',
    },
    {
      title: t.dashboard.todayRevenue,
      value: formatCurrency(todayRevenue, profile.currency),
      isText: true,
      icon: <Coins className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
      bg: 'bg-violet-50/80 dark:bg-violet-950/40 border-violet-200/80 dark:border-violet-900/50',
      badge: t.actions.today,
      badgeColor: 'text-violet-700 bg-violet-100/80 dark:text-violet-300 dark:bg-violet-900/60',
    },
    {
      title: t.dashboard.totalCustomers,
      value: customers.length,
      icon: <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      bg: 'bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-200/80 dark:border-cyan-900/50',
      badge: 'Faol mijozlar',
      badgeColor: 'text-cyan-700 bg-cyan-100/80 dark:text-cyan-300 dark:bg-cyan-900/60',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Alert if there is an upcoming job */}
      {upcomingJob && (
        <div className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-300 dark:border-amber-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              🔔
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  {t.dashboard.upcomingAlert}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                  {upcomingJob.time}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {t.dashboard.upcomingDesc
                  .replace('{time}', upcomingJob.time)
                  .replace('{name}', upcomingJob.customerName)
                  .replace('{service}', t.services[upcomingJob.serviceType])}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <a
              href={`tel:${upcomingJob.phone.replace(/\s+/g, '')}`}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t.actions.call}</span>
            </a>
            <button
              onClick={() => openOrderDetailModal(upcomingJob)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {t.actions.viewDetails}
            </button>
          </div>
        </div>
      )}

      {/* 5 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 hover:shadow-md ${card.bg}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                {card.icon}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
            <div className="text-2xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {card.value}
            </div>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 truncate">
              {card.title}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{t.dashboard.quickActions}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openNewOrderModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.actions.newOrder}</span>
          </button>
          <button
            onClick={() => openNewCustomerModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.actions.newCustomer}</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.dashboard.viewSchedule}</span>
          </button>
        </div>
      </div>

      {/* Bugungi ishlar (Today's jobs list) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t.dashboard.todayJobs}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                {todayOrders.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {new Date().toLocaleDateString(
                'uz-UZ',
                { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
              )}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{t.actions.all}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {todayOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-3xl mx-auto mb-3">
              🎉
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {t.dashboard.noJobsToday}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Bugun uchun rejalashtirilgan ishlar yo‘q. Yangi buyurtma qabul qilish uchun quyidagi tugmani bosing.
            </p>
            <button
              onClick={() => openNewOrderModal()}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t.actions.newOrder}</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {todayOrders
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((order) => {
                const statusMeta = getStatusMeta(order.status);
                const serviceMeta = getServiceMeta(order.serviceType);

                return (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Left: Time + Service Icon + Customer Info */}
                    <div className="flex items-start sm:items-center gap-3.5">
                      {/* Time pill */}
                      <div className="flex flex-col items-center justify-center w-14 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs shrink-0">
                        <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mb-0.5" />
                        <span>{order.time}</span>
                      </div>

                      {/* Service Icon */}
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0 shadow-xs">
                        {serviceMeta.icon}
                      </div>

                      {/* Name, Service & Address */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {order.customerName}
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {t.services[order.serviceType]}
                          </span>
                        </div>

                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5 line-clamp-1">
                          {order.description}
                        </p>

                        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-xs">{order.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Price, Status selector, Quick Call & Details */}
                    <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                      {/* Price */}
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900 dark:text-white">
                          {formatCurrency(order.price, profile.currency)}
                        </div>
                      </div>

                      {/* Status select pill */}
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className={`text-xs font-bold py-1.5 px-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusMeta.badgeClass}`}
                      >
                        <option value="pending">🟡 {t.status.pending}</option>
                        <option value="in_progress">🔵 {t.status.in_progress}</option>
                        <option value="completed">🟢 {t.status.completed}</option>
                        <option value="cancelled">🔴 {t.status.cancelled}</option>
                      </select>

                      {/* Phone call shortcut */}
                      <a
                        href={`tel:${order.phone.replace(/\s+/g, '')}`}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950/40 dark:text-slate-300 dark:hover:text-emerald-300 transition-colors"
                        title={t.actions.call}
                      >
                        <Phone className="w-4 h-4" />
                      </a>

                      {/* View details */}
                      <button
                        onClick={() => openOrderDetailModal(order)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {t.actions.viewDetails}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Mini overview widgets: Schedule highlights & Service highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Next 3 days scheduled overview */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.dashboard.scheduleSummary}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t.dashboard.viewSchedule}
            </button>
          </div>

          <div className="space-y-2.5">
            {orders
              .filter((o) => o.status !== 'cancelled' && o.status !== 'completed')
              .slice(0, 3)
              .map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => openOrderDetailModal(ord)}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getServiceMeta(ord.serviceType).icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {ord.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {ord.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {ord.date === todayStr ? t.actions.today : ord.date}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {ord.time}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quick revenue highlight card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.dashboard.weeklyOverview}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('revenue')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {t.nav.revenue}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                {t.revenue.completedJobs}
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {completedOrders.length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                {t.revenue.totalRevenue}
              </span>
              <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 truncate">
                {formatCurrency(
                  completedOrders.reduce((sum, o) => sum + o.price, 0),
                  profile.currency
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
