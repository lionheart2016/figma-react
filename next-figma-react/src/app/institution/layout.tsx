'use client';

import React, { ReactNode } from 'react';
import LanguageSwitcher from '@/components/global/LanguageSwitcher';
import ThemeSwitcher from '@/components/global/ThemeSwitcher';
import Step from '@/components/global/Step';
import { StepData } from '@/types/institutional-auth';
import { useTranslation } from 'react-i18next';
import './layout.css';

// 定义Layout组件接口
interface LayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  steps: StepData[];
  currentStep: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showBackButton = false,
  onBack,
  title = '',
  subtitle = '',
  steps,
  currentStep
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="layout-container">
      {/* 左侧步骤指示器 */}
      <div className="layout-sidebar flex-1 bg-gradient-to-br from-primary to-primary-dark text-white flex-col justify-between p-8 min-w-80">
        {/* 步骤指示器 */}
        <Step steps={steps} currentStep={currentStep} />
      </div>

      {/* 右侧内容区域 */}
      <div className="layout-content">
        {/* 右上角导航栏 */}
        <div className="layout-navbar flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          {/* 左侧：返回按钮（可选） */}
          {showBackButton && onBack && (
            <div className="layout-navbar-back">
              <button 
                className="navbar-back-button flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-200"
                onClick={onBack}
              >
                <img src="/arrow-left.svg" alt="Back" className="back-icon w-5 h-5" />
                <span className="back-text text-sm font-medium">{t('common.back')}</span>
              </button>
            </div>
          )}
          
          {/* 右侧：语言切换器和主题切换器 */}
          <div className="layout-navbar-controls flex items-center gap-4">
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
  );
};

export default Layout;