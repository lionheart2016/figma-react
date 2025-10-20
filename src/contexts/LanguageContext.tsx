import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// 定义模拟的i18n函数，避免模块导入问题
const mockChangeLanguage = async (lng: string): Promise<void> => {
  console.log('Mock changing language to:', lng);
};

const mockGetCurrentLanguage = (): string => {
  return 'en';
};

const mockGetLanguageName = (lng: string): string => {
  const languageMap: Record<string, string> = {
    'en': 'English',
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文'
  };
  return languageMap[lng] || lng;
};

// 尝试导入真实模块，失败时使用模拟函数
let changeLanguage = mockChangeLanguage;
let getCurrentLanguage = mockGetCurrentLanguage;
let getLanguageName = mockGetLanguageName;

try {
  // @ts-ignore - 忽略i18n模块类型检查
  const i18nModule = require('../config/i18n');
  changeLanguage = i18nModule.changeLanguage || changeLanguage;
  getCurrentLanguage = i18nModule.getCurrentLanguage || getCurrentLanguage;
  getLanguageName = i18nModule.getLanguageName || getLanguageName;
} catch (error) {
  console.warn('Using mock i18n functions');
}

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

// 测试用模拟函数（仅用于测试）
export function mockUseTranslation() {
  return {
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => Promise.resolve(),
      language: 'en'
    },
    ready: true
  };
}

// 测试用模拟上下文值
export const mockLanguageContextValue: LanguageContextType = {
  currentLanguage: 'en',
  switchLanguage: async () => true,
  getAvailableLanguages: () => [
    { code: 'en', name: 'English' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-TW', name: '繁體中文' }
  ],
  getLanguageName: (lng: string) => {
    const languageMap: Record<string, string> = {
      'en': 'English',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文'
    };
    return languageMap[lng] || lng;
  }
};

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
  try {
    // 使用实际的函数，但添加错误处理
    let i18nInstance = null;
    try {
      const translation = useTranslation();
      i18nInstance = translation?.i18n || null;
    } catch (e) {
      console.warn('useTranslation hook failed, using fallback');
    }
    
    // 使用try-catch保护getCurrentLanguage调用
    let defaultLanguage = 'en';
    try {
      defaultLanguage = getCurrentLanguage();
    } catch (e) {
      console.warn('getCurrentLanguage failed, using default: en');
    }
    
    const [currentLanguage, setCurrentLanguage] = useState<string>(defaultLanguage);

    useEffect(() => {
      // 初始化时设置语言，添加错误处理
      try {
        setCurrentLanguage(getCurrentLanguage());
      } catch (e) {
        console.warn('Failed to set initial language');
      }
    }, []);

  const switchLanguage = async (lng: string): Promise<boolean> => {
    try {
      if (i18nInstance) {
        await i18nInstance.changeLanguage(lng);
        setCurrentLanguage(lng);
        return true;
      }
      return false;
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
    
    // 构建context value
    const value: LanguageContextType = {
      currentLanguage,
      switchLanguage,
      getAvailableLanguages,
      getLanguageName: (lng: string) => getLanguageName(lng)
    };
    
    return (
      <LanguageContext.Provider value={value}>
        {children}
      </LanguageContext.Provider>
    );
  } catch (error) {
    console.error('LanguageProvider error:', error);
    // 提供默认值以防止应用崩溃
    const defaultValue: LanguageContextType = {
      currentLanguage: 'en',
      switchLanguage: async () => false,
      getAvailableLanguages: () => [
        { code: 'en', name: 'English' },
        { code: 'zh-CN', name: '简体中文' },
        { code: 'zh-TW', name: '繁體中文' }
      ],
      getLanguageName: (lng: string) => lng
    };
    return (
      <LanguageContext.Provider value={defaultValue}>
        {children}
      </LanguageContext.Provider>
    );
  }
};

export default LanguageContext;