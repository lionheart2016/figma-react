import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, getLanguageName } from '../config/i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());

  useEffect(() => {
    // 初始化时设置语言
    setCurrentLanguage(getCurrentLanguage());
  }, []);

  const switchLanguage = async (lng) => {
    try {
      await changeLanguage(lng);
      setCurrentLanguage(lng);
      return true;
    } catch (error) {
      console.error('Language switch failed:', error);
      return false;
    }
  };

  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: getLanguageName('en') },
      { code: 'zh-CN', name: getLanguageName('zh-CN') },
      { code: 'zh-TW', name: getLanguageName('zh-TW') }
    ];
  };

  const value = {
    currentLanguage,
    switchLanguage,
    getAvailableLanguages,
    getLanguageName: (lng) => getLanguageName(lng)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;