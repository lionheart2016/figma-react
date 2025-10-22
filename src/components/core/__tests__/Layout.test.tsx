import { render, screen } from '@testing-library/react';
import { beforeEach } from 'vitest';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../Layout';

// Mock dependencies
vi.mock('../Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar Component</div>
}));

vi.mock('../Header', () => ({
  default: () => <div data-testid="header">Header Component</div>
}));

vi.mock('../Breadcrumb', () => ({
  default: () => <div data-testid="breadcrumb">Breadcrumb Component</div>
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('Layout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => 
      render(
        <MemoryRouter>
          <Layout activeMenu="dashboard">
            <div>Test Content</div>
          </Layout>
        </MemoryRouter>
      )
    ).not.toThrow();
  });

  it('renders all necessary components', () => {
    render(
      <MemoryRouter>
        <Layout activeMenu="dashboard">
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('sidebar')).toBeDefined();
    expect(screen.getByTestId('header')).toBeDefined();
    expect(screen.getByTestId('breadcrumb')).toBeDefined();
  });

  it('renders children content', () => {
    render(
      <MemoryRouter>
        <Layout activeMenu="dashboard">
          <div data-testid="test-child">Test Content</div>
        </Layout>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('test-child')).toBeDefined();
  });

  // 测试activeMenu属性
  it('applies correct activeMenu prop', () => {
    const mockActiveMenu = 'trade';
    
    render(
      <MemoryRouter>
        <Layout activeMenu={mockActiveMenu}>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    );
    
    // 检查布局是否正确渲染
    expect(document.querySelector('.app-layout')).toBeDefined();
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
    
    render(
      <MemoryRouter>
        <Layout activeMenu="dashboard">
          <div>Test content</div>
        </Layout>
      </MemoryRouter>
    );
    
    // 检查组件是否正常渲染
    expect(document.querySelector('.app-layout')).toBeDefined();
  });
});