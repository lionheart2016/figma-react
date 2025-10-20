import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, getLanguageName } from '../config/i18n';

// 为测试环境提供默认的回退函数
const mockUseTranslation = () => ({
  t: (key) => key,
  i18n: {
    language: 'en',
    changeLanguage: typeof vi !== 'undefined' ? vi.fn() : () => {}
  }
});

const mockChangeLanguage = typeof vi !== 'undefined' ? vi.fn() : () => {};
const mockGetCurrentLanguage = () => 'en';
const mockGetLanguageName = (code) => {
  const languages = {
    'en': 'English',
    'zh-CN': '简体中文',
      'zh-TW': '繁體中文'
      };
      return languages[code] || code;
    };

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  // 使用实际的函数
  const { i18n } = useTranslation();
  const defaultLanguage = getCurrentLanguage();
  
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

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
      { code: 'en', name: 'English' },
      { code: 'zh-CN', name: '简体中文' },
      { code: 'zh-TW', name: '繁體中文' }
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