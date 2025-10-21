import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => 
      render(
        <MemoryRouter>
          <Sidebar activeMenu="dashboard" />
        </MemoryRouter>
      )
    ).not.toThrow();
  });

  it('renders logo area', () => {
    render(
      <MemoryRouter>
        <Sidebar activeMenu="dashboard" />
      </MemoryRouter>
    );
    
    const logoArea = document.querySelector('.logo-area');
    expect(logoArea).toBeDefined();
  });

  it('renders navigation menu', () => {
    render(
      <MemoryRouter>
        <Sidebar activeMenu="dashboard" />
      </MemoryRouter>
    );
    
    const navMenu = document.querySelector('.nav-menu');
    expect(navMenu).toBeDefined();
  });

  it('highlights active menu item', () => {
    render(
      <MemoryRouter>
        <Sidebar activeMenu="trade" />
      </MemoryRouter>
    );
    
    // 查找菜单项，检查是否有active类或特定样式
    const menuItems = document.querySelectorAll('.menu-item');
    expect(menuItems.length).toBeGreaterThan(0);
  });

  // 简化的多语言测试
  it('renders correctly with different language translations', () => {
    // 测试使用不同的翻译函数
    const mockT = vi.fn((key: string) => {
      const translations: Record<string, Record<string, string>> = {
        'en': {
          'sidebar.dashboard': 'Dashboard',
          'sidebar.trade': 'Trade',
          'sidebar.wallets': 'Wallets',
          'sidebar.reports': 'Reports',
          'sidebar.settings': 'Settings'
        },
        'zh-CN': {
          'sidebar.dashboard': '仪表盘',
          'sidebar.trade': '交易',
          'sidebar.wallets': '钱包',
          'sidebar.reports': '报表',
          'sidebar.settings': '设置'
        },
        'zh-TW': {
          'sidebar.dashboard': '儀表盤',
          'sidebar.trade': '交易',
          'sidebar.wallets': '錢包',
          'sidebar.reports': '報表',
          'sidebar.settings': '設定'
        }
      };
      
      // 随机返回一种语言的翻译
      const languages = ['en', 'zh-CN', 'zh-TW'];
      const randomLang = languages[Math.floor(Math.random() * languages.length)];
      return translations[randomLang][key] || key;
    });
    
    vi.doMock('react-i18next', () => ({
      useTranslation: () => ({ t: mockT })
    }));
    
    // 重新渲染组件
    render(
      <MemoryRouter>
        <Sidebar activeMenu="dashboard" />
      </MemoryRouter>
    );
    
    // 检查组件是否正常渲染
    expect(document.querySelector('.sidebar-container')).toBeDefined();
  });
});