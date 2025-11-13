// 国际化配置
export const locales = ['en', 'zh-Hans', 'zh-Hant'] as const
export const defaultLocale = 'en'

// 语言映射
export const localeNames = {
  'en': 'English',
  'zh-Hans': '简体中文',
  'zh-Hant': '繁體中文'
} as const

export type Locale = typeof locales[number];