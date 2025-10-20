import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// 模拟依赖
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key: string, options?: any) => {
      const translations: Record<string, string> = {
        'auth.emailVerification.title': 'Email Verification',
        'auth.emailVerification.subtitle': 'Please enter the verification code sent to {{email}}',
        'auth.emailVerification.yourEmail': 'your email',
        'auth.emailVerification.verify': 'Verify',
        'auth.emailVerification.verifying': 'Verifying...',
        'auth.emailVerification.incompleteCode': 'Please enter a complete code',
        'auth.emailVerification.verificationFailed': 'Verification failed',
        'auth.emailVerification.didntReceiveCode': "Didn't receive the code?",
        'auth.emailVerification.resendCode': 'Resend Code',
        'auth.emailVerification.resendIn': 'Resend in {{timer}}s',
        'auth.emailVerification.resendingCode': 'Resending code to'
      };
      
      if (options && translations[key]) {
        let result = translations[key];
        Object.keys(options).forEach(option => {
          result = result.replace(`{{${option}}}`, options[option]);
        });
        return result;
      }
      
      return translations[key] || key;
    }),
    i18n: { changeLanguage: vi.fn() }
  }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// 导入要测试的组件
import EmailVerification from '../EmailVerification';

vi.mock('../../config/routes', () => ({
  ROUTES: {
    AUTHENTICATION: '/authentication',
    REGISTER: '/register'
  }
}));

// 模拟localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => store[key] = value),
    clear: vi.fn(() => store = {})
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('EmailVerification Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <EmailVerification />
    );
    expect(container).not.toBeNull();
  });

  it('renders title and subtitle', () => {
    localStorageMock.getItem.mockReturnValue('test@example.com');
    
    render(
      <EmailVerification />
    );
    
    expect(screen.getByText('Email Verification')).not.toBeNull();
    expect(screen.getByText('Please enter the verification code sent to test@example.com')).not.toBeNull();
  });

  it('renders 6 input fields for verification code', () => {
    const { container } = render(
      <EmailVerification />
    );
    
    const inputFields = container.querySelectorAll('input[type="text"]');
    expect(inputFields.length).toBe(6);
  });

  it('handles input correctly', () => {
    const { container } = render(
      <EmailVerification />
    );
    
    const firstInput = container.querySelectorAll('input')[0];
    fireEvent.change(firstInput, { target: { value: '1' } });
    expect(firstInput.value).toBe('1');
  });

  it('displays error message for incomplete code', () => {
    render(
      <EmailVerification />
    );
    
    const verifyButton = screen.getByText('Verify');
    fireEvent.click(verifyButton);
    
    expect(screen.getByText('Please enter a complete code')).not.toBeNull();
  });
});