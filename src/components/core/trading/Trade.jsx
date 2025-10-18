import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Trade.css';

const Trade = () => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState('Trade');
  const [selectedNetwork, setSelectedNetwork] = useState('All EVM Networks');

  const menuItems = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: 'dashboard-icon.svg' },
    { id: 'trade', label: t('sidebar.trade'), icon: 'trade-icon.svg' },
    { id: 'wallets', label: t('sidebar.wallets'), icon: 'wallet-icon.svg' },
    { id: 'reports', label: t('sidebar.reports'), icon: 'reports-icon.svg' },
    { id: 'settings', label: t('sidebar.settings'), icon: 'settings-icon.svg' }
  ];

  const networks = [
    t('networks.allEVMNetworks'),
    t('networks.ethereum'),
    t('networks.avalanche'),
    t('networks.optimism'),
    t('networks.arbitrum'),
    t('networks.bsc'),
    t('networks.gnosisSafe'),
    t('networks.rinkeby'),
    t('networks.goerli'),
    t('networks.bitcoin'),
    t('networks.allNetworks')
  ];

  return (
    <div className="trade-container">
      {/* 顶部导航栏 */}
      <header className="trade-header">
        <div className="header-left">
          <div className="admin-section">
            <img src="/personal-profile.svg" alt={t('trade.profile')} className="profile-icon" />
            <div className="admin-info">
              <span className="admin-name">{t('trade.alphatokenAdmin')}</span>
              <img src="/chevron-down.svg" alt={t('common.dropdown')} className="dropdown-icon" />
            </div>
          </div>
        </div>
        <div className="header-right">
          <img src="/notification.svg" alt={t('common.notification')} className="notification-icon" />
          <img src="/setting.svg" alt={t('common.settings')} className="setting-icon" />
        </div>
      </header>

      <div className="trade-content">
        {/* 左侧菜单栏 */}
        <aside className="trade-sidebar">
          <div className="logo-section">
            <div className="logo-container">
              <span className="logo-text">{t('common.alphatoken')}</span>
              <div className="logo-icon"></div>
            </div>
            <div className="divider"></div>
          </div>

          <nav className="menu-nav">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => setActiveMenu(item.id)}
              >
                <div className="menu-icon"></div>
                <span className="menu-label">{item.label}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* 主内容区域 */}
        <main className="trade-main">
          <div className="trade-header-section">
            <h1 className="trade-title">{t('trade.title')}</h1>
            <div className="network-selector">
              <select 
                value={selectedNetwork} 
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="network-select"
              >
                {networks.map((network) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 投资档案完成提示 */}
          <div className="investment-profile-card">
            <div className="profile-card-content">
              <img src="/investment-complete.svg" alt={t('trade.investmentProfile')} className="profile-icon-large" />
              <div className="profile-text">
                <h3>{t('trade.completeInvestmentProfile')}</h3>
                <p>{t('trade.completeInvestmentProfileDesc')}</p>
              </div>
              <button className="complete-button">{t('trade.complete')}</button>
            </div>
          </div>

          {/* 交易面板区域 */}
          <div className="trading-section">
            <div className="trading-card">
              <div className="card-header">
                <h3>{t('trade.tradingPanel')}</h3>
                <div className="card-actions">
                  <button className="action-btn">{t('trade.buy')}</button>
                  <button className="action-btn">{t('trade.sell')}</button>
                </div>
              </div>
              
              <div className="trading-form">
                <div className="form-group">
                  <label>{t('trade.amount')}</label>
                  <input type="text" placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>{t('trade.price')}</label>
                  <input type="text" placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>{t('trade.total')}</label>
                  <input type="text" placeholder="0.00" readOnly />
                </div>
                <button className="trade-button">{t('trade.placeOrder')}</button>
              </div>
            </div>

            {/* 交易历史 */}
            <div className="transaction-history">
              <h3>{t('trade.recentTransactions')}</h3>
              <div className="history-list">
                <div className="history-item">
                  <span className="transaction-type">{t('trade.buy')}</span>
                  <span className="transaction-amount">0.5 ETH</span>
                  <span className="transaction-price">$1,500</span>
                  <span className="transaction-time">2 hours ago</span>
                </div>
                <div className="history-item">
                  <span className="transaction-type">{t('trade.sell')}</span>
                  <span className="transaction-amount">1.2 BTC</span>
                  <span className="transaction-price">$48,000</span>
                  <span className="transaction-time">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Trade;