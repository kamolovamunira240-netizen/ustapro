import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Coins,
  FileText,
  UserPlus,
} from 'lucide-react';
import { OrderStatus, ServiceType } from '../../types';
import { serviceIcons } from '../../i18n/translations';

export const OrderModal: React.FC = () => {
  const {
    t,
    isOrderModalOpen,
    closeOrderModal,
    editingOrder,
    customers,
    addOrder,
    updateOrder,
    addCustomer,
    showToast,
  } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [isCreatingNewCustomer, setIsCreatingNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('+998 ');

  const [address, setAddress] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('ac');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('14:00');
  const [price, setPrice] = useState<number>(250000);
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingOrder) {
      setSelectedCustomerId(editingOrder.customerId || '');
      setIsCreatingNewCustomer(false);
      setNewCustomerName(editingOrder.customerName || '');
      setNewCustomerPhone(editingOrder.phone || '');
      setAddress(editingOrder.address || '');
      setServiceType(editingOrder.serviceType || 'ac');
      setDescription(editingOrder.description || '');
      setDate(editingOrder.date || new Date().toISOString().slice(0, 10));
      setTime(editingOrder.time || '14:00');
      setPrice(editingOrder.price || 0);
      setStatus(editingOrder.status || 'pending');
      setNotes(editingOrder.notes || '');
    } else {
      // New order
      if (customers.length > 0) {
        setSelectedCustomerId(customers[0].id);
        setIsCreatingNewCustomer(false);
        setAddress(customers[0].address);
      } else {
        setIsCreatingNewCustomer(true);
        setSelectedCustomerId('');
        setAddress('');
      }
      setNewCustomerName('');
      setNewCustomerPhone('+998 ');
      setServiceType('ac');
      setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
      setTime('14:00');
      setPrice(250000);
      setStatus('pending');
      setNotes('');
    }
    setErrors({});
  }, [editingOrder, isOrderModalOpen, customers]);

  if (!isOrderModalOpen) return null;

  const handleCustomerSelectChange = (custId: string) => {
    if (custId === 'new') {
      setIsCreatingNewCustomer(true);
      setSelectedCustomerId('');
      setAddress('');
    } else {
      setIsCreatingNewCustomer(false);
      setSelectedCustomerId(custId);
      const chosen = customers.find((c) => c.id === custId);
      if (chosen) {
        setAddress(chosen.address);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    let custName = '';
    let custPhone = '';
    let custId = selectedCustomerId;

    if (isCreatingNewCustomer || customers.length === 0) {
      if (!newCustomerName.trim()) {
        newErrors.customerName = t.msg.requiredFields;
      }
      if (!newCustomerPhone.trim() || newCustomerPhone.trim().length < 9) {
        newErrors.customerPhone = t.msg.invalidPhone;
      }
      custName = newCustomerName.trim();
      custPhone = newCustomerPhone.trim();
    } else {
      const selected = customers.find((c) => c.id === selectedCustomerId);
      if (!selected) {
        newErrors.customerId = t.msg.requiredFields;
      } else {
        custName = selected.name;
        custPhone = selected.phone;
      }
    }

    if (!address.trim()) {
      newErrors.address = t.msg.requiredFields;
    }
    if (!description.trim()) {
      newErrors.description = t.msg.requiredFields;
    }
    if (!date) {
      newErrors.date = t.msg.requiredFields;
    }
    if (!time) {
      newErrors.time = t.msg.requiredFields;
    }
    if (price <= 0 || isNaN(price)) {
      newErrors.price = t.msg.invalidPrice;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(t.msg.requiredFields, 'error');
      return;
    }

    // If new customer was created on the fly, save customer to list
    if (isCreatingNewCustomer || !custId) {
      const createdCustomer = addCustomer({
        name: custName,
        phone: custPhone,
        address: address.trim(),
        notes: 'Buyurtma orqali kiritildi',
      });
      custId = createdCustomer.id;
    }

    if (editingOrder && editingOrder.id) {
      updateOrder(editingOrder.id, {
        customerId: custId,
        customerName: custName,
        phone: custPhone,
        address: address.trim(),
        serviceType,
        description: description.trim(),
        date,
        time,
        price,
        status,
        notes: notes.trim(),
      });
    } else {
      addOrder({
        customerId: custId,
        customerName: custName,
        phone: custPhone,
        address: address.trim(),
        serviceType,
        description: description.trim(),
        date,
        time,
        price,
        status,
        notes: notes.trim(),
      });
    }

    closeOrderModal();
  };

  const serviceOptions: { type: ServiceType; label: string; icon: string }[] = [
    { type: 'electric', label: t.services.electric, icon: serviceIcons.electric },
    { type: 'plumbing', label: t.services.plumbing, icon: serviceIcons.plumbing },
    { type: 'ac', label: t.services.ac, icon: serviceIcons.ac },
    { type: 'computer', label: t.services.computer, icon: serviceIcons.computer },
    { type: 'repair', label: t.services.repair, icon: serviceIcons.repair },
    { type: 'other', label: t.services.other, icon: serviceIcons.other },
  ];

  const statusOptions: { value: OrderStatus; label: string; dot: string }[] = [
    { value: 'pending', label: t.status.pending, dot: '🟡' },
    { value: 'in_progress', label: t.status.in_progress, dot: '🔵' },
    { value: 'completed', label: t.status.completed, dot: '🟢' },
    { value: 'cancelled', label: t.status.cancelled, dot: '🔴' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingOrder && editingOrder.id ? t.orders.editTitle : t.orders.addTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.orders.subtitle}
            </p>
          </div>
          <button
            onClick={closeOrderModal}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Customer Selection or New Customer */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t.orders.client} <span className="text-rose-500">*</span>
              </label>

              {customers.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCreatingNewCustomer(!isCreatingNewCustomer)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {isCreatingNewCustomer ? t.customers.selectCustomer : t.customers.orCreateNew}
                </button>
              )}
            </div>

            {!isCreatingNewCustomer && customers.length > 0 ? (
              <div>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleCustomerSelectChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                  <option value="new">+ {t.actions.newCustomer}...</option>
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      placeholder="Mijoz ismi (masalan: Azizbek Karimov)"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.customerName && (
                    <p className="mt-1 text-xs text-rose-500">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.customerPhone && (
                    <p className="mt-1 text-xs text-rose-500">{errors.customerPhone}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Service Type Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.orders.serviceType} <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {serviceOptions.map((opt) => {
                const isSelected = serviceType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setServiceType(opt.type)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 text-blue-700 dark:bg-blue-950/60 dark:border-blue-400 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              {t.orders.description} <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masalan: Konditsioner ta’miri, kompressor diagnostikasi va freon to‘ldirish"
              rows={2}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.description
                  ? 'border-rose-300 dark:border-rose-700'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              {t.customers.address} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Toshkent sh., Chilonzor 9-mavze, 12-uy, 45-xonadon"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.address
                    ? 'border-rose-300 dark:border-rose-700'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-xs text-rose-500">{errors.address}</p>
            )}
          </div>

          {/* Date, Time & Price in 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {t.orders.date} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {t.orders.time} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {t.orders.price} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="250 000"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price
                      ? 'border-rose-300 dark:border-rose-700'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Status selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              {t.orders.status}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statusOptions.map((st) => {
                const isSelected = status === st.value;
                return (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => setStatus(st.value)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <span>{st.dot}</span>
                    <span className="truncate">{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              {t.orders.notes}
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Qo‘shimcha ma’lumotlar (masalan: mijoz 14:00 da kutadi, asboblar va ehtiyot qismlar kerak)"
                rows={2}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={closeOrderModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              {t.actions.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
