import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Phone, MapPin, FileText } from 'lucide-react';

export const CustomerModal: React.FC = () => {
  const {
    t,
    isCustomerModalOpen,
    closeCustomerModal,
    editingCustomer,
    addCustomer,
    updateCustomer,
    showToast,
  } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setPhone(editingCustomer.phone);
      setAddress(editingCustomer.address);
      setNotes(editingCustomer.notes || '');
    } else {
      setName('');
      setPhone('+998 ');
      setAddress('');
      setNotes('');
    }
    setErrors({});
  }, [editingCustomer, isCustomerModalOpen]);

  if (!isCustomerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = t.msg.requiredFields;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      newErrors.phone = t.msg.invalidPhone;
    }
    if (!address.trim()) {
      newErrors.address = t.msg.requiredFields;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(t.msg.requiredFields, 'error');
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
      });
    } else {
      addCustomer({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
      });
    }

    closeCustomerModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingCustomer ? t.customers.editTitle : t.customers.addTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.customers.subtitle}
            </p>
          </div>
          <button
            onClick={closeCustomerModal}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              {t.customers.name} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Azizbek Karimov"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.name
                    ? 'border-rose-300 dark:border-rose-700'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              {t.customers.phone} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.phone
                    ? 'border-rose-300 dark:border-rose-700'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              {t.customers.address} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Toshkent sh., Chilonzor 9-mavze, 12-uy..."
                rows={2}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.address
                    ? 'border-rose-300 dark:border-rose-700'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.address && <p className="mt-1 text-xs text-rose-500">{errors.address}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              {t.customers.notes}
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mijoz haqida qo‘shimcha eslatma (masalan: 3-qavat, domofon kodi 45K)"
                rows={2}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={closeCustomerModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              {t.actions.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
