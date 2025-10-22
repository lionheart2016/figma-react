import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

// 移除未使用的BreadcrumbItem接口

// 定义User接口替代PrivyUser
interface User {
  id?: string;
  email?: string | { address: string; verified: boolean };
  phone?: string;
  name?: string;
}

// 定义Layout组件接口
interface LayoutProps {
  children: React.ReactNode;
  activeMenu?: string;
  user?: User | null;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeMenu,
  user
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
        <Header user={user} />

        {/* Content Area - Remove top padding since header margin is handled by CSS */}
        <main className="main-content">
          {/* Breadcrumb Navigation - Removed */}

          {/* Dynamic Content */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;