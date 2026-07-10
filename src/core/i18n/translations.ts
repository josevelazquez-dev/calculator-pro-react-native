export const translations = {
  es: {
    settings: {
      title: 'Configuración',
      themeSection: 'Tema',
      themeDescription: 'Elige tu apariencia preferida',
      light: 'Claro',
      dark: 'Oscuro',
      auto: 'Automático',
      languageSection: 'Idioma',
      languageDescription: 'Selecciona tu idioma',
      version: 'Versión',
      shareApp: 'Compartir aplicación',
      rateApp: 'Calificar aplicación',
      privacyPolicy: 'Política de privacidad',
      aboutSection: 'Acerca de',
      developedBy: 'Desarrollado por',
      shareMessage: '¡Descarga Calculator Pro!',
    },
  },
  en: {
    settings: {
      title: 'Settings',
      themeSection: 'Theme',
      themeDescription: 'Choose your preferred appearance',
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
      languageSection: 'Language',
      languageDescription: 'Select your preferred language',
      version: 'Version',
      shareApp: 'Share App',
      rateApp: 'Rate App',
      privacyPolicy: 'Privacy Policy',
      aboutSection: 'About',
      developedBy: 'Developed by',
      shareMessage: 'Download Calculator Pro!',
    },
  },
} as const;

export type TranslationKeys = keyof typeof translations.es;
export type TranslationLang = keyof typeof translations;
