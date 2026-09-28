import { Language } from '../types';

export const translations = {
  uz: {
    // Brand
    brandName: 'UstaPro',
    brandTagline: 'Ustalar uchun xizmat boshqaruvi',

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      customers: 'Mijozlar',
      orders: 'Buyurtmalar',
      schedule: 'Ish jadvali',
      revenue: 'Daromad',
      settings: 'Sozlamalar',
    },

    // Actions
    actions: {
      newOrder: '+ Yangi buyurtma',
      newCustomer: '+ Yangi mijoz',
      edit: 'Tahrirlash',
      delete: 'O‘chirish',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      call: 'Qo‘ng‘iroq',
      sms: 'SMS',
      viewDetails: 'Batafsil',
      filter: 'Filtrlash',
      search: 'Qidirish...',
      searchPlaceholder: 'Ism, telefon yoki manzil bo‘yicha qidirish...',
      close: 'Yopish',
      confirmDelete: 'Rostdan ham o‘chirmoqchimisiz?',
      copyAddress: 'Manzilni nusxalash',
      addressCopied: 'Manzil nusxalandi!',
      exportData: 'Ma’lumotlarni yuklab olish (JSON)',
      importData: 'Ma’lumotlarni tiklash (JSON)',
      resetDemo: 'Demo ma’lumotlarni qayta tiklash',
      all: 'Barchasi',
      today: 'Bugun',
      tomorrow: 'Ertaga',
      thisWeek: 'Shu hafta',
      thisMonth: 'Shu oy',
      dayView: 'Kunlik',
      weekView: 'Haftalik',
      back: 'Orqaga',
      changeStatus: 'Statusni o‘zgartirish',
    },

    // Dashboard
    dashboard: {
      title: 'Boshqaruv paneli',
      subtitle: 'Bugungi ishlar va umumiy statistikalar',
      todayOrders: 'Bugungi buyurtmalar',
      pendingOrders: 'Kutilayotgan buyurtmalar',
      completedOrders: 'Bajarilgan buyurtmalar',
      todayRevenue: 'Bugungi daromad',
      totalCustomers: 'Umumiy mijozlar soni',
      todayJobs: 'Bugungi ishlar',
      noJobsToday: 'Bugun uchun rejalashtirilgan buyurtmalar yo‘q',
      upcomingAlert: 'Yaqinlashayotgan buyurtma',
      upcomingDesc: '{time} da {name} uchun {service} buyurtmasi bor.',
      quickActions: 'Tezkor amallar',
      recentOrders: 'So‘nggi buyurtmalar',
      scheduleSummary: 'Kun tartibi',
      viewSchedule: 'Jadvalni to‘liq ko‘rish',
      weeklyOverview: 'Haftalik ko‘rsatkich',
    },

    // Statuses
    status: {
      pending: 'Kutilmoqda',
      in_progress: 'Jarayonda',
      completed: 'Bajarildi',
      cancelled: 'Bekor qilindi',
    },

    // Services
    services: {
      electric: 'Elektrik',
      plumbing: 'Santexnik',
      ac: 'Konditsioner',
      computer: 'Kompyuter',
      repair: 'Ta’mirlash',
      other: 'Boshqa',
    },

    // Customers
    customers: {
      title: 'Mijozlar bazasi',
      subtitle: 'Barcha mijozlar, ularning manzillari va buyurtma tarixi',
      name: 'Ism',
      phone: 'Telefon raqami',
      address: 'Manzil',
      lastOrder: 'Oxirgi buyurtma',
      totalOrders: 'Jami buyurtmalar',
      totalSpent: 'Jami to‘lov',
      notes: 'Izoh / Qo‘shimcha ma’lumot',
      addTitle: 'Yangi mijoz qo‘shish',
      editTitle: 'Mijoz ma’lumotlarini tahrirlash',
      empty: 'Mijozlar topilmadi',
      createOrderForCustomer: 'Buyurtma yaratish',
      selectCustomer: 'Mijozni tanlang',
      orCreateNew: 'yoki yangi mijoz kiritilsin',
    },

    // Orders
    orders: {
      title: 'Buyurtmalar ro‘yxati',
      subtitle: 'Barcha buyurtmalarni filtrlash, ko‘rish va yangilash',
      orderId: 'Buyurtma ID',
      client: 'Mijoz',
      serviceType: 'Xizmat turi',
      description: 'Ish tavsifi',
      date: 'Sana',
      time: 'Boshlanish vaqti',
      price: 'Narx (so‘m)',
      status: 'Status',
      notes: 'Qo‘shimcha izoh',
      addTitle: 'Yangi buyurtma yaratish',
      editTitle: 'Buyurtmani tahrirlash',
      detailsTitle: 'Buyurtma tafsilotlari',
      empty: 'Buyurtmalar topilmadi',
      filterByStatus: 'Status bo‘yicha',
      filterByService: 'Xizmat bo‘yicha',
      filterByDate: 'Sana bo‘yicha',
    },

    // Schedule
    schedule: {
      title: 'Ish jadvali',
      subtitle: 'Kunlik va haftalik rejalashtirish taqvimi',
      noJobsAtTime: 'Bo‘sh vaqt',
      jobsForDay: 'kungi buyurtmalar',
    },

    // Revenue
    revenue: {
      title: 'Daromad va moliya',
      subtitle: 'Xizmatlardan tushgan daromad tahlili',
      todayRevenue: 'Bugungi daromad',
      weeklyRevenue: 'Haftalik daromad',
      monthlyRevenue: 'Oylik daromad',
      totalRevenue: 'Umumiy daromad',
      period: 'Davr',
      revenueChart: 'Daromad dinamikasi',
      byService: 'Xizmat turlari bo‘yicha taqsimot',
      completedJobs: 'Bajarilgan buyurtmalar',
      averageTicket: 'O‘rtacha buyurtma qiymati',
      paymentHistory: 'To‘lovlar tarixi',
    },

    // Settings
    settings: {
      title: 'Sozlamalar',
      subtitle: 'Profil, til va tizim konfiguratsiyasi',
      language: 'Til (Language)',
      theme: 'Tema (Ko‘rinish)',
      lightMode: '☀️ Light Mode (Yorug‘)',
      darkMode: '🌙 Dark Mode (Qorong‘u)',
      profile: 'Usta profili',
      name: 'Usta ismi',
      phone: 'Telefon',
      specialty: 'Mutaxassislik',
      workHours: 'Ish vaqti',
      currency: 'Valyuta',
      dataManagement: 'Ma’lumotlar xavfsizligi va zaxira',
      dataInfo: 'Barcha mijozlar, buyurtmalar va narxlar brauzeringiz xotirasida xavfsiz saqlanadi.',
      resetConfirm: 'Rostdan ham barcha ma’lumotlarni demo holatiga qaytarmoqchimisiz?',
      importSuccess: 'Ma’lumotlar muvaffaqiyatli tiklandi!',
      importError: 'Fayl formati noto‘g‘ri!',
    },

    // Validation & Messages
    msg: {
      savedSuccessfully: 'Muvaffaqiyatli saqlandi!',
      deletedSuccessfully: 'Muvaffaqiyatli o‘chirildi!',
      requiredFields: 'Iltimos, barcha majburiy maydonlarni to‘ldiring!',
      invalidPhone: 'Telefon raqamini to‘g‘ri kiriting!',
      invalidPrice: 'Narx 0 dan katta bo‘lishi kerak!',
      statusUpdated: 'Status yangilandi!',
      demoRestored: 'Demo ma’lumotlar qayta tiklandi!',
    },
  },

  ru: {
    // Brand
    brandName: 'UstaPro',
    brandTagline: 'Управление услугами для мастеров',

    // Navigation
    nav: {
      dashboard: 'Дашборд',
      customers: 'Клиенты',
      orders: 'Заказы',
      schedule: 'Расписание',
      revenue: 'Доход',
      settings: 'Настройки',
    },

    // Actions
    actions: {
      newOrder: '+ Новый заказ',
      newCustomer: '+ Новый клиент',
      edit: 'Редактировать',
      delete: 'Удалить',
      save: 'Сохранить',
      cancel: 'Отмена',
      call: 'Звонок',
      sms: 'СМС',
      viewDetails: 'Подробнее',
      filter: 'Фильтр',
      search: 'Поиск...',
      searchPlaceholder: 'Поиск по имени, телефону или адресу...',
      close: 'Закрыть',
      confirmDelete: 'Вы уверены, что хотите удалить?',
      copyAddress: 'Копировать адрес',
      addressCopied: 'Адрес скопирован!',
      exportData: 'Экспорт данных (JSON)',
      importData: 'Импорт данных (JSON)',
      resetDemo: 'Восстановить демо-данные',
      all: 'Все',
      today: 'Сегодня',
      tomorrow: 'Завтра',
      thisWeek: 'Эта неделя',
      thisMonth: 'Этот месяц',
      dayView: 'День',
      weekView: 'Неделя',
      back: 'Назад',
      changeStatus: 'Изменить статус',
    },

    // Dashboard
    dashboard: {
      title: 'Панель управления',
      subtitle: 'Сегодняшние задачи и общая статистика',
      todayOrders: 'Заказы на сегодня',
      pendingOrders: 'Ожидающие заказы',
      completedOrders: 'Выполненные заказы',
      todayRevenue: 'Доход за сегодня',
      totalCustomers: 'Всего клиентов',
      todayJobs: 'Дела на сегодня',
      noJobsToday: 'На сегодня нет запланированных заказов',
      upcomingAlert: 'Ближайший заказ',
      upcomingDesc: 'В {time} заказ для {name} — {service}.',
      quickActions: 'Быстрые действия',
      recentOrders: 'Последние заказы',
      scheduleSummary: 'План на день',
      viewSchedule: 'Смотреть всё расписание',
      weeklyOverview: 'Недельный обзор',
    },

    // Statuses
    status: {
      pending: 'В ожидании',
      in_progress: 'В процессе',
      completed: 'Выполнено',
      cancelled: 'Отменено',
    },

    // Services
    services: {
      electric: 'Электрик',
      plumbing: 'Сантехник',
      ac: 'Кондиционер',
      computer: 'Компьютер',
      repair: 'Ремонт',
      other: 'Другое',
    },

    // Customers
    customers: {
      title: 'База клиентов',
      subtitle: 'Все клиенты, адреса и история заказов',
      name: 'Имя',
      phone: 'Номер телефона',
      address: 'Адрес',
      lastOrder: 'Последний заказ',
      totalOrders: 'Всего заказов',
      totalSpent: 'Всего оплачено',
      notes: 'Заметка / Доп. информация',
      addTitle: 'Добавить клиента',
      editTitle: 'Редактировать клиента',
      empty: 'Клиенты не найдены',
      createOrderForCustomer: 'Создать заказ',
      selectCustomer: 'Выберите клиента',
      orCreateNew: 'или создайте нового',
    },

    // Orders
    orders: {
      title: 'Список заказов',
      subtitle: 'Фильтрация, просмотр и обновление заказов',
      orderId: 'ID заказа',
      client: 'Клиент',
      serviceType: 'Тип услуги',
      description: 'Описание работы',
      date: 'Дата',
      time: 'Время начала',
      price: 'Стоимость',
      status: 'Статус',
      notes: 'Дополнительные примечания',
      addTitle: 'Создать новый заказ',
      editTitle: 'Редактировать заказ',
      detailsTitle: 'Детали заказа',
      empty: 'Заказы не найдены',
      filterByStatus: 'По статусу',
      filterByService: 'По услуге',
      filterByDate: 'По дате',
    },

    // Schedule
    schedule: {
      title: 'График работы',
      subtitle: 'Календарь дневного и недельного планирования',
      noJobsAtTime: 'Свободно',
      jobsForDay: 'заказы на день',
    },

    // Revenue
    revenue: {
      title: 'Доходы и финансы',
      subtitle: 'Аналитика поступлений от оказанных услуг',
      todayRevenue: 'Доход за сегодня',
      weeklyRevenue: 'Доход за неделю',
      monthlyRevenue: 'Доход за месяц',
      totalRevenue: 'Общий доход',
      period: 'Период',
      revenueChart: 'Динамика доходов',
      byService: 'Распределение по услугам',
      completedJobs: 'Выполненных заказов',
      averageTicket: 'Средний чек',
      paymentHistory: 'История платежей',
    },

    // Settings
    settings: {
      title: 'Настройки',
      subtitle: 'Профиль, язык и параметры системы',
      language: 'Язык (Language)',
      theme: 'Тема оформления',
      lightMode: '☀️ Светлая тема (Light)',
      darkMode: '🌙 Темная тема (Dark)',
      profile: 'Профиль мастера',
      name: 'Имя мастера',
      phone: 'Телефон',
      specialty: 'Специализация',
      workHours: 'Часы работы',
      currency: 'Валюта',
      dataManagement: 'Безопасность и резервное копирование',
      dataInfo: 'Все клиенты, заказы и доходы надежно хранятся в памяти браузера.',
      resetConfirm: 'Вы уверены, что хотите сбросить данные к демо-состоянию?',
      importSuccess: 'Данные успешно импортированы!',
      importError: 'Неверный формат файла!',
    },

    // Validation & Messages
    msg: {
      savedSuccessfully: 'Успешно сохранено!',
      deletedSuccessfully: 'Успешно удалено!',
      requiredFields: 'Пожалуйста, заполните все обязательные поля!',
      invalidPhone: 'Введите корректный номер телефона!',
      invalidPrice: 'Цена должна быть больше нуля!',
      statusUpdated: 'Статус обновлен!',
      demoRestored: 'Демо-данные восстановлены!',
    },
  },

  en: {
    // Brand
    brandName: 'UstaPro',
    brandTagline: 'Tradesperson & Service Management',

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      customers: 'Customers',
      orders: 'Orders',
      schedule: 'Schedule',
      revenue: 'Revenue',
      settings: 'Settings',
    },

    // Actions
    actions: {
      newOrder: '+ New Order',
      newCustomer: '+ New Customer',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      call: 'Call',
      sms: 'SMS',
      viewDetails: 'Details',
      filter: 'Filter',
      search: 'Search...',
      searchPlaceholder: 'Search by name, phone or address...',
      close: 'Close',
      confirmDelete: 'Are you sure you want to delete this?',
      copyAddress: 'Copy address',
      addressCopied: 'Address copied!',
      exportData: 'Export Data (JSON)',
      importData: 'Import Data (JSON)',
      resetDemo: 'Reset to Demo Data',
      all: 'All',
      today: 'Today',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      dayView: 'Day',
      weekView: 'Week',
      back: 'Back',
      changeStatus: 'Change status',
    },

    // Dashboard
    dashboard: {
      title: 'Control Panel',
      subtitle: 'Today’s tasks and key business metrics',
      todayOrders: 'Today’s Orders',
      pendingOrders: 'Pending Orders',
      completedOrders: 'Completed Orders',
      todayRevenue: 'Today’s Revenue',
      totalCustomers: 'Total Customers',
      todayJobs: 'Today’s Jobs',
      noJobsToday: 'No orders scheduled for today',
      upcomingAlert: 'Upcoming Job Alert',
      upcomingDesc: 'Job for {name} ({service}) scheduled at {time}.',
      quickActions: 'Quick Actions',
      recentOrders: 'Recent Orders',
      scheduleSummary: 'Daily Schedule',
      viewSchedule: 'View Full Calendar',
      weeklyOverview: 'Weekly Overview',
    },

    // Statuses
    status: {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },

    // Services
    services: {
      electric: 'Electrician',
      plumbing: 'Plumber',
      ac: 'Air Conditioner',
      computer: 'Computer / IT',
      repair: 'General Repair',
      other: 'Other Services',
    },

    // Customers
    customers: {
      title: 'Customer Directory',
      subtitle: 'Manage client contacts, locations, and order history',
      name: 'Name',
      phone: 'Phone Number',
      address: 'Address',
      lastOrder: 'Last Order',
      totalOrders: 'Total Orders',
      totalSpent: 'Total Spent',
      notes: 'Notes / Details',
      addTitle: 'Add New Customer',
      editTitle: 'Edit Customer',
      empty: 'No customers found',
      createOrderForCustomer: 'New Order for Client',
      selectCustomer: 'Select Customer',
      orCreateNew: 'or enter a new customer',
    },

    // Orders
    orders: {
      title: 'Orders Management',
      subtitle: 'Filter, view, schedule and update service jobs',
      orderId: 'Order ID',
      client: 'Customer',
      serviceType: 'Service Type',
      description: 'Job Description',
      date: 'Date',
      time: 'Start Time',
      price: 'Price',
      status: 'Status',
      notes: 'Additional Notes',
      addTitle: 'Create New Order',
      editTitle: 'Edit Order',
      detailsTitle: 'Order Details',
      empty: 'No orders found',
      filterByStatus: 'By Status',
      filterByService: 'By Service',
      filterByDate: 'By Date',
    },

    // Schedule
    schedule: {
      title: 'Work Schedule',
      subtitle: 'Interactive daily and weekly planner',
      noJobsAtTime: 'Free slot',
      jobsForDay: 'jobs for day',
    },

    // Revenue
    revenue: {
      title: 'Revenue & Earnings',
      subtitle: 'Financial overview and service earnings analysis',
      todayRevenue: 'Today’s Revenue',
      weeklyRevenue: 'Weekly Revenue',
      monthlyRevenue: 'Monthly Revenue',
      totalRevenue: 'Total Revenue',
      period: 'Period',
      revenueChart: 'Revenue Trend',
      byService: 'Breakdown by Service',
      completedJobs: 'Completed Orders',
      averageTicket: 'Average Job Value',
      paymentHistory: 'Payment History',
    },

    // Settings
    settings: {
      title: 'Settings',
      subtitle: 'Profile, language, and system configuration',
      language: 'Language',
      theme: 'Theme Mode',
      lightMode: '☀️ Light Mode',
      darkMode: '🌙 Dark Mode',
      profile: 'Technician Profile',
      name: 'Technician Name',
      phone: 'Phone',
      specialty: 'Specialty',
      workHours: 'Working Hours',
      currency: 'Currency',
      dataManagement: 'Data Security & Backup',
      dataInfo: 'All your customers, jobs, and earnings are saved directly in your browser.',
      resetConfirm: 'Are you sure you want to reset all data to the demo defaults?',
      importSuccess: 'Data imported successfully!',
      importError: 'Invalid file format!',
    },

    // Validation & Messages
    msg: {
      savedSuccessfully: 'Saved successfully!',
      deletedSuccessfully: 'Deleted successfully!',
      requiredFields: 'Please fill in all required fields!',
      invalidPhone: 'Please enter a valid phone number!',
      invalidPrice: 'Price must be greater than zero!',
      statusUpdated: 'Status updated!',
      demoRestored: 'Demo data restored!',
    },
  },
};

export const serviceIcons: Record<string, string> = {
  electric: '⚡',
  plumbing: '🚰',
  ac: '❄️',
  computer: '💻',
  repair: '🔧',
  other: '🛠',
};
