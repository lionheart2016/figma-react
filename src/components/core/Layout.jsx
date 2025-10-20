import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Header from './Header';

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
        {/* Header - Positioned at top right */}
        <Header user={user} onLogout={onLogout} />

        {/* Content Area */}
        <main className="main-content">
          {/* Breadcrumb */}
          {breadcrumbItems.length > 0 && (
            <div className="breadcrumb">
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <img src="/slash.svg" alt="/" className="breadcrumb-slash" />}
                  <span className={`breadcrumb-item ${index === breadcrumbItems.length - 1 ? 'active' : ''}`}>
                    {t(item)}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Page Title */}
          <h1 className="page-title">{t(pageTitle)}</h1>

          {/* Dynamic Content */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;