import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../Sidebar';

const Layout = ({ children, activeMenu, pageTitle, breadcrumbItems = [] }) => {
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
        <header className="header-menu">
          <div className="header-left">
            <div className="admin-section">
              <div className="admin-info">
                <img src="/profile-icon.svg" alt="Profile" className="profile-icon" />
                <span className="admin-name">{t('trade.admin')}</span>
                <img src="/chevron-down.svg" alt="Dropdown" className="chevron-down" />
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <img src="/notification-icon.svg" alt="Notifications" className="notification-icon" />
            <img src="/setting-icon.svg" alt="Settings" className="setting-icon" />
          </div>
        </header>

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