import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserInfo from '../UserInfo';
import { vi } from 'vitest';

// 创建测试所需的上下文数据
const mockUserContext = (overrides = {}) => {
  return {
    user: null,
    isAuthenticated: false,
    logout: vi.fn().mockResolvedValue(undefined),
    isLoading: false,
    error: null,
    ...overrides
  };
};

describe('UserInfo Component', () => {
  // 测试未认证用户显示
  test('should render user icon when not authenticated', () => {
    const context = mockUserContext();
    render(<UserInfo testContext={context} />);
    
    const userButton = screen.getByRole('button');
    expect(userButton).toBeInTheDocument();
    expect(userButton).toHaveTextContent('👤');
  });

  // 测试已认证用户显示（有邮箱）
  test('should display user email when authenticated with email', () => {
    const context = mockUserContext({
      user: {
        id: 'test-id-123',
        email: 'test@example.com'
      },
      isAuthenticated: true
    });
    
    render(
      <UserInfo testContext={context} showDropdownByDefault={true} />
    );
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  // 测试已认证用户显示（无邮箱，有钱包地址）
  test('should display wallet address when authenticated without email', () => {
    const context = mockUserContext({
      user: {
        id: 'test-id-123',
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678'
      },
      isAuthenticated: true
    });
    
    render(
      <UserInfo testContext={context} showDropdownByDefault={true} />
    );
    
    expect(screen.getByText(/钱包地址:/i)).toBeInTheDocument();
    expect(screen.getByText(/0x[0-9a-fA-F]+\.\.\.[0-9a-fA-F]+/)).toBeInTheDocument();
  });

  // 测试登出功能
  test('should call logout when logout button is clicked', async () => {
    const logout = vi.fn().mockResolvedValue(undefined);
    const context = mockUserContext({
      user: {
        id: 'test-id-123',
        email: 'test@example.com'
      },
      isAuthenticated: true,
      logout
    });
    
    render(
      <UserInfo testContext={context} showDropdownByDefault={true} />
    );
    
    const logoutButton = screen.getByText(/登出/i);
    await fireEvent.click(logoutButton);
    
    expect(logout).toHaveBeenCalledTimes(1);
  });

  // 测试自定义className
  test('should apply custom className', () => {
    const context = mockUserContext();
    const { container } = render(
      <UserInfo testContext={context} className="custom-class" />
    );
    
    const userInfoDiv = container.querySelector('.relative.custom-class');
    expect(userInfoDiv).toBeInTheDocument();
  });

  // 测试下拉菜单切换功能
  test('should toggle dropdown menu when button is clicked', () => {
    const context = mockUserContext({
      user: {
        id: 'test-id-123',
        email: 'test@example.com'
      },
      isAuthenticated: true
    });
    
    const { container } = render(<UserInfo testContext={context} />);
    
    // 初始状态下拉菜单不显示
    expect(container.querySelector('.absolute.right-0')).not.toBeInTheDocument();
    
    // 点击按钮后下拉菜单显示
    const userButton = screen.getByRole('button');
    fireEvent.click(userButton);
    
    expect(container.querySelector('.absolute.right-0')).toBeInTheDocument();
  });

  // 测试登出成功回调
  test('should call onLogoutSuccess after successful logout', async () => {
    const logout = vi.fn().mockResolvedValue(undefined);
    const onLogoutSuccess = vi.fn();
    
    const context = mockUserContext({
      user: {
        id: 'test-id-123',
        email: 'test@example.com'
      },
      isAuthenticated: true,
      logout
    });
    
    render(
      <UserInfo 
        testContext={context} 
        showDropdownByDefault={true}
        onLogoutSuccess={onLogoutSuccess}
      />
    );
    
    const logoutButton = screen.getByText(/登出/i);
    await fireEvent.click(logoutButton);
    
    expect(onLogoutSuccess).toHaveBeenCalledTimes(1);
  });
});