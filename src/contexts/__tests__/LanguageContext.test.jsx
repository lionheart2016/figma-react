import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageProvider, useLanguage } from '../LanguageContext';

// 测试用组件，用于测试useLanguage钩子
const TestComponent = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  return (
    <div data-testid="language-data">
      <div data-testid="current-language">{currentLanguage}</div>
      <button 
        data-testid="change-language-btn" 
        onClick={() => changeLanguage('zh-CN')}
      >
        切换语言
      </button>
    </div>
  );
};

describe('LanguageContext', () => {
  it('LanguageProvider renders without crashing', () => {
    render(
      <LanguageProvider>
        <div>Test</div>
      </LanguageProvider>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  test('useLanguage hook provides expected values', () => {
    // 模拟getCurrentLanguage函数返回'en'
    vi.mock('../config/i18n', () => ({
      getCurrentLanguage: () => 'en',
      changeLanguage: vi.fn(),
      getLanguageName: vi.fn()
    }));
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    // 检查组件是否正确渲染
    expect(screen.getByTestId('current-language')).toBeInTheDocument();
  });

  it('LanguageProvider properly wraps children', () => {
    const { container } = render(
      <LanguageProvider>
        <div className="test-child">Child Content</div>
      </LanguageProvider>
    );
    
    const childElement = container.querySelector('.test-child');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Child Content');
  });
});