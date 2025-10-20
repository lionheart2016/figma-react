import React from 'react';
import './BrandSection.css';

// 定义BrandSection组件接口
interface BrandSectionProps {
  className?: string;
  showLogo?: boolean;
}

const BrandSection: React.FC<BrandSectionProps> = ({ className = "", showLogo = true }) => {
  return (
    <div className={`brand-section ${className}`}>
      {/* 仅显示品牌背景图像 */}
      {showLogo && (
        <img 
          src="/brand-delivery-bg.png" 
          alt="Brand background" 
          className="brand-bg-image"
        />
      )}
    </div>
  );
};

export default BrandSection;