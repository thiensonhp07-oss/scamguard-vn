import React, { createContext, useContext } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, TranslationKey } from './translations';

interface LanguageContextType {
  language: Language;
  t: (key: TranslationKey) => string;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  t: (key) => TRANSLATIONS.vi[key] || key,
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{
  language: Language;
  onLanguageChange: (lang: Language) => void;
  children: React.ReactNode;
}> = ({ language, onLanguageChange, children }) => {
  const currentLang = language === 'en' ? 'en' : 'vi';

  const t = (key: TranslationKey): string => {
    return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.vi[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage: onLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
