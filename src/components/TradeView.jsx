import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import './TradeView.css';

const TradeView = () => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState('trade');

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  return (
    <div className="trade-view">
      {/* Sidebar - Fixed on left */}
      <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
      
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
          <div className="breadcrumb">
            <span className="breadcrumb-item">{t('sidebar.dashboard')}</span>
            <img src="/slash.svg" alt="/" className="breadcrumb-slash" />
            <span className="breadcrumb-item active">{t('sidebar.trade')}</span>
          </div>

          {/* Page Title */}
          <h1 className="page-title">{t('sidebar.trade')}</h1>

          {/* Trade Cards */}
          <div className="trade-cards">
            <div className="trade-card">
              <div className="card-header">
                <h3 className="card-title">{t('trade.buyCrypto')}</h3>
                <span className="card-subtitle">{t('trade.buyCryptoSubtitle')}</span>
              </div>
              <div className="card-content">
                <p>{t('trade.buyCryptoDescription')}</p>
              </div>
            </div>

            <div className="trade-card">
              <div className="card-header">
                <h3 className="card-title">{t('trade.sellCrypto')}</h3>
                <span className="card-subtitle">{t('trade.sellCryptoSubtitle')}</span>
              </div>
              <div className="card-content">
                <p>{t('trade.sellCryptoDescription')}</p>
              </div>
            </div>

            <div className="trade-card">
              <div className="card-header">
                <h3 className="card-title">{t('trade.swap')}</h3>
                <span className="card-subtitle">{t('trade.swapSubtitle')}</span>
              </div>
              <div className="card-content">
                <p>{t('trade.swapDescription')}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradeView;