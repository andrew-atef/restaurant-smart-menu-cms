import type { StrapiApp } from '@strapi/strapi/admin';

// Site configuration
const SITE_NAME = 'dodoadmin';
const SITE_TITLE = 'DodoAdmin';
const DASHBOARD_TITLE = 'Dashboard';

export default {
  config: {
    // Custom head configuration
    head: {
      title: SITE_TITLE,
      favicon: '/favicon.ico',
    },
    
    // Custom theme colors - Modern design system
    theme: {
      light: {
        colors: {
          // Primary colors - Modern blue palette
          primary100: '#f0f9ff',  // Very light blue
          primary200: '#e0f2fe',  // Light blue
          primary300: '#7dd3fc',  // Medium light blue
          primary400: '#38bdf8',  // Medium blue
          primary500: '#0ea5e9',  // Main blue
          primary600: '#0284c7',  // Darker blue
          primary700: '#0369a1',  // Dark blue
          
          // Button primary colors (consistent with primary)
          buttonPrimary100: '#f0f9ff',
          buttonPrimary200: '#e0f2fe',
          buttonPrimary300: '#7dd3fc',
          buttonPrimary400: '#38bdf8',
          buttonPrimary500: '#0ea5e9',
          buttonPrimary600: '#0284c7',
          buttonPrimary700: '#0369a1',

          // Secondary colors - Modern purple accent
          secondary100: '#faf5ff',
          secondary200: '#e9d5ff',
          secondary300: '#c4b5fd',
          secondary400: '#a78bfa',
          secondary500: '#8b5cf6',
          secondary600: '#7c3aed',
          secondary700: '#6d28d9',
          
          // Success colors - Modern green
          success100: '#f0fdf4',
          success200: '#dcfce7',
          success300: '#bbf7d0',
          success400: '#86efac',
          success500: '#22c55e',
          success600: '#16a34a',
          success700: '#15803d',
          
          // Warning colors - Modern amber
          warning100: '#fffbeb',
          warning200: '#fef3c7',
          warning300: '#fde68a',
          warning400: '#facc15',
          warning500: '#eab308',
          warning600: '#ca8a04',
          warning700: '#a16207',
          
          // Danger colors - Modern red
          danger100: '#fef2f2',
          danger200: '#fecaca',
          danger300: '#fca5a5',
          danger400: '#f87171',
          danger500: '#ef4444',
          danger600: '#dc2626',
          danger700: '#b91c1c',
          
          // Neutral colors - Modern gray scale
          neutral0: '#ffffff',
          neutral100: '#f8fafc',
          neutral150: '#f1f5f9',
          neutral200: '#e2e8f0',
          neutral300: '#cbd5e1',
          neutral400: '#94a3b8',
          neutral500: '#64748b',
          neutral600: '#475569',
          neutral700: '#334155',
          neutral800: '#1e293b',
          neutral900: '#0f172a',
          
          // Alternative colors for variety
          alternative100: '#f8fafc',
          alternative200: '#e2e8f0',
          alternative500: '#64748b',
          alternative600: '#475569',
          alternative700: '#334155',
        },
      },
      dark: {
        colors: {
          // Dark theme primary colors - Brighter blues for contrast
          primary100: '#0c1426',
          primary200: '#1e293b',
          primary300: '#0369a1',
          primary400: '#0284c7',
          primary500: '#0ea5e9',
          primary600: '#38bdf8',
          primary700: '#7dd3fc',
          
          // Dark theme button colors
          buttonPrimary100: '#0c1426',
          buttonPrimary200: '#1e293b',
          buttonPrimary300: '#0369a1',
          buttonPrimary400: '#0284c7',
          buttonPrimary500: '#0ea5e9',
          buttonPrimary600: '#38bdf8',
          buttonPrimary700: '#7dd3fc',

          // Secondary colors - Vibrant purple for dark mode
          secondary100: '#1e1b29',
          secondary200: '#2d2438',
          secondary300: '#6d28d9',
          secondary400: '#7c3aed',
          secondary500: '#8b5cf6',
          secondary600: '#a78bfa',
          secondary700: '#c4b5fd',
          
          // Success colors - Bright green for visibility
          success100: '#0a1f0f',
          success200: '#133e1a',
          success300: '#15803d',
          success400: '#16a34a',
          success500: '#22c55e',
          success600: '#4ade80',
          success700: '#86efac',
          
          // Warning colors - Bright amber
          warning100: '#1f1611',
          warning200: '#3d2d0a',
          warning300: '#a16207',
          warning400: '#ca8a04',
          warning500: '#eab308',
          warning600: '#facc15',
          warning700: '#fde047',
          
          // Danger colors - Bright red
          danger100: '#1f1315',
          danger200: '#3c1618',
          danger300: '#b91c1c',
          danger400: '#dc2626',
          danger500: '#ef4444',
          danger600: '#f87171',
          danger700: '#fca5a5',
          
          // Dark theme neutral colors
          neutral0: '#0f172a',      // Dark background
          neutral100: '#1e293b',   // Card background
          neutral150: '#334155',   // Elevated background
          neutral200: '#475569',   // Border color
          neutral300: '#64748b',   // Muted text
          neutral400: '#94a3b8',   // Secondary text
          neutral500: '#cbd5e1',   // Primary text
          neutral600: '#e2e8f0',   // High contrast text
          neutral700: '#f1f5f9',   // Highest contrast
          neutral800: '#f8fafc',   // Pure text
          neutral900: '#ffffff',   // White text
          
          // Alternative colors for dark theme
          alternative100: '#1e293b',
          alternative200: '#334155',
          alternative500: '#94a3b8',
          alternative600: '#cbd5e1',
          alternative700: '#e2e8f0',
        },
      },
    },
    
    // Custom translations for UI text
    translations: {
      ar: {
        // Main branding
        'app.components.LeftMenu.navbrand.title': SITE_TITLE,
        'app.components.LeftMenu.navbrand.workplace': 'لوحة التحكم',
        
        // Authentication
        'Auth.form.welcome.title': `مرحباً بك في ${SITE_TITLE}`,
        'Auth.form.welcome.subtitle': 'تسجيل الدخول إلى حسابك',
        'Auth.form.button.login': 'تسجيل الدخول',
        'Auth.form.button.register': 'إنشاء حساب',
        'Auth.form.error.email.invalid': 'يرجى إدخال عنوان بريد إلكتروني صحيح',
        'Auth.form.error.password.minLength': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        
        // Homepage
        'HomePage.welcome': `مرحباً بك في ${SITE_TITLE}`,
        'HomePage.welcome.again': `مرحباً بعودتك إلى ${SITE_TITLE}`,
        'HomePage.header.title': 'لوحة التحكم',
        
        // Settings
        'Settings.profile.form.section.experience.title': `تجربة ${SITE_TITLE}`,
        'Settings.profile.form.section.experience.interfaceLanguage': 'لغة الواجهة',
        'Settings.profile.form.section.experience.mode': 'وضع الواجهة',
        
        // Content Manager
        'global.content-manager': `محتوى ${SITE_TITLE}`,
        'content-manager.header.name': 'مدير المحتوى',
        'content-manager.containers.List.title': 'قائمة المحتوى',
        'content-manager.containers.Edit.title': 'تعديل المدخل',
        'content-manager.containers.Create.title': 'إنشاء مدخل',
        
        // Media Library
        'upload.plugin.name': 'مكتبة الوسائط',
        'upload.page.title': 'مكتبة الوسائط',
        
        // Users & Permissions
        'users-permissions.plugin.name': 'المستخدمون والصلاحيات',
        'users-permissions.page.title': 'المستخدمون والصلاحيات',
        
        // Email Designer
        'email.plugin.name': 'مصمم البريد الإلكتروني',
        'email.page.title': 'قوالب البريد الإلكتروني',
        
        // Common actions
        'app.components.Button.save': 'حفظ',
        'app.components.Button.cancel': 'إلغاء',
        'app.components.Button.delete': 'حذف',
        'app.components.Button.edit': 'تعديل',
        'app.components.Button.create': 'إنشاء',
        'app.components.Button.publish': 'نشر',
        'app.components.Button.unpublish': 'إلغاء النشر',
        
        // Navigation
        'app.components.LeftMenu.general': 'عام',
        'app.components.LeftMenu.plugins': 'الإضافات',
        'app.components.LeftMenu.settings': 'الإعدادات',
        
        // Common messages
        'notification.success.saved': 'تم الحفظ بنجاح',
        'notification.error.generic': 'حدث خطأ',
        'notification.success.delete': 'تم الحذف بنجاح',
        
        // Table headers
        'components.table.header.name': 'الاسم',
        'components.table.header.type': 'النوع',
        'components.table.header.lastUpdate': 'آخر تحديث',
        'components.table.header.createdAt': 'تاريخ الإنشاء',
        'components.table.header.actions': 'الإجراءات',
      },
      
      en: {
        // Main branding
        'app.components.LeftMenu.navbrand.title': SITE_TITLE,
        'app.components.LeftMenu.navbrand.workplace': DASHBOARD_TITLE,
        
        // Authentication
        'Auth.form.welcome.title': `Welcome to ${SITE_TITLE}`,
        'Auth.form.welcome.subtitle': 'Log in to your account',
        'Auth.form.button.login': 'Sign In',
        'Auth.form.button.register': 'Create Account',
        'Auth.form.error.email.invalid': 'Please enter a valid email address',
        'Auth.form.error.password.minLength': 'Password must be at least 6 characters',
        
        // Homepage
        'HomePage.welcome': `Welcome to ${SITE_TITLE}`,
        'HomePage.welcome.again': `Welcome back to ${SITE_TITLE}`,
        'HomePage.header.title': DASHBOARD_TITLE,
        
        // Settings
        'Settings.profile.form.section.experience.title': `${SITE_TITLE} Experience`,
        'Settings.profile.form.section.experience.interfaceLanguage': 'Interface Language',
        'Settings.profile.form.section.experience.mode': 'Interface Mode',
        
        // Content Manager
        'global.content-manager': `${SITE_TITLE} Content`,
        'content-manager.header.name': 'Content Manager',
        'content-manager.containers.List.title': 'Content List',
        'content-manager.containers.Edit.title': 'Edit Entry',
        'content-manager.containers.Create.title': 'Create Entry',
        
        // Media Library
        'upload.plugin.name': 'Media Library',
        'upload.page.title': 'Media Library',
        
        // Users & Permissions
        'users-permissions.plugin.name': 'Users & Permissions',
        'users-permissions.page.title': 'Users & Permissions',
        
        // Email Designer
        'email.plugin.name': 'Email Designer',
        'email.page.title': 'Email Templates',
        
        // Common actions
        'app.components.Button.save': 'Save',
        'app.components.Button.cancel': 'Cancel',
        'app.components.Button.delete': 'Delete',
        'app.components.Button.edit': 'Edit',
        'app.components.Button.create': 'Create',
        'app.components.Button.publish': 'Publish',
        'app.components.Button.unpublish': 'Unpublish',
        
        // Navigation
        'app.components.LeftMenu.general': 'General',
        'app.components.LeftMenu.plugins': 'Plugins',
        'app.components.LeftMenu.settings': 'Settings',
        
        // Common messages
        'notification.success.saved': 'Saved successfully',
        'notification.error.generic': 'An error occurred',
        'notification.success.delete': 'Deleted successfully',
        
        // Table headers
        'components.table.header.name': 'Name',
        'components.table.header.type': 'Type',
        'components.table.header.lastUpdate': 'Last Update',
        'components.table.header.createdAt': 'Created',
        'components.table.header.actions': 'Actions',
      },
    },
    
    // Available locales (Arabic default, English secondary)
    locales: [
      'ar',    // Arabic (default)
      'en',    // English
    ],
    
    // Set Arabic as default locale
    defaultLocale: 'ar',
    
    // Custom menu configuration
    menu: {
      logo: `/uploads/${SITE_NAME}_logo.png`,
    },
    
    // Tutorial configuration
    tutorials: false, // Set to true if you want to show tutorials
    
    // Notifications configuration
    notifications: {
      releases: false, // Disable release notifications
    },
    
    // Custom CSS injection (optional)
    // You can add custom CSS here
    style: `
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: var(--neutral200);
      }
      
      ::-webkit-scrollbar-thumb {
        background: var(--primary500);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: var(--primary600);
      }
      
      /* Custom focus styles */
      *:focus {
        outline: 2px solid var(--primary500);
        outline-offset: 2px;
      }
      
      /* Loading animation improvements */
      .loading-spinner {
        border-color: var(--primary200);
        border-top-color: var(--primary500);
      }
    `,
  },
  
  bootstrap(app: StrapiApp) {
    console.log(`${SITE_TITLE} admin panel initialized successfully:`, app);
    
    // Add any custom initialization logic here
    // For example, you could set up custom event listeners,
    // inject custom components, or configure plugins
    
    // Custom favicon update
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = `/uploads/${SITE_NAME}_favicon.ico`;
    }
    
    // Add custom meta tags
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = `${SITE_TITLE} - Modern Content Management System`;
    document.head.appendChild(metaDescription);
    
    // Custom theme class for additional styling
    document.body.classList.add(`${SITE_NAME}-admin`);
  },
};