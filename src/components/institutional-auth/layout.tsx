import React, { ReactNode } from 'react';
import BrandSection from '../auth-module/BrandSection';
import LanguageSwitcher from '../global/LanguageSwitcher';
import ThemeSwitcher from '../global/ThemeSwitcher';
import Step from './Step';
import { StepData } from './Step';
import { useTranslation } from 'react-i18next';
import './layout.css';

// Step接口已移至Step组件中

// 定义Layout组件接口
interface LayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  steps: StepData[];
  currentStep: number;
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
    <div className="institutional-auth-layout">
      {/* 左侧步骤指示器 */}
      <div className="institutional-auth-layout-left">

        
        {/* 步骤指示器 */}
        <Step steps={steps} currentStep={currentStep} />
      </div>

      {/* 右侧内容区域 */}
      <div className="institutional-auth-layout-right">
        {/* 右上角导航栏 */}
        <div className="institutional-auth-layout-navbar">
          {/* 左侧：返回按钮（可选） */}
          {showBackButton && onBack && (
            <div className="institutional-auth-layout-back">
              <button 
                className="back-button"
                onClick={onBack}
              >
                <img src="/arrow-left.svg" alt="Back" className="back-icon" />
                <span className="back-text">{t('auth.layout.back')}</span>
              </button>
            </div>
          )}
          
          {/* 右侧：语言切换器和主题切换器 */}
          <div className="institutional-auth-layout-language">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        {/* 右下角内容区域 */}
        <div className="institutional-auth-layout-content">
          {/* 标题区域 */}
          {(title || subtitle) && (
            <div className="institutional-auth-layout-header">
              {title && <h1 className="institutional-auth-layout-title">{title}</h1>}
              {subtitle && <p className="institutional-auth-layout-subtitle">{subtitle}</p>}
            </div>
          )}
          
          {/* 主要内容 */}
          <div className="institutional-auth-layout-main">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;