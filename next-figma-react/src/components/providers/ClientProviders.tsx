'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserStateProvider } from '@/services/UserStateService';
import initI18n from '@/config/i18n';

/**
 * ClientProviders 组件
 * 在客户端提供各种provider服务，包括国际化支持
 */
export default function ClientProviders({ children }: { children: ReactNode }) {
  const [i18n, setI18n] = useState<any>(null);

  useEffect(() => {
    // 在客户端初始化i18n
    const initClientI18n = async () => {
      try {
        const i18nInstance = await initI18n();
        setI18n(i18nInstance);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
      }
    };

    initClientI18n();
  }, []);

  // 在i18n初始化之前显示加载状态
  if (!i18n) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <UserStateProvider>
          {children}
        </UserStateProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}