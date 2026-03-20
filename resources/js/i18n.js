import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationEN from '../locales/en.json';
import translationAR from '../locales/ar.json';

const resources = {
  en: {
    translation: translationEN
  },
  ar: {
    translation: translationAR
  }
};

// Initialize i18next
i18n
  // Configure language detection (localStorage > navigator > htmlTag)
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar', // Fallback to Arabic if detection fails
    debug: false,
    interpolation: {
      escapeValue: false, // React handles XSS escaping inherently
    }
  });

// Listen to language changes and update the document direction for RTL
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
});

// Set initial direction based on detected language
document.documentElement.lang = i18n.language;
document.documentElement.dir = i18n.dir(i18n.language);

export default i18n;
