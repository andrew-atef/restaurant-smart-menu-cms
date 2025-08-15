import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    // Custom head configuration
    head: {
      title: 'dodoadmin',
    },
    
    // Custom theme colors
    theme: {
      light: {
        colors: {
          // Primary colors (Yellow #eeff00 variants)
          primary100: '#fefff0',  // Very light yellow
          primary200: '#fcffcc',  // Light yellow
          primary500: '#eeff00',  // Your main yellow
          primary600: '#d9e600',  // Darker yellow
          primary700: '#c2cc00',  // Dark yellow
          
          // Secondary colors  
          secondary100: '#fff5f0',
          secondary200: '#ffd1a6',
          secondary500: '#ff6b35',
          secondary600: '#cc5429',
          secondary700: '#993d1f',
          
          // Success colors
          success100: '#f0fff4',
          success200: '#c6f6d5', 
          success500: '#38a169',
          success600: '#2d7d54',
          success700: '#22543d',
          
          // Warning colors
          warning100: '#fffaf0',
          warning200: '#feebc8',
          warning500: '#dd6b20',
          warning600: '#b7571a',
          warning700: '#8b4513',
          
          // Danger colors
          danger100: '#fff5f5',
          danger200: '#fed7d7',
          danger500: '#e53e3e',
          danger600: '#c53030',
          danger700: '#9b2c2c',
          
          // Neutral colors
          neutral0: '#ffffff',
          neutral100: '#f8f9fa',
          neutral150: '#e9ecef', 
          neutral200: '#dee2e6',
          neutral300: '#ced4da',
          neutral400: '#adb5bd',
          neutral500: '#6c757d',
          neutral600: '#495057',
          neutral700: '#343a40',
          neutral800: '#212529',
          neutral900: '#000000',
        },
      },
      dark: {
        colors: {
          // Dark theme colors - Yellow variants for dark mode
          primary100: '#2b2b00',  // Very dark yellow
          primary200: '#3d3d00',  // Dark yellow
          primary500: '#b3bf00',  // Muted yellow for dark theme
          primary600: '#eeff00',  // Your main yellow
          primary700: '#f5ff33',  // Bright yellow
          
          neutral0: '#212529',
          neutral100: '#343a40',
          neutral800: '#f8f9fa',
          neutral900: '#ffffff',
        },
      },
    },
    
    // Custom translations for UI text
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'dodoadmin',
        'app.components.LeftMenu.navbrand.workplace': 'Dashboard',
        'Auth.form.welcome.title': 'Welcome to dodoadmin',
        'Auth.form.welcome.subtitle': 'Log in to your account',
        'HomePage.welcome': 'Welcome to dodoadmin',
        'HomePage.welcome.again': 'Welcome back to dodoadmin',
        'Settings.profile.form.section.experience.title': 'dodoadmin Experience',
        'global.content-manager': 'dodoadmin Content',
      },
    },
    
    // Available locales
    locales: [
      // 'ar',
      // 'fr', 
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk', 
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
  },
  
  bootstrap(app: StrapiApp) {
    console.log('dodoadmin initialized:', app);
  },
};