import React from 'react';
import BrandSection from './BrandSection';
import { LanguageSwitcher } from '../global';
import { useTranslation } from 'react-i18next';
import './Layout.css';

const Layout = ({ 
  children, 
  showBackButton = false, 
  onBack, 
  title = "",
  subtitle = "" 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="auth-layout">
      {/* 左侧品牌区域 */}
      <div className="auth-layout-left">
        <BrandSection 
          showLogo={true}
        />
      </div>

      {/* 右侧内容区域 */}
      <div className="auth-layout-right">
        {/* 右上角导航栏 */}
        <div className="auth-layout-navbar">
          {/* 左侧：返回按钮（可选） */}
          {showBackButton && (
            <div className="auth-layout-back">
              <button 
                className="back-button"
                onClick={onBack}
              >
                <img src="/arrow-left.svg" alt="Back" className="back-icon" />
                <span className="back-text">{t('auth.layout.back')}</span>
              </button>
            </div>
          )}
          
          {/* 右侧：语言切换器 */}
          <div className="auth-layout-language">
            <LanguageSwitcher />
          </div>
        </div>

        {/* 右下角内容区域 */}
        <div className="auth-layout-content">
          {/* 标题区域 */}
          {(title || subtitle) && (
            <div className="auth-layout-header">
              {title && <h1 className="auth-layout-title">{title}</h1>}
              {subtitle && <p className="auth-layout-subtitle">{subtitle}</p>}
            </div>
          )}
          
          {/* 主要内容 */}
          <div className="auth-layout-main">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;