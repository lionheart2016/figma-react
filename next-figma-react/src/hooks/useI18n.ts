import { useTranslation } from 'react-i18next';
import { supportedLanguages, languageNames, SupportedLanguage } from '@/config/i18n';

/**
 * 扩展的国际化Hook
 * 包含语言切换、当前语言获取、语言名称等功能
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  /**
   * 切换语言
   */
  const changeLanguage = async (language: SupportedLanguage) => {
    await i18n.changeLanguage(language);
    localStorage.setItem('NEXT_LOCALE', language);
  };

  /**
   * 获取当前语言
   */
  const currentLanguage = i18n.language as SupportedLanguage;

  /**
   * 获取当前语言名称
   */
  const currentLanguageName = languageNames[currentLanguage];

  /**
   * 获取支持的语言列表
   */
  const availableLanguages = supportedLanguages.map(lang => ({
    code: lang,
    name: languageNames[lang]
  }));

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage,
    currentLanguageName,
    availableLanguages,
    isRTL: false // 如需要支持RTL语言，可以在这里扩展
  };
};

export default useI18n;