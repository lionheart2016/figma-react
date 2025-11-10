import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Sidebar.css';

// 定义菜单项接口
interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

// 定义Sidebar组件接口
interface SidebarProps {
  activeMenu: string;
  onMenuClick?: (menuId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuClick }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: '/dashboard-icon.svg', route: '/dashboard' },
    { id: 'trade', label: t('sidebar.trade'), icon: '/trade-icon.svg', route: '/trade' },
    { id: 'wallets', label: t('sidebar.wallets'), icon: '/wallets-icon.svg', route: '/wallets' },
    { id: 'reports', label: t('sidebar.reports'), icon: '/reports-icon.svg', route: '/reports' },
    { id: 'settings', label: t('sidebar.settings'), icon: '/settings-icon.svg', route: '/settings' }
  ];

  const handleMenuClick = (menuItem: MenuItem): void => {
    onMenuClick?.(menuItem.id);
    navigate(menuItem.route);
  };

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo">
          <img src="/alphatoken-logo.svg" />
          <span className="logo-text">{t('auth.brandname')}</span>
        </div>
        <div className="divider"></div>
      </div>
      
      <nav className="menu">
        {menuItems.map(item => (
          <div
            key={item.id}
            className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => handleMenuClick(item)}
          >
            <div className="menu-item-bg"></div>
            <img src={item.icon} alt={item.label} className="menu-icon" />
            <span className="menu-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;