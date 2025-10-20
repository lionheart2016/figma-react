import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// 模拟依赖
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        'auth.layout.back': 'Back'
      };
      return translations[key] || key;
    }), 
    i18n: { changeLanguage: vi.fn() }
  }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// 模拟子组件
vi.mock('../global/LanguageSwitcher', () => ({
  default: () => <div data-testid="language-switcher">Language Switcher</div>
}));

vi.mock('../BrandSection.tsx', () => ({
  default: ({ showLogo }: { showLogo: boolean }) => (
    <div data-testid="brand-section">Brand Section {showLogo ? '(with logo)' : '(no logo)'}</div>
  )
}));

// 导入要测试的组件
import Layout from '../Layout';

describe('Layout Component', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <Layout>
          <div data-testid="child-content">Child Content</div>
        </Layout>
      );
      expect(container).not.toBeNull();
    });

    it('renders child content', () => {
      render(
        <Layout>
          <div data-testid="child-content">Child Content</div>
        </Layout>
      );
      
      expect(screen.getByTestId('child-content')).not.toBeNull();
      expect(screen.getByText('Child Content')).not.toBeNull();
    });

    it('renders BrandSection with logo by default', () => {
      render(
        <Layout>
          <div>Test</div>
        </Layout>
      );
      
      expect(screen.getByTestId('brand-section')).not.toBeNull();
    });

    it('renders LanguageSwitcher', () => {
      render(
        <Layout>
          <div>Test</div>
        </Layout>
      );
      
      expect(screen.getByTestId('language-switcher')).not.toBeNull();
    });

    it('renders title and subtitle when provided', () => {
      render(
        <Layout title="Test Title" subtitle="Test Subtitle">
          <div>Test</div>
        </Layout>
      );
      
      expect(screen.getByText('Test Title')).not.toBeNull();
      expect(screen.getByText('Test Subtitle')).not.toBeNull();
    });

    it('renders back button when showBackButton is true', () => {
      const onBackMock = vi.fn();
      
      render(
        <Layout showBackButton={true} onBack={onBackMock}>
          <div>Test</div>
        </Layout>
      );
      
      const backButton = screen.getByText('Back');
      expect(backButton).not.toBeNull();
    });

    it('calls onBack callback when back button is clicked', () => {
      const onBackMock = vi.fn();
      
      render(
        <Layout showBackButton={true} onBack={onBackMock}>
          <div>Test</div>
        </Layout>
      );
      
      const backButton = screen.getByText('Back');
      fireEvent.click(backButton);
      
      expect(onBackMock).toHaveBeenCalledTimes(1);
    });

    it('does not render back button when showBackButton is false', () => {
      render(
        <Layout showBackButton={false}>
          <div>Test</div>
        </Layout>
      );
      
      const backButton = screen.queryByText('Back');
      expect(backButton).toBeNull();
    });
  });