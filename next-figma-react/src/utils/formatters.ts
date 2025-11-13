import { SupportedLanguage } from '@/config/i18n';

/**
 * 日期格式化工具
 */
export const formatDate = (
  date: Date | string | number,
  format: 'short' | 'long' | 'time' = 'short',
  language: SupportedLanguage = 'en'
): string => {
  const locale = getLocaleFromLanguage(language);
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  const options: Intl.DateTimeFormatOptions = {
    ...(format === 'short' && { dateStyle: 'short' }),
    ...(format === 'long' && { dateStyle: 'full' }),
    ...(format === 'time' && { timeStyle: 'short' })
  };

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * 数字格式化工具
 */
export const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {},
  language: SupportedLanguage = 'en'
): string => {
  const locale = getLocaleFromLanguage(language);
  
  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * 货币格式化工具
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  language: SupportedLanguage = 'en'
): string => {
  const locale = getLocaleFromLanguage(language);
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
};

/**
 * 百分比格式化工具
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2,
  language: SupportedLanguage = 'en'
): string => {
  const locale = getLocaleFromLanguage(language);
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * 获取语言对应的locale
 */
const getLocaleFromLanguage = (language: SupportedLanguage): string => {
  const localeMap: Record<SupportedLanguage, string> = {
    'en': 'en-US',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW'
  };
  
  return localeMap[language] || 'en-US';
};

export default {
  formatDate,
  formatNumber,
  formatCurrency,
  formatPercentage
};