import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';

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
    <div className="trade-view">
      {/* Sidebar - Fixed on left */}
      <Sidebar activeMenu={currentActiveMenu} onMenuClick={handleMenuClick} />
      
      {/* Main Content Area */}
      <div className="main-layout">
        {/* Header - Fixed at top with proper z-index */}
        <Header />

        {/* Content Area - Remove top padding since header margin is handled by CSS */}
        <main className="main-content">
          {/* Breadcrumb Navigation */}
          <Breadcrumb />
          
          {/* Dynamic Content */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;