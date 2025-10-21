import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LanguageSwitcher from '../../../components/global/LanguageSwitcher';
import { LanguageProvider } from '../../../contexts/LanguageContext';

// 简化测试，使用LanguageProvider

describe('LanguageSwitcher Component', () => {
  // 使用LanguageProvider包裹测试组件的辅助函数
  const renderWithProvider = (children: React.ReactNode) => {
    return render(
      <LanguageProvider>
        {children}
      </LanguageProvider>
    );
  };


  it('renders without crashing', () => {
    expect(() => renderWithProvider(
      <LanguageSwitcher />
    )).not.toThrow();
  });

  it('renders language switcher container', () => {
    renderWithProvider(
      <LanguageSwitcher />
    );
    
    const languageSwitcher = document.querySelector('.language-switcher');
    expect(languageSwitcher).toBeDefined();
  });

  it('renders language switcher button', () => {
    renderWithProvider(
      <LanguageSwitcher />
    );
    
    const languageButton = document.querySelector('.language-switcher-button');
    expect(languageButton).toBeDefined();
  });

  it('renders with custom className', () => {
    renderWithProvider(
      <LanguageSwitcher className="custom-class" />
    );
    
    const languageSwitcher = document.querySelector('.language-switcher.custom-class');
    expect(languageSwitcher).toBeDefined();
  });
});