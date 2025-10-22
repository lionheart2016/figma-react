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
      // 初始化完成后，尝试从i18n获取当前语言，但优先使用localStorage中的设置
      try {
        const savedLang = getLanguageFromStorage();
        const i18nLang = getCurrentLanguage();
        
        // 如果localStorage中有保存的语言，使用它；否则使用i18n的当前语言
        const finalLang = savedLang || i18nLang;
        
        if (finalLang !== currentLanguage) {
          setCurrentLanguage(finalLang);
          console.log('Language initialized to:', finalLang);
        }
      } catch (e) {
        console.warn('Failed to update language from i18n, using localStorage value');
      }
    }, []);

  const switchLanguage = async (lng: string): Promise<boolean> => {
    try {
      if (i18nInstance) {
        await i18nInstance.changeLanguage(lng);
        setCurrentLanguage(lng);
        // 保存语言设置到localStorage，确保刷新页面后语言状态保持不变
        try {
          localStorage.setItem('alphatoken-language', lng);
          console.log('Language saved to localStorage:', lng);
        } catch (storageError) {
          console.warn('Failed to save language to localStorage:', storageError);
        }
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