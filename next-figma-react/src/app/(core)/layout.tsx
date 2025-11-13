'use client';

import React, { useState } from 'react';
import Header from '@/components/core/Header';
import Sidebar from '@/components/core/Sidebar';
import Breadcrumb from '@/components/core/Breadcrumb';

// 定义Layout组件接口
interface LayoutProps {
  children: React.ReactNode;
  activeMenu?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeMenu
}) => {
    const [currentActiveMenu, setCurrentActiveMenu] = useState<string>(activeMenu || '');

  const handleMenuClick = (menuId: string): void => {
    setCurrentActiveMenu(menuId);
  };

  return (
    <div className="layout-container">
      {/* Sidebar - Fixed on left */}
      <Sidebar activeMenu={currentActiveMenu} onMenuClick={handleMenuClick} />
      
      {/* Main Content Area */}
      <div className="layout-content">
        {/* Header - Fixed at top with proper z-index */}
        <Header />

        {/* Content Area - Remove top padding since header margin is handled by CSS */}
        <main className="layout-main-content flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <Breadcrumb />
          <div className="mt-4">
            {/* Dynamic Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;