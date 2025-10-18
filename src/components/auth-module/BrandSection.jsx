import React from 'react';
import { useTranslation } from 'react-i18next';
import './BrandSection.css';

const BrandSection = ({ 
  title = "", 
  showLogo = true,
  className = "" 
}) => {
  const { t } = useTranslation();
  const displayTitle = title || t('auth.brand.description');
  
  return (
    <div className={`brand-section ${className}`}>
      {/* 品牌背景图像 */}
      <img 
        src="/brand-delivery-bg.png" 
        alt="Brand background" 
        className="brand-bg-image"
      />
      
      {/* 蓝色覆盖层 */}
      <div className="brand-overlay"></div>
      
      {/* 渐变效果 */}
      <div className="brand-gradient"></div>
      
      {/* 品牌内容 */}
      <div className="brand-content">
        {/* 品牌标识 */}
        {showLogo && (
          <div className="brand-logo">
            <img 
              src="/alphatoken-logo.svg" 
              alt={t('auth.brand.altText')} 
              className="logo-image"
            />
            <span className="brand-name">{t('auth.brand.name')}</span>
          </div>
        )}
        
        {/* 描述卡片 */}
        <div className="brand-description">
          <div className="description-card">
            <p className="description-text">{displayTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSection;