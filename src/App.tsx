import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { OrderModal } from './components/modals/OrderModal';
import { CustomerModal } from './components/modals/CustomerModal';
import { OrderDetailModal } from './components/modals/OrderDetailModal';

import { DashboardView } from './components/views/DashboardView';
import { CustomersView } from './components/views/CustomersView';
import { OrdersView } from './components/views/OrdersView';
import { ScheduleView } from './components/views/ScheduleView';
import { RevenueView } from './components/views/RevenueView';
import { SettingsView } from './components/views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'customers':
        return <CustomersView />;
      case 'orders':
        return <OrdersView />;
      case 'schedule':
        return <ScheduleView />;
      case 'revenue':
        return <RevenueView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors selection:bg-blue-500 selection:text-white">
      {/* Sidebar navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky top header with lang switcher, dark mode toggle, and quick add button */}
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dynamic page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <OrderModal />
      <CustomerModal />
      <OrderDetailModal />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
