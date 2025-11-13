'use client';

import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';

export default function HomePage() {
  const { t, changeLanguage, availableLanguages } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            {t('common.crypto_trading_platform')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('common.professional_crypto_trading')}
          </p>
        </div>

        {/* 导航链接 */}
        <div className="mt-12 flex justify-center space-x-6">
          <Link
            href="/auth/login"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md"
          >
            {t('common.login')}
          </Link>
          <Link
            href="/dashboard"
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-6 py-3 rounded-md"
          >
            {t('common.dashboard')}
          </Link>
        </div>

        {/* 语言切换器 */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code as any)}
                className="px-3 py-1 text-sm border rounded-md hover:bg-accent"
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}