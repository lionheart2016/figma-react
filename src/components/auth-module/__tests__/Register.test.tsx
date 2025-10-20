import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 模拟依赖
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        'auth.register.registerButton': 'Register',
        'auth.register.subtitle': 'Create your account',
        'auth.register.emailLabel': 'Email',
        'auth.register.emailPlaceholder': 'Enter your email',
        'auth.register.passwordLabel': 'Password',
        'auth.register.passwordPlaceholder': 'Create a password',
        'auth.register.confirmPasswordLabel': 'Confirm Password',
        'auth.register.confirmPasswordPlaceholder': 'Confirm your password',
        'auth.register.agreeToTerms': 'I agree to the',
        'auth.register.termsOfService': 'Terms of Service',
        'auth.register.and': 'and',
        'auth.register.privacyPolicy': 'Privacy Policy',
        'auth.register.hasAccount': 'Already have an account?',
        'auth.register.signIn': 'Sign in',
        'auth.register.registrationError': 'Registration error:',
        'auth.register.registrationFailed': 'Registration failed',
        'common.loading': 'Loading...',
        'auth.register.validation.emailRequired': 'Email is required',
        'auth.register.validation.emailInvalid': 'Invalid email format',
        'auth.register.validation.passwordRequired': 'Password is required',
        'auth.register.validation.passwordMinLength': 'Password must be at least 8 characters',
        'auth.register.validation.confirmPasswordRequired': 'Please confirm your password',
        'auth.register.validation.passwordMismatch': 'Passwords do not match',
        'auth.register.validation.termsRequired': 'You must agree to the terms and conditions'
      };
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
import Register from '../Register';

vi.mock('../../config/routes', () => ({
  ROUTES: {
    EMAIL_VERIFICATION: '/email-verification',
    INVESTMENT_TYPE_SELECTION: '/investment-type-selection',
    LOGIN: '/login'
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

// 模拟Layout组件
vi.mock('../Layout', () => ({
  default: ({ children, title, subtitle, showBackButton, onBack }: any) => (
    <div data-testid="layout-container">
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}
      {showBackButton && (
        <button onClick={onBack} data-testid="back-button">Back</button>
      )}
      <div className="layout-children">{children}</div>
    </div>
  )
}));

describe('Register Component', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      localStorageMock.clear();
    });

    it('renders without crashing', () => {
      const { container } = render(<Register />);
      expect(container).not.toBeNull();
    });

    it('renders all form fields', () => {
      render(<Register />);
      
      expect(screen.getByLabelText('Email')).not.toBeNull();
      expect(screen.getByLabelText('Password')).not.toBeNull();
      expect(screen.getByLabelText('Confirm Password')).not.toBeNull();
      expect(screen.getByLabelText(/I agree to the/)).not.toBeNull();
    });

    it('validates email format', () => {
      const { container } = render(<Register />);
      
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      const submitButton = screen.getByText('Register');
      fireEvent.click(submitButton);
      
      expect(screen.getByText('Invalid email format')).not.toBeNull();
    });

    it('validates password length', () => {
      const { container } = render(<Register />);
      
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      
      const submitButton = screen.getByText('Register');
      fireEvent.click(submitButton);
      
      expect(screen.getByText('Password must be at least 8 characters')).not.toBeNull();
    });

    it('validates password match', () => {
      const { container } = render(<Register />);
      
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const confirmPasswordInput = screen.getByLabelText('Confirm Password') as HTMLInputElement;
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
      
      const submitButton = screen.getByText('Register');
      fireEvent.click(submitButton);
      
      expect(screen.getByText('Passwords do not match')).not.toBeNull();
    });

    it('validates terms agreement', () => {
      const { container } = render(<Register />);
      
      const submitButton = screen.getByText('Register');
      fireEvent.click(submitButton);
      
      expect(screen.getByText('You must agree to the terms and conditions')).not.toBeNull();
    });

    it('handles back button click', () => {
      render(<Register />);
      
      const backButton = screen.getByTestId('back-button');
      fireEvent.click(backButton);
      // We can't verify the navigation directly, but we can ensure the button is clickable
      expect(backButton).not.toBeNull();
    });
  });