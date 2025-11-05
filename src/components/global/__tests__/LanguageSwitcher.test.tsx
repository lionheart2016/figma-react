import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '../LanguageSwitcher';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the react-i18next module
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'auth.languageSwitcher.languageSwitchFailed': 'Language switch failed'
        };
        return translations[key] || key;
      }
    })
  };
});

// Mock the LanguageContext
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn()
}));

// Mock the ThemeContext
vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn()
}));

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

describe('LanguageSwitcher Component', () => {
  const mockSwitchLanguage = vi.fn();
  const mockGetAvailableLanguages = vi.fn();
  const mockGetLanguageName = vi.fn();

  beforeEach(() => {
    vi.mocked(useLanguage).mockReturnValue({
      currentLanguage: 'en',
      switchLanguage: mockSwitchLanguage,
      getAvailableLanguages: mockGetAvailableLanguages,
      getLanguageName: mockGetLanguageName
    });

    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
      toggleTheme: vi.fn()
    });

    mockGetAvailableLanguages.mockReturnValue([
      { code: 'en', name: 'English' },
      { code: 'zh-CN', name: '简体中文' },
      { code: 'zh-TW', name: '繁體中文' }
    ]);

    mockGetLanguageName.mockImplementation((code: string) => {
      const languages: Record<string, string> = {
        'en': 'English',
        'zh-CN': '简体中文',
        'zh-TW': '繁體中文'
      };
      return languages[code] || code;
    });

    mockSwitchLanguage.mockResolvedValue(true);
  });

  it('should render language switcher button', () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换语言' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('English');
  });

  it('should show dropdown when button is clicked', () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换语言' });
    fireEvent.click(button);
    
    // 使用更具体的查询来避免多个匹配项
    const dropdown = screen.getByRole('button', { name: '切换语言' }).nextElementSibling;
    expect(dropdown).toBeInTheDocument();
    
    // 验证下拉菜单中的语言选项
    expect(screen.getByText('简体中文')).toBeInTheDocument();
    expect(screen.getByText('繁體中文')).toBeInTheDocument();
  });

  it('should close dropdown when clicking outside', () => {
    render(
      <div>
        <LanguageSwitcher />
        <div data-testid="outside">Outside element</div>
      </div>
    );
    
    const button = screen.getByRole('button', { name: '切换语言' });
    fireEvent.click(button);
    
    // 验证下拉菜单已打开
    expect(screen.getByText('简体中文')).toBeInTheDocument();
    
    // 点击外部元素
    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);
    
    // 验证下拉菜单已关闭
    expect(screen.queryByText('简体中文')).not.toBeInTheDocument();
  });

  it('should switch language when language option is clicked', async () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换语言' });
    fireEvent.click(button);
    
    const chineseOption = screen.getByText('简体中文');
    fireEvent.click(chineseOption);
    
    expect(mockSwitchLanguage).toHaveBeenCalledWith('zh-CN');
  });

  it('should close dropdown after successful language switch', async () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换语言' });
    fireEvent.click(button);
    
    const chineseOption = screen.getByText('简体中文');
    fireEvent.click(chineseOption);
    
    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // 验证下拉菜单已关闭 - 通过检查下拉菜单容器是否消失
    const dropdown = screen.getByRole('button', { name: '切换语言' }).nextElementSibling;
    expect(dropdown).not.toBeInTheDocument();
  });

  it('should handle language switch failure', async () => {
    mockSwitchLanguage.mockResolvedValue(false);
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换语言' });
    fireEvent.click(button);
    
    const chineseOption = screen.getByText('简体中文');
    fireEvent.click(chineseOption);
    
    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // 验证错误被记录
    expect(consoleSpy).toHaveBeenCalledWith('Language switch failed');
    
    consoleSpy.mockRestore();
  });

  it('should display correct language icons', () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换语言' });
    fireEvent.click(button);
    
    // 验证语言图标 - 使用更具体的查询避免多个匹配项
    const dropdown = screen.getByRole('button', { name: '切换语言' }).nextElementSibling;
    const optionIcons = dropdown.querySelectorAll('.option-icon');
    
    expect(optionIcons[0]).toHaveTextContent('🌐'); // English
    expect(optionIcons[1]).toHaveTextContent('🇨🇳'); // zh-CN
    expect(optionIcons[2]).toHaveTextContent('🇹🇼'); // zh-TW
  });

  it('should apply dark mode styles when in dark mode', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: true,
      toggleTheme: vi.fn()
    });
    
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换语言' });
    expect(button).toHaveClass('dark');
  });

  it('should highlight current language in dropdown', () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换语言' });
    fireEvent.click(button);
    
    // 使用更具体的查询来获取下拉菜单中的English选项
    const dropdown = screen.getByRole('button', { name: '切换语言' }).nextElementSibling;
    const englishOption = dropdown.querySelector('button:contains("English")');
    
    // 如果上面的查询不工作，使用更直接的方法
    const languageOptions = dropdown.querySelectorAll('button');
    const currentLanguageOption = languageOptions[0]; // 第一个选项应该是当前语言
    
    expect(currentLanguageOption).toHaveClass('active');
  });

  it('should support custom className', () => {
    render(<LanguageSwitcher className="custom-class" />);
    
    const container = screen.getByRole('button', { name: '切换语言' }).closest('div');
    expect(container).toHaveClass('custom-class');
  });
});