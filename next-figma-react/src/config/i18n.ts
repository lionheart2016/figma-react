import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入语言资源
import enMessages from '@/i18n/messages/en';
import zhHansMessages from '@/i18n/messages/zh-Hans';
import zhHantMessages from '@/i18n/messages/zh-Hant';

// 语言资源对象
const resources = {
  en: {
    translation: enMessages
  },
  'zh-Hans': {
    translation: zhHansMessages
  },
  'zh-Hant': {
    translation: zhHantMessages
  },
  'zh-TW': {
    translation: zhHantMessages  // 映射到繁体中文资源
  }
};

// 支持的语言列表
export const supportedLanguages = ['en', 'zh-Hans', 'zh-Hant', 'zh-TW'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

// 语言名称映射
export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  'zh-Hans': '简体中文',
  'zh-Hant': '繁體中文',
  'zh-TW': '繁體中文'
};

const init = async () => {
  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: undefined, // 让语言检测器自动检测
      fallbackLng: 'en',
      debug: false,

      // 检测选项
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
        checkWhitelist: true
      },

      // interpolation 选项
      interpolation: {
        escapeValue: false
      },

      // React 配置
      react: {
        useSuspense: false
      },

      // 预加载所有语言
      preload: supportedLanguages
    });

  return i18n;
};

// 导出i18n实例和初始化函数
export { i18n };
export default init;