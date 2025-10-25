import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// 定义语言类型
export type SupportedLanguage = 'en' | 'zh-CN' | 'zh-TW';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
}

export interface LanguageContextType {
  currentLanguage: string;
  switchLanguage: (lng: string) => Promise<boolean>;
  getAvailableLanguages: () => LanguageOption[];
  getLanguageName: (lng: string) => string;
}


// 创建语言上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// 语言提供者组件
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  
  // 直接从localStorage读取保存的语言设置，确保首次渲染时就能显示正确的语言
  const getLanguageFromStorage = (): string => {
    try {
      const savedLanguage = localStorage.getItem('alphatoken-language');
      if (savedLanguage && ['en', 'zh-CN', 'zh-TW'].includes(savedLanguage)) {
        return savedLanguage;
      }
    } catch (error) {
      console.warn('Failed to get saved language from localStorage:', error);
    }
    return 'en'; // 默认英文
  };
  
  // 初始化时直接从localStorage读取语言设置
  const [currentLanguage, setCurrentLanguage] = useState<string>(getLanguageFromStorage());

  useEffect(() => {
    // 初始化完成后，同步i18n实例的语言设置
    try {
      const savedLang = getLanguageFromStorage();
      if (savedLang && savedLang !== i18n.language) {
        i18n.changeLanguage(savedLang);
        setCurrentLanguage(savedLang);
        console.log('Language initialized to:', savedLang);
      }
    } catch (e) {
      console.warn('Failed to sync language with i18n instance');
    }
  }, [i18n]);

  const switchLanguage = async (lng: string): Promise<boolean> => {
    try {
      await i18n.changeLanguage(lng);
      setCurrentLanguage(lng);
      // 保存语言设置到localStorage，确保刷新页面后语言状态保持不变
      try {
        localStorage.setItem('alphatoken-language', lng);
        console.log('Language saved to localStorage:', lng);
      } catch (storageError) {
        console.warn('Failed to save language to localStorage:', storageError);
      }
      return true;
    } catch (error) {
      console.error('Error changing language:', error);
      return false;
    }
  };

  const getAvailableLanguages = (): LanguageOption[] => [
    { code: 'en', name: 'English' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-TW', name: '繁體中文' }
  ];

  const getLanguageName = (lng: string): string => {
    const languageMap: Record<string, string> = {
      'en': 'English',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文'
    };
    return languageMap[lng] || lng;
  };
  
  // 构建context value
  const value: LanguageContextType = {
    currentLanguage,
    switchLanguage,
    getAvailableLanguages,
    getLanguageName
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;