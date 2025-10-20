import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb';

const Layout = ({ children, activeMenu, pageTitle, breadcrumbItems = [], user, onLogout }) => {
  const { t } = useTranslation();
  const [currentActiveMenu, setCurrentActiveMenu] = useState(activeMenu);

  const handleMenuClick = (menuId) => {
    setCurrentActiveMenu(menuId);
  };

  return (
    <div className="trade-view">
      {/* Sidebar - Fixed on left */}
      <Sidebar activeMenu={currentActiveMenu} onMenuClick={handleMenuClick} />
      
      {/* Main Content Area */}
      <div className="main-layout">
        {/* Header - Fixed at top with proper z-index */}
        <Header user={user} onLogout={onLogout} />

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