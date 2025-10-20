import React from 'react';
import './BrandSection.css';

const BrandSection = ({ className = "" }) => {
  return (
    <div className={`brand-section ${className}`}>
      {/* 仅显示品牌背景图像 */}
      <img 
        src="/brand-delivery-bg.png" 
        alt="Brand background" 
        className="brand-bg-image"
      />
    </div>
  );
};

export default BrandSection;