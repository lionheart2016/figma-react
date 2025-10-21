import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'; // 导入DOM matchers

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
        'auth.authentication.uploadIdDocument': 'Upload ID Document',
        'auth.authentication.uploadIdDescription': 'Please upload a clear photo of your government-issued ID',
        'auth.authentication.uploadButton': 'Upload Document',
        'auth.authentication.personalInformation': 'Personal Information',
        'auth.authentication.personalInformationDescription': 'Please provide your personal details',
        'auth.authentication.continue': 'Continue',
        'auth.authentication.livenessDetection': 'Liveness Detection',
        'auth.authentication.livenessDetectionDescription': 'Verify your identity through our secure liveness check',
        'auth.authentication.startDetection': 'Start Detection',
        'auth.authentication.dragAndDrop': 'Drag and drop your file here',
        'auth.authentication.browseFiles': 'Browse files',
        'auth.authentication.requirements': 'Document Requirements',
        'auth.authentication.requirementClear': 'Clear and legible document',
        'auth.authentication.requirementCorners': 'All corners must be visible',
        'auth.authentication.requirementNoGlare': 'No glare or shadows',
        'auth.authentication.requirementFileSize': 'File size less than 5MB',
        'auth.authentication.firstName': 'First Name',
        'auth.authentication.lastName': 'Last Name',
        'auth.authentication.dateOfBirth': 'Date of Birth',
        'auth.authentication.nationality': 'Nationality',
        'auth.authentication.selectNationality': 'Select your nationality',
        'auth.authentication.detectionComplete': 'Detection Complete',
        'auth.authentication.detectionSuccess': 'Your identity has been verified successfully',
        'auth.authentication.nextStep': 'What happens next?',
        'auth.authentication.loginPrompt': 'You will be automatically logged in to your account',
        'auth.authentication.loginFailed': 'Login failed. Please try again.',
        'auth.authentication.processing': 'Processing...',
        'auth.authentication.completeLogin': 'Complete Login',
        'auth.layout.back': 'Back'
      };
      return translations[key] || key;
    }),
    i18n: { changeLanguage: vi.fn() }
  }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('../../config/routes', () => ({
  ROUTES: {
    HOME: '/',
    EMAIL_VERIFICATION: '/email-verification'
  }
}));

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

vi.mock('../BrandSection', () => ({
  default: () => <div data-testid="brand-section">Brand Section</div>
}));

vi.mock('../../components/global/LanguageSwitcher', () => ({
  default: () => <div data-testid="language-switcher">Language Switcher</div>
}));

// 导入要测试的组件
import Authentication from '../Authentication';

describe('Authentication Component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders with basic structure and initial content', () => {
    render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    );
    
    // 只验证组件基本结构
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
  });
});