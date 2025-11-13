'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import initI18n from '@/config/i18n';

/**
 * I18nProvider 组件
 * 为整个应用提供国际化支持
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [i18n, setI18n] = useState<any>(null);

  useEffect(() => {
    // 在客户端初始化i18n
    const initClientI18n = async () => {
      const i18nInstance = await initI18n();
      setI18n(i18nInstance);
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
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}