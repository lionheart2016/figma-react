'use client';

import React from 'react';
import BrandSection from '@/components/global/BrandSection';
import LanguageSwitcher from '@/components/global/LanguageSwitcher';
import ThemeSwitcher from '@/components/global/ThemeSwitcher';
import useI18n from '../../hooks/useI18n';
import { ShowButtonProvider } from './_components/showBackButtonContext';
import Back from './_components/back';

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
  showBackButton = true, 
  onBack 
}: AuthLayoutProps) {

  return (
    <ShowButtonProvider>
      <div className="layout-container min-h-screen flex flex-col md:flex-row overflow-hidden">
        {/* 左侧品牌区域 */}
        <div className="layout-sidebar hidden md:flex bg-gradient-to-br from-primary to-primary-dark text-white flex-col justify-between min-w-80">
          <BrandSection 
            showLogo={true}
          />
        </div>

        {/* 右侧内容区域 */}
        <div className="layout-content flex-1 flex flex-col overflow-y-auto bg-white dark:bg-gray-900">
          {/* 右上角导航栏 */}
          <div className="layout-navbar flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            {/* 左侧：返回按钮 */}
            <Back />
            
            {/* 右侧：语言切换器和主题切换器 */}
            <div className="layout-navbar-controls flex items-center ml-auto gap-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>

          {/* 右下角内容区域 */}
          <div className="layout-main-content flex-1 p-6 max-w-4xl mx-auto w-full">
            {/* 标题区域 */}
            {(title || subtitle) && (
              <div className="layout-header mb-8">
                {title && <h1 className="layout-title text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>}
                {subtitle && <p className="layout-subtitle text-gray-600 dark:text-gray-400">{subtitle}</p>}
              </div>
            )}
            
            {/* 主要内容 */}
            <div className="layout-content-area w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ShowButtonProvider>
  );

}