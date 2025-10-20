import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入语言文件，使用ES模块语法
import en from '../locales/en.json';
import zhCN from '../locales/zh-CN.json';
import zhTW from '../locales/zh-TW.json';

// 定义支持的语言类型
type SupportedLanguage = 'en' | 'zh-CN' | 'zh-TW';

// 从localStorage获取保存的语言设置
const getSavedLanguage = (): SupportedLanguage => {
  try {
    const savedLanguage = localStorage.getItem('alphatoken-language') as SupportedLanguage | null;
    if (savedLanguage && ['en', 'zh-CN', 'zh-TW'].includes(savedLanguage)) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn('Failed to get saved language from localStorage:', error);
  }
  return 'en'; // 默认英文
};

// 定义资源类型
interface ResourcesType {
  [key: string]: {
    translation: Record<string, string>;
  };
}

const resources: ResourcesType = {
  en: {
    translation: en
  },
  'zh-CN': {
    translation: zhCN
  },
  'zh-TW': {
    translation: zhTW
  }
};

// 初始化 i18next
const initI18n = async () => {
  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: getSavedLanguage(), // 使用保存的语言设置
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage']
      },
      react: {
        useSuspense: false // 禁用 suspense 避免加载问题
      }
    });
  
  console.log('i18n initialized with language:', i18n.language);
  
  // 暴露 i18n 实例到全局，便于调试
  if (typeof window !== 'undefined') {
    (window as any).i18next = i18n;
  }
  
  return i18n;
};

// 导出初始化函数
export { initI18n };

// 导出语言切换函数
export const changeLanguage = (lng: SupportedLanguage): Promise<void> => {
  localStorage.setItem('alphatoken-language', lng);
  return i18n.changeLanguage(lng);
};

// 导出获取当前语言的函数
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

// 导出获取语言名称的函数
export const getLanguageName = (lng: string): string => {
  const languageNames: Record<string, string> = {
    'en': 'English',
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文'
  };
  return languageNames[lng] || 'English';
};

export default i18n;