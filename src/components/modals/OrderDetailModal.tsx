import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Clock,
  Coins,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency, formatDateDisplay, getServiceMeta, getStatusMeta } from '../../utils/formatters';
import { OrderStatus } from '../../types';

export const OrderDetailModal: React.FC = () => {
  const {
    t,
    language,
    profile,
    selectedOrderDetail,
    closeOrderDetailModal,
    updateOrderStatus,
    openEditOrderModal,
    deleteOrder,
    showToast,
  } = useApp();

  if (!selectedOrderDetail) return null;

  const order = selectedOrderDetail;
  const statusMeta = getStatusMeta(order.status);
  const serviceMeta = getServiceMeta(order.serviceType);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(order.address);
    showToast(t.actions.addressCopied, 'success');
  };

  const handleDelete = () => {
    if (window.confirm(t.actions.confirmDelete)) {
      deleteOrder(order.id);
      closeOrderDetailModal();
    }
  };

  const handleEdit = () => {
    closeOrderDetailModal();
    openEditOrderModal(order);
  };

  const statuses: { key: OrderStatus; label: string; icon: string }[] = [
    { key: 'pending', label: t.status.pending, icon: '🟡' },
    { key: 'in_progress', label: t.status.in_progress, icon: '🔵' },
    { key: 'completed', label: t.status.completed, icon: '🟢' },
    { key: 'cancelled', label: t.status.cancelled, icon: '🔴' },
  ];

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(order.address)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg">
              {order.id}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusMeta.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`}></span>
              {t.status[order.status]}
            </span>
          </div>

          <button
            onClick={closeOrderDetailModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Service & Description banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{serviceMeta.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.services[order.serviceType]}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {order.description}
            </h4>
          </div>

          {/* Quick status change buttons */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {t.actions.changeStatus}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statuses.map((s) => (
                <button
                  key={s.key}
                  onClick={() => updateOrderStatus(order.id, s.key)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    order.status === s.key
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customer info card with instant actions */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t.orders.client}
                </span>
                <h5 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {order.customerName}
                </h5>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {order.phone}
                </p>
              </div>

              {/* Contact shortcut buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${order.phone.replace(/\s+/g, '')}`}
                  className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/30 transition-all flex items-center gap-1.5 text-xs font-bold"
                  title="Qo‘ng‘iroq qilish"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.actions.call}</span>
                </a>
                <a
                  href={`sms:${order.phone.replace(/\s+/g, '')}`}
                  className="p-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-sm shadow-blue-500/30 transition-all flex items-center gap-1.5 text-xs font-bold"
                  title="SMS yozish"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.actions.sms}</span>
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {order.address}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 pl-6">
                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Copy className="w-3 h-3" />
                  <span>{t.actions.copyAddress}</span>
                </button>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Time & Price details grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t.orders.date} & {t.orders.time}
              </span>
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold text-sm">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{order.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDateDisplay(order.date, language)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                {t.orders.price}
              </span>
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-black text-base">
                <Coins className="w-4 h-4" />
                <span>{formatCurrency(order.price, profile.currency)}</span>
              </div>
            </div>
          </div>

          {/* Notes if any */}
          {order.notes && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t.orders.notes}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{order.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Modal actions footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.actions.delete}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={closeOrderDetailModal}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              {t.actions.close}
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t.actions.edit}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
