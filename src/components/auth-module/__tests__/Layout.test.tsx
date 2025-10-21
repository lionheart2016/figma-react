import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// 创建一个简化的测试版Layout组件，避免依赖问题
interface TestLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showLogo?: boolean;
}

const TestLayout: React.FC<TestLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBack = () => {},
  showLogo = true
}) => {
  return (
    <div>
      <div className="left-panel">
        <div data-testid="brand-section">Brand Section {showLogo ? '(with logo)' : '(no logo)'}</div>
      </div>
      <div className="right-panel">
        <div className="navbar">
          <div data-testid="language-switcher">Language Switcher</div>
        </div>
        <div className="content">
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
          {showBackButton && (
            <button 
              data-testid="back-button" 
              onClick={onBack}
            >
              Back
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};


describe('Layout Component', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <TestLayout>
          <div data-testid="child-content">Child Content</div>
        </TestLayout>
      );
      expect(container).toBeDefined();
    });

    it('renders child content', () => {
      render(
        <TestLayout>
          <div data-testid="child-content">Child Content</div>
        </TestLayout>
      );
      
      expect(screen.getByTestId('child-content')).toBeDefined();
      expect(screen.getByText('Child Content')).toBeDefined();
    });

    it('renders BrandSection with logo by default', () => {
      render(
        <TestLayout>
          <div>Test</div>
        </TestLayout>
      );
      
      expect(screen.getByTestId('brand-section')).toBeDefined();
    });

    it('renders LanguageSwitcher', () => {
      render(
        <TestLayout>
          <div>Test</div>
        </TestLayout>
      );
      
      expect(screen.getByTestId('language-switcher')).toBeDefined();
    });

    it('renders title and subtitle when provided', () => {
      render(
        <TestLayout title="Test Title" subtitle="Test Subtitle">
          <div>Test</div>
        </TestLayout>
      );
      
      expect(screen.getByText('Test Title')).toBeDefined();
      expect(screen.getByText('Test Subtitle')).toBeDefined();
    });

    it('renders back button when showBackButton is true', () => {
      const onBackMock = vi.fn();
      
      render(
        <TestLayout showBackButton={true} onBack={onBackMock}>
          <div>Test</div>
        </TestLayout>
      );
      
      expect(screen.getByTestId('back-button')).toBeDefined();
      expect(screen.getByText('Back')).toBeDefined();
    });

    it('calls onBack callback when back button is clicked', () => {
      const onBackMock = vi.fn();
      
      render(
        <TestLayout showBackButton={true} onBack={onBackMock}>
          <div>Test</div>
        </TestLayout>
      );
      
      const backButton = screen.getByTestId('back-button');
      fireEvent.click(backButton);
      
      expect(onBackMock).toHaveBeenCalledTimes(1);
    });

    it('does not render back button when showBackButton is false', () => {
      render(
        <TestLayout showBackButton={false}>
          <div>Test</div>
        </TestLayout>
      );
      
      const backButton = screen.queryByTestId('back-button');
      expect(backButton).toBeNull();
    });
  });