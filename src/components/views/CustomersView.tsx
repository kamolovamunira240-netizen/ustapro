import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Plus,
  Phone,
  MapPin,
  Calendar,
  Coins,
  Edit2,
  Trash2,
  PlusCircle,
  FileText,
} from 'lucide-react';
import { formatCurrency, formatDateDisplay } from '../../utils/formatters';

export const CustomersView: React.FC = () => {
  const {
    t,
    language,
    customers,
    orders,
    profile,
    openNewCustomerModal,
    openEditCustomerModal,
    deleteCustomer,
    openNewOrderModal,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats per customer
  const customerStats = customers.map((c) => {
    const custOrders = orders.filter((o) => o.customerId === c.id);
    const completedOrders = custOrders.filter((o) => o.status === 'completed');
    const totalSpent = completedOrders.reduce((sum, o) => sum + o.price, 0);

    const sortedOrders = [...custOrders].sort((a, b) => b.date.localeCompare(a.date));
    const lastOrder = sortedOrders[0];

    return {
      ...c,
      totalOrdersCount: custOrders.length,
      totalSpent,
      lastOrderDate: lastOrder ? lastOrder.date : null,
      lastOrderService: lastOrder ? lastOrder.serviceType : null,
    };
  });

  // Filter by search query (name, phone, address)
  const filteredCustomers = customerStats.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q) ||
      (c.notes && c.notes.toLowerCase().includes(q))
    );
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`${name}: ${t.actions.confirmDelete}`)) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header controls & stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.customers.title}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              {customers.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.customers.subtitle}
          </p>
        </div>

        <button
          onClick={openNewCustomerModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.actions.newCustomer}</span>
        </button>
      </div>

      {/* Search Input bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.actions.searchPlaceholder}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {t.actions.close}
          </button>
        )}
      </div>

      {/* Customers Cards Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mx-auto mb-3">
            👥
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {t.customers.empty}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Qidiruv bo‘yicha hech qanday mijoz topilmadi yoki hali mijoz qo‘shilmagan.
          </p>
          <button
            onClick={openNewCustomerModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{t.actions.newCustomer}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top card info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                        {customer.name}
                      </h3>
                      <a
                        href={`tel:${customer.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-0.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{customer.phone}</span>
                      </a>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditCustomerModal(customer)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title={t.actions.edit}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id, customer.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      title={t.actions.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-3.5 flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
                    {customer.address}
                  </p>
                </div>

                {/* Notes if any */}
                {customer.notes && (
                  <div className="mt-2 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 italic px-1">
                    <FileText className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{customer.notes}</span>
                  </div>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {t.customers.totalOrders}
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                      {customer.totalOrdersCount}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {t.customers.totalSpent}
                    </span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block truncate">
                      {formatCurrency(customer.totalSpent, profile.currency)}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {t.customers.lastOrder}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-0.5 block truncate">
                      {customer.lastOrderDate
                        ? formatDateDisplay(customer.lastOrderDate, language)
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Order Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={`tel:${customer.phone.replace(/\s+/g, '')}`}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.actions.call}</span>
                </a>

                <button
                  onClick={() => openNewOrderModal(customer.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{t.customers.createOrderForCustomer}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
