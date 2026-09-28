import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Coins,
  Filter,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';
import { formatCurrency, formatDateDisplay, getServiceMeta, getStatusMeta } from '../../utils/formatters';
import { OrderStatus, ServiceType } from '../../types';
import { serviceIcons } from '../../i18n/translations';

export const OrdersView: React.FC = () => {
  const {
    t,
    language,
    orders,
    profile,
    openNewOrderModal,
    openEditOrderModal,
    openOrderDetailModal,
    updateOrderStatus,
    deleteOrder,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  // Filtering
  const filteredOrders = orders.filter((order) => {
    // 1. Search query
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const match =
        order.customerName.toLowerCase().includes(q) ||
        order.phone.toLowerCase().includes(q) ||
        order.address.toLowerCase().includes(q) ||
        order.description.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Status
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }

    // 3. Service
    if (serviceFilter !== 'all' && order.serviceType !== serviceFilter) {
      return false;
    }

    // 4. Date
    if (dateFilter === 'today' && order.date !== todayStr) {
      return false;
    }
    if (dateFilter === 'tomorrow' && order.date !== tomorrowStr) {
      return false;
    }
    if (dateFilter === 'thisWeek') {
      const orderDate = new Date(order.date);
      const now = new Date();
      const diffDays = (orderDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
      if (diffDays < -3 || diffDays > 7) return false;
    }

    return true;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.actions.confirmDelete)) {
      deleteOrder(id);
    }
  };

  const handleEdit = (order: any, e: React.MouseEvent) => {
    e.stopPropagation();
    openEditOrderModal(order);
  };

  const serviceOptions: { value: string; label: string; icon: string }[] = [
    { value: 'all', label: t.actions.all, icon: '🌟' },
    { value: 'electric', label: t.services.electric, icon: serviceIcons.electric },
    { value: 'plumbing', label: t.services.plumbing, icon: serviceIcons.plumbing },
    { value: 'ac', label: t.services.ac, icon: serviceIcons.ac },
    { value: 'computer', label: t.services.computer, icon: serviceIcons.computer },
    { value: 'repair', label: t.services.repair, icon: serviceIcons.repair },
    { value: 'other', label: t.services.other, icon: serviceIcons.other },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header title & add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.orders.title}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              {filteredOrders.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.orders.subtitle}
          </p>
        </div>

        <button
          onClick={() => openNewOrderModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.actions.newOrder}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.actions.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Status Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              <Filter className="w-3 h-3 inline mr-1" />
              {t.orders.filterByStatus}:
            </span>
            {[
              { val: 'all', label: t.actions.all },
              { val: 'pending', label: `🟡 ${t.status.pending}` },
              { val: 'in_progress', label: `🔵 ${t.status.in_progress}` },
              { val: 'completed', label: `🟢 ${t.status.completed}` },
              { val: 'cancelled', label: `🔴 ${t.status.cancelled}` },
            ].map((st) => (
              <button
                key={st.val}
                onClick={() => setStatusFilter(st.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === st.val
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1"></div>

          {/* Date Filter */}
          <div className="flex items-center gap-1">
            {[
              { val: 'all', label: t.actions.all },
              { val: 'today', label: t.actions.today },
              { val: 'tomorrow', label: t.actions.tomorrow },
              { val: 'thisWeek', label: t.actions.thisWeek },
            ].map((df) => (
              <button
                key={df.val}
                onClick={() => setDateFilter(df.val)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  dateFilter === df.val
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {df.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1"></div>

          {/* Service Filter dropdown */}
          <div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {serviceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mx-auto mb-3">
            📋
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {t.orders.empty}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Belgilangan filtrlar bo‘yicha buyurtmalar topilmadi.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setServiceFilter('all');
              setDateFilter('all');
            }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold"
          >
            Filtrni tozalash
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders
            .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
            .map((order) => {
              const statusMeta = getStatusMeta(order.status);
              const serviceMeta = getServiceMeta(order.serviceType);

              return (
                <div
                  key={order.id}
                  onClick={() => openOrderDetailModal(order)}
                  className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left block: ID, icon, client name, service, description */}
                  <div className="flex items-start gap-3.5">
                    {/* Service Icon with ID badge */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
                        {serviceMeta.icon}
                      </div>
                      <span className="text-[10px] font-black tracking-tight text-slate-400">
                        {order.id}
                      </span>
                    </div>

                    {/* Customer & Job details */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {order.customerName}
                        </h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {t.services[order.serviceType]}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mt-1 line-clamp-1">
                        {order.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[220px] sm:max-w-xs">{order.address}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          <span>{order.time}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDateDisplay(order.date, language)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right block: Price, Status selector, Action buttons */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800"
                  >
                    {/* Price */}
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        {t.orders.price}
                      </span>
                      <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {formatCurrency(order.price, profile.currency)}
                      </div>
                    </div>

                    {/* Status dropdown */}
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold py-1.5 px-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusMeta.badgeClass}`}
                    >
                      <option value="pending">🟡 {t.status.pending}</option>
                      <option value="in_progress">🔵 {t.status.in_progress}</option>
                      <option value="completed">🟢 {t.status.completed}</option>
                      <option value="cancelled">🔴 {t.status.cancelled}</option>
                    </select>

                    {/* Phone call */}
                    <a
                      href={`tel:${order.phone.replace(/\s+/g, '')}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950/40 dark:text-slate-300 dark:hover:text-emerald-300 transition-colors"
                      title={t.actions.call}
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    {/* Edit button */}
                    <button
                      onClick={(e) => handleEdit(order, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={t.actions.edit}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDelete(order.id, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title={t.actions.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
