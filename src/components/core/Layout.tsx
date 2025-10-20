import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb';

// 定义Breadcrumb项接口
interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

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
  pageTitle?: string;
  breadcrumbItems?: BreadcrumbItem[];
  user?: User | null;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeMenu, 
  pageTitle, 
  breadcrumbItems = [], 
  user 
}) => {
  const { t } = useTranslation();
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
          {/* Breadcrumb Navigation - Only shown on secondary pages */}
          <Breadcrumb />

          {/* Dynamic Content */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;