'use client';

import React from 'react';

// 定义BrandSection组件接口
interface BrandSectionProps {
  className?: string;
  showLogo?: boolean;
}

const BrandSection: React.FC<BrandSectionProps> = ({ className = "", showLogo = true }) => {
  return (
    <div className={`relative w-[475px] h-screen overflow-hidden flex-shrink-0 ${className}`}>
      {/* 仅显示品牌背景图像 */}
      {showLogo && (
        <img 
          src="/brand-delivery-bg.png" 
          alt="Brand background" 
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
        />
      )}
    </div>
  );
};

export default BrandSection;