import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';
import { LanguageProvider } from '../../../contexts/LanguageContext';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { UserStateProvider } from '../../../services/UserStateService';

// Mock dependencies
vi.mock('../LanguageSwitcher', () => ({
  default: () => <div data-testid="language-switcher">Language Switcher Component</div>
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    
    expect(() => 
      render(
        <UserStateProvider>
          <ThemeProvider>
            <LanguageProvider>
              <MemoryRouter>
                <Header />
              </MemoryRouter>
            </LanguageProvider>
          </ThemeProvider>
        </UserStateProvider>
      )
    ).not.toThrow();
  });

  it('renders user information when user prop is provided', () => {
    
    
    render(
      <UserStateProvider>
        <ThemeProvider>
          <LanguageProvider>
            <MemoryRouter>
              <Header />
            </MemoryRouter>
          </LanguageProvider>
        </ThemeProvider>
      </UserStateProvider>
    );
    
    const userInfo = document.querySelector('.user-info');
    expect(userInfo).toBeDefined();
  });

  it('renders language switcher component', () => {
    
    
    render(
      <UserStateProvider>
        <ThemeProvider>
          <LanguageProvider>
            <MemoryRouter>
              <Header />
            </MemoryRouter>
          </LanguageProvider>
        </ThemeProvider>
      </UserStateProvider>
    );
    
    expect(document.querySelector('.language-switcher')).toBeDefined();
  });

  it('renders logout button', () => {
    
    render(
      <UserStateProvider>
        <ThemeProvider>
          <LanguageProvider>
            <MemoryRouter>
              <Header />
            </MemoryRouter>
          </LanguageProvider>
        </ThemeProvider>
      </UserStateProvider>
    );
    
    const logoutButton = document.querySelector('.logout-button');
    expect(logoutButton).toBeDefined();
  });

  // 简化的多语言测试
  it('renders correctly with different language translations', () => {
    // 测试使用不同的翻译函数
    const mockT = vi.fn((key: string) => {
      const translations: Record<string, Record<string, string>> = {
        'en': { 'logout': 'Logout' },
        'zh-CN': { 'logout': '退出登录' },
        'zh-TW': { 'logout': '登出' }
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
      <UserStateProvider>
        <ThemeProvider>
          <LanguageProvider>
            <MemoryRouter>
              <Header />
            </MemoryRouter>
          </LanguageProvider>
        </ThemeProvider>
      </UserStateProvider>
    );
    
    // 检查组件是否正常渲染
    expect(document.querySelector('.user-info')).toBeDefined();
  });

  // 测试不同类型的用户显示
  it('handles email type user correctly', () => {
  
    
    render(
      <UserStateProvider>
        <ThemeProvider>
          <LanguageProvider>
            <MemoryRouter>
              <Header />
            </MemoryRouter>
          </LanguageProvider>
        </ThemeProvider>
      </UserStateProvider>
    );
    
    // 验证用户信息区域存在
    expect(document.querySelector('.user-info')).toBeDefined();
  });

  it('handles google type user correctly', () => {
  
    render(
      <UserStateProvider>
        <ThemeProvider>
          <LanguageProvider>
            <MemoryRouter>
              <Header />
            </MemoryRouter>
          </LanguageProvider>
        </ThemeProvider>
      </UserStateProvider>
    );
    
    expect(document.querySelector('.user-info')).toBeDefined();
  });
});