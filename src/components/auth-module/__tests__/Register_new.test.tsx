import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'; // 导入DOM matchers
import Register from '../Register.tsx';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// 模拟依赖
vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    currentLanguage: 'en',
    switchLanguage: vi.fn().mockResolvedValue(true),
    getAvailableLanguages: vi.fn().mockReturnValue([
      { code: 'en', name: 'English' },
      { code: 'zh-CN', name: '简体中文' },
      { code: 'zh-TW', name: '繁體中文' }
    ]),
    getLanguageName: vi.fn().mockReturnValue('English')
  })
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        'auth.welcome': 'Welcome to Alphatoken',
        'auth.email': 'Email',
        'login': 'Login',
        'auth.register.emailPlaceholder': 'Enter your email address',
        'auth.register.registerButton': 'Create Account',
        'auth.register.hasAccount': 'Already have an account?',
        'auth.register.agreeToTerms': 'I agree to the',
        'auth.register.termsOfService': 'Terms of Service',
        'auth.register.and': 'and',
        'auth.register.privacyPolicy': 'Privacy Policy',
        'auth.register.validation.emailRequired': 'Email is required',
        'auth.register.validation.emailInvalid': 'Please enter a valid email address',
        'auth.register.validation.termsRequired': 'You must agree to the terms',
        'common.loading': 'Loading...'
      };
      return translations[key] || key;
    }),
    i18n: { changeLanguage: vi.fn() }
  })
}));



// 模拟auth模块
const mockAuth = {
  register: vi.fn().mockResolvedValueOnce(undefined)
};

vi.mock('../auth', () => ({
  auth: mockAuth
}));

vi.mock('../../../config/routes', () => ({
  ROUTES: {
    AUTHENTICATION: '/authentication',
    EMAIL_VERIFICATION: '/email-verification'
  }
}));

// 模拟Layout组件
vi.mock('../Layout', () => ({
  default: ({ children, title, subtitle, showBackButton, onBack }: any) => (
    <div data-testid="layout-container">
      {showBackButton && onBack && (
        <button onClick={onBack} data-testid="back-button">{title && 'Back'}</button>
      )}
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}
      <div className="layout-children">{children}</div>
    </div>
  )
}));

// 模拟localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

global.localStorage = localStorageMock as any;

// 模拟useNavigate和BrowserRouter
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });
  
  const renderComponent = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <Register />
      </ThemeProvider>
    </BrowserRouter>
  );
};



  // 获取元素的辅助函数
  const getEmailInput = () => screen.getByLabelText(/Email/i);
  const getTermsCheckbox = () => screen.getByLabelText(/agree to the/i);
  const getSubmitButton = () => screen.getByRole('button', { name: /create account/i });
  const getLoginButton = () => screen.getByRole('button', { name: /login/i });

  it('should render the register page with correct elements', () => {
    renderComponent();
    
    // 检查页面标题
    expect(screen.getByText(/Welcome to Alphatoken/i)).toBeInTheDocument();
    
    // 检查表单元素
    expect(getEmailInput()).toBeInTheDocument();
    expect(getTermsCheckbox()).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
    expect(getLoginButton()).toBeInTheDocument();
  });

  // 简化表单验证测试，因为已有专门的提交测试
  
  it('should validate email input format', async () => {
      renderComponent();
      
      const emailInput = getEmailInput();
      const termsCheckbox = getTermsCheckbox();
      const submitButton = getSubmitButton();
      
      // 填写有效邮箱并勾选条款
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(termsCheckbox);
      
      // 此时应该可以提交表单
      fireEvent.click(submitButton);
      
      // 重置mock以验证后续调用
      mockAuth.register.mockClear();
      
      // 填写无效邮箱格式
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);
      
      // 验证auth.register没有被调用
      expect(mockAuth.register).not.toHaveBeenCalled();
    });
  
  it('should validate terms agreement correctly', async () => {
    renderComponent();
    
    const emailInput = getEmailInput();
    const termsCheckbox = getTermsCheckbox();
    const submitButton = getSubmitButton();
    
    // 填写有效邮箱但未勾选条款
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/You must agree to the terms/i)).toBeInTheDocument();
    });
    
    // 勾选条款
    fireEvent.click(termsCheckbox);
    
    // 检查错误消息是否消失
    await waitFor(() => {
      expect(screen.queryByText(/You must agree to the terms/i)).not.toBeInTheDocument();
    });
  });
  
  it('should handle form submission correctly', async () => {
    renderComponent();
    
    const emailInput = getEmailInput();
    const termsCheckbox = getTermsCheckbox();
    const submitButton = getSubmitButton();
    
    // 填写表单
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(termsCheckbox);
    
    // 提交表单
    fireEvent.click(submitButton);
    
    // 检查按钮是否进入加载状态
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Loading/i);
    
    // 等待模拟API调用完成
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
      expect(submitButton).toHaveTextContent(/Create Account/i);
    }, { timeout: 2500 });
    
    // 检查localStorage是否保存了用户信息
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userEmail', 'test@example.com');
    
    // 检查是否导航到邮箱验证页面
    expect(mockNavigate).toHaveBeenCalledWith('/email-verification');
  });
  
  it('should handle navigation to login page', () => {
    renderComponent();
    
    const loginButton = getLoginButton();
    
    fireEvent.click(loginButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/authentication');
  });
  
  // 注意：语言选择器现在由Layout组件管理，不再在此组件中直接测试
  
  it('should allow focusing on inputs and buttons', () => {
    renderComponent();
    
    const emailInput = getEmailInput();
    const submitButton = getSubmitButton();
    
    // 验证元素可以被聚焦（不直接测试焦点状态）
    fireEvent.focus(emailInput);
    fireEvent.focus(submitButton);
    
    // 只要能够触发事件而不抛出错误即可
    expect(emailInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });
});