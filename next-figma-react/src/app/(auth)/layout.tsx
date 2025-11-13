'use client';

import React from 'react';
import BrandSection from '@/components/global/BrandSection';
import useI18n from '../../hooks/useI18n';
import Header from '@/components/core/Header';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
}: AuthLayoutProps) {
  const { t } = useI18n();

  return (
    <div className="layout-container">
      {/* 左侧品牌区域 */}
      <BrandSection />


      {/* 右侧内容区域 */}
      <div className="layout-content">
        {/* 右上角导航栏 */}
        <Header />

        {/* 右下角内容区域 */}
        <main className="layout-main-content flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full">
          {/* 标题区域 */}
          {(title || subtitle) && (
            <div className="layout-header mb-8">
              {title && <h1 className="layout-title text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>}
              {subtitle && <p className="layout-subtitle text-gray-600 dark:text-gray-400">{subtitle}</p>}
            </div>
          )}

          <div className="mt-4">
            {/* Dynamic Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );

}