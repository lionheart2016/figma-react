import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserInfo from '../UserInfo';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { UserStateProvider } from '../../../services/UserStateService';
import { useUser, useUserState } from '../../../services/UserStateService';


// Mock the react-i18next module
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'userInfo.login': 'Login',
          'userInfo.logout': 'Logout',
          'userInfo.connected': 'Connected'
        };
        return translations[key] || key;
      }
    })
  };
});

// Mock the UserContext
vi.mock('../../../services/UserStateService', () => ({
  useUser: vi.fn(),
  useUserState: vi.fn(),
  UserStateProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('UserInfo Component', () => {
  beforeEach(() => {
    // 默认模拟未登录状态
    vi.mocked(useUser).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false
    });
    
    // 模拟钱包状态
    vi.mocked(useUserState).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      walletState: {
        wallets: [],
        activeWallet: null,
        hasEmbeddedWallet: false,
        isLoading: false,
        error: null
      }
    });
  });

  it('should render the user icon button', () => {
    render(
      <ThemeProvider>
        <UserStateProvider>
          <UserInfo />
        </UserStateProvider>
      </ThemeProvider>
    );

    const userButton = screen.getByRole('button');
    expect(userButton).toBeInTheDocument();
  });

  it('should toggle dropdown menu visibility on button click', () => {
    const { container } = render(
      <ThemeProvider>
        <UserStateProvider>
          <UserInfo />
        </UserStateProvider>
      </ThemeProvider>
    );

    // 初始状态下菜单应该隐藏
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();

    // 第一次点击 - 打开菜单
    const userButton = screen.getByRole('button');
    fireEvent.click(userButton);

    // 菜单应该显示，但根据组件逻辑，未登录状态下只会显示Login按钮
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();

    // 第二次点击 - 关闭菜单
    fireEvent.click(userButton);

    // 菜单应该隐藏
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('should show login button when user is not authenticated', () => {
    // 模拟未登录状态
    vi.mocked(useUser).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn()
    });

    render(
      <ThemeProvider>
        <UserStateProvider>
          <UserInfo />
        </UserStateProvider>
      </ThemeProvider>
    );

    // 打开菜单
    fireEvent.click(screen.getByRole('button'));
    
    // 验证未登录状态内容
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('should show logout button when user is authenticated', () => {
    // 模拟已登录状态
    vi.mocked(useUser).mockReturnValue({
      user: { email: 'test@example.com' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false
    });
    
    vi.mocked(useUserState).mockReturnValue({
      user: { email: 'test@example.com' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      walletState: {
        wallets: [
          { address: '0x1234567890abcdef', name: 'Main Wallet', type: 'embedded' }
        ],
        activeWallet: { address: '0x1234567890abcdef', name: 'Main Wallet', type: 'embedded' },
        hasEmbeddedWallet: true,
        isLoading: false,
        error: null
      }
    });

    render(
      <ThemeProvider>
        <UserStateProvider>
          <UserInfo />
        </UserStateProvider>
      </ThemeProvider>
    );

    // 打开菜单
    fireEvent.click(screen.getByRole('button'));
    
    // 验证已登录状态内容
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('should handle event propagation correctly', () => {
    const { container } = render(
      <ThemeProvider>
        <UserStateProvider>
          <UserInfo />
          <div data-testid="outside-area">Outside Area</div>
        </UserStateProvider>
      </ThemeProvider>
    );

    // 打开菜单
    fireEvent.click(screen.getByRole('button'));
    
    // 验证菜单已显示
    expect(screen.getByText('Login')).toBeInTheDocument();
    
    // 点击菜单内部区域（但不是按钮）- 应保持显示
    const menuContainer = container.querySelector('.absolute'); // 查找绝对定位的菜单容器
    if (menuContainer) {
      fireEvent.click(menuContainer);
      expect(screen.getByText('Login')).toBeInTheDocument(); // 菜单保持显示
    }
    
    // 点击菜单外部 - 应关闭菜单
    const outsideArea = screen.getByTestId('outside-area');
    fireEvent.click(outsideArea);
    
    expect(screen.queryByText('Login')).not.toBeInTheDocument(); // 菜单关闭
  });

  it('should support internationalization for different languages', () => {
    // 测试现有的国际化mock是否正常工作
    render(
      <ThemeProvider>
        <UserStateProvider>
          <UserInfo />
        </UserStateProvider>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button'));
    
    // 验证默认的英文翻译是否正常工作
    expect(screen.getByText('Login')).toBeInTheDocument();
    
    // 验证翻译键值映射是否正确
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeInTheDocument();
    
    // 验证国际化功能已集成到组件中
    expect(screen.queryByText('userInfo.login')).not.toBeInTheDocument(); // 确保显示的是翻译后的文本，不是键名
  });
});