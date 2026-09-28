import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ActiveTab,
  Customer,
  Language,
  Order,
  OrderStatus,
  TechnicianProfile,
  Theme,
  ToastNotification,
} from '../types';
import { defaultCustomers, defaultProfile, getDefaultOrders } from '../data/mockData';
import { translations } from '../i18n/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['uz'];
  theme: Theme;
  toggleTheme: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  customers: Customer[];
  orders: Order[];
  profile: TechnicianProfile;

  addCustomer: (data: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  addOrder: (data: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrder: (id: string, data: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;

  updateProfile: (profile: TechnicianProfile) => void;
  resetToDemoData: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonStr: string) => boolean;

  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Modals state
  isOrderModalOpen: boolean;
  editingOrder: Order | null;
  openNewOrderModal: (defaultCustomerId?: string) => void;
  openEditOrderModal: (order: Order) => void;
  closeOrderModal: () => void;

  isCustomerModalOpen: boolean;
  editingCustomer: Customer | null;
  openNewCustomerModal: () => void;
  openEditCustomerModal: (customer: Customer) => void;
  closeCustomerModal: () => void;

  selectedOrderDetail: Order | null;
  openOrderDetailModal: (order: Order) => void;
  closeOrderDetailModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ustapro_lang') as Language;
    return saved && ['uz', 'ru', 'en'].includes(saved) ? saved : 'uz';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ustapro_lang', lang);
  };

  const t = translations[language] || translations.uz;

  // 2. Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('ustapro_theme') as Theme;
    if (saved && (saved === 'dark' || saved === 'light')) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    localStorage.setItem('ustapro_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 3. Active tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // 4. Customers state
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('ustapro_customers');
      return saved ? JSON.parse(saved) : defaultCustomers;
    } catch {
      return defaultCustomers;
    }
  });

  useEffect(() => {
    localStorage.setItem('ustapro_customers', JSON.stringify(customers));
  }, [customers]);

  // 5. Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ustapro_orders');
      return saved ? JSON.parse(saved) : getDefaultOrders();
    } catch {
      return getDefaultOrders();
    }
  });

  useEffect(() => {
    localStorage.setItem('ustapro_orders', JSON.stringify(orders));
  }, [orders]);

  // 6. Profile state
  const [profile, setProfile] = useState<TechnicianProfile>(() => {
    try {
      const saved = localStorage.getItem('ustapro_profile');
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  useEffect(() => {
    localStorage.setItem('ustapro_profile', JSON.stringify(profile));
  }, [profile]);

  // 7. Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 8. CRUD Customers
  const addCustomer = (data: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newCust: Customer = {
      ...data,
      id: 'cust-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast(t.msg.savedSuccessfully, 'success');
    return newCust;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    // Also sync customer name and phone in orders if changed
    if (data.name || data.phone || data.address) {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.customerId === id) {
            return {
              ...o,
              customerName: data.name ?? o.customerName,
              phone: data.phone ?? o.phone,
              address: data.address ?? o.address,
            };
          }
          return o;
        })
      );
    }
    showToast(t.msg.savedSuccessfully, 'success');
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast(t.msg.deletedSuccessfully, 'info');
  };

  // 9. CRUD Orders
  const addOrder = (data: Omit<Order, 'id' | 'createdAt'>): Order => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newOrder: Order = {
      ...data,
      id: `UP-${randomSuffix}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setOrders((prev) => [newOrder, ...prev]);
    showToast(t.msg.savedSuccessfully, 'success');
    return newOrder;
  };

  const updateOrder = (id: string, data: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...data } : o))
    );
    if (selectedOrderDetail && selectedOrderDetail.id === id) {
      setSelectedOrderDetail((prev) => (prev ? { ...prev, ...data } : null));
    }
    showToast(t.msg.savedSuccessfully, 'success');
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    if (selectedOrderDetail && selectedOrderDetail.id === id) {
      setSelectedOrderDetail((prev) => (prev ? { ...prev, status } : null));
    }
    showToast(t.msg.statusUpdated, 'success');
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    if (selectedOrderDetail?.id === id) {
      setSelectedOrderDetail(null);
    }
    showToast(t.msg.deletedSuccessfully, 'info');
  };

  const updateProfile = (newProfile: TechnicianProfile) => {
    setProfile(newProfile);
    showToast(t.msg.savedSuccessfully, 'success');
  };

  // 10. Backup & Reset
  const resetToDemoData = () => {
    setCustomers(defaultCustomers);
    setOrders(getDefaultOrders());
    setProfile(defaultProfile);
    showToast(t.msg.demoRestored, 'info');
  };

  const exportDataJSON = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      customers,
      orders,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ustapro_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t.actions.exportData, 'success');
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.customers) && Array.isArray(data.orders)) {
        setCustomers(data.customers);
        setOrders(data.orders);
        if (data.profile) setProfile(data.profile);
        showToast(t.settings.importSuccess, 'success');
        return true;
      }
      showToast(t.settings.importError, 'error');
      return false;
    } catch {
      showToast(t.settings.importError, 'error');
      return false;
    }
  };

  // 11. Modals management
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const openNewOrderModal = (defaultCustomerId?: string) => {
    if (defaultCustomerId) {
      const cust = customers.find((c) => c.id === defaultCustomerId);
      if (cust) {
        setEditingOrder({
          id: '',
          customerId: cust.id,
          customerName: cust.name,
          phone: cust.phone,
          address: cust.address,
          serviceType: 'repair',
          description: '',
          date: new Date().toISOString().slice(0, 10),
          time: '12:00',
          price: 150000,
          status: 'pending',
          createdAt: '',
        });
        setIsOrderModalOpen(true);
        return;
      }
    }
    setEditingOrder(null);
    setIsOrderModalOpen(true);
  };

  const openEditOrderModal = (order: Order) => {
    setEditingOrder(order);
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setEditingOrder(null);
  };

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const openNewCustomerModal = () => {
    setEditingCustomer(null);
    setIsCustomerModalOpen(true);
  };

  const openEditCustomerModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
    setEditingCustomer(null);
  };

  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);
  const openOrderDetailModal = (order: Order) => {
    setSelectedOrderDetail(order);
  };
  const closeOrderDetailModal = () => {
    setSelectedOrderDetail(null);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        customers,
        orders,
        profile,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,
        updateProfile,
        resetToDemoData,
        exportDataJSON,
        importDataJSON,
        toasts,
        showToast,
        removeToast,
        isOrderModalOpen,
        editingOrder,
        openNewOrderModal,
        openEditOrderModal,
        closeOrderModal,
        isCustomerModalOpen,
        editingCustomer,
        openNewCustomerModal,
        openEditCustomerModal,
        closeCustomerModal,
        selectedOrderDetail,
        openOrderDetailModal,
        closeOrderDetailModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
