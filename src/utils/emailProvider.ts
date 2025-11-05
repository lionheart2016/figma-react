// 邮箱提供商工具

interface EmailProvider {
  domains: string[];
  name: {
    'zh-CN': string;
    'zh-TW': string;
    'en': string;
  };
  url: string;
  logo?: string;
}

const supportedEmailProviders: EmailProvider[] = [
  {
    domains: ['gmail.com'],
    name: {
      'zh-CN': 'Gmail',
      'zh-TW': 'Gmail',
      'en': 'Gmail'
    },
    url: 'https://mail.google.com/'
  },
  {
    domains: ['outlook.com', 'live.com', 'hotmail.com'],
    name: {
      'zh-CN': 'Outlook',
      'zh-TW': 'Outlook',
      'en': 'Outlook'
    },
    url: 'https://outlook.live.com/'
  },
  {
    domains: ['qq.com'],
    name: {
      'zh-CN': 'QQ邮箱',
      'zh-TW': 'QQ郵箱',
      'en': 'QQ Mail'
    },
    url: 'https://mail.qq.com/'
  }
];

/**
 * 根据邮箱地址获取邮箱提供商信息
 */
export const getEmailProvider = (email: string): EmailProvider | null => {
  if (!email || typeof email !== 'string') return null;
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return null;
  
  return supportedEmailProviders.find(provider => 
    provider.domains.includes(domain)
  ) || null;
};

/**
 * 获取邮箱提供商的跳转URL
 */
export const getEmailProviderUrl = (email: string): string | null => {
  const provider = getEmailProvider(email);
  return provider ? provider.url : null;
};

/**
 * 获取邮箱提供商的显示名称
 */
export const getEmailProviderName = (email: string, language: string = 'en'): string | null => {
  const provider = getEmailProvider(email);
  if (!provider) return null;
  
  // 确保语言代码有效
  const lang = language in provider.name ? language as keyof typeof provider.name : 'en';
  return provider.name[lang];
};

/**
 * 检查邮箱是否支持快速跳转
 */
export const isEmailProviderSupported = (email: string): boolean => {
  return getEmailProvider(email) !== null;
};