import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from '../ThemeSwitcher';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the ThemeContext
vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn()
}));

import { useTheme } from '@/contexts/ThemeContext';

describe('ThemeSwitcher Component', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
      toggleTheme: mockToggleTheme
    });
  });

  it('should render theme switcher button', () => {
    render(<ThemeSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换到暗黑主题' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('🌙');
  });

  it('should show moon icon in light mode', () => {
    render(<ThemeSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换到暗黑主题' });
    expect(button).toHaveTextContent('🌙');
  });

  it('should show sun icon in dark mode', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: true,
      toggleTheme: mockToggleTheme
    });
    
    render(<ThemeSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换到明亮主题' });
    expect(button).toHaveTextContent('☀️');
  });

  it('should call toggleTheme when button is clicked', () => {
    render(<ThemeSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换到暗黑主题' });
    fireEvent.click(button);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should have correct accessibility attributes in light mode', () => {
    render(<ThemeSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换到暗黑主题' });
    expect(button).toHaveAttribute('aria-label', '切换到暗黑主题');
    expect(button).toHaveAttribute('title', '暗黑主题');
  });

  it('should have correct accessibility attributes in dark mode', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: true,
      toggleTheme: mockToggleTheme
    });
    
    render(<ThemeSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换到明亮主题' });
    expect(button).toHaveAttribute('aria-label', '切换到明亮主题');
    expect(button).toHaveAttribute('title', '明亮主题');
  });

  it('should apply dark mode classes when in dark mode', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: true,
      toggleTheme: mockToggleTheme
    });
    
    render(<ThemeSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换到明亮主题' });
    const icon = button.querySelector('.theme-icon');
    expect(icon).toHaveClass('dark');
  });

  it('should apply light mode classes when in light mode', () => {
    render(<ThemeSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换到暗黑主题' });
    const icon = button.querySelector('.theme-icon');
    expect(icon).toHaveClass('light');
  });

  it('should support custom className', () => {
    render(<ThemeSwitcher className="custom-class" />);
    
    const button = screen.getByRole('button', { name: '切换到暗黑主题' });
    expect(button).toHaveClass('custom-class');
  });

  it('should maintain button functionality with custom className', () => {
    render(<ThemeSwitcher className="custom-class" />);
    
    const button = screen.getByRole('button', { name: '切换到暗黑主题' });
    fireEvent.click(button);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should render with proper structure', () => {
    render(<ThemeSwitcher />);
    
    const button = screen.getByRole('button', { name: '切换到暗黑主题' });
    const icon = button.querySelector('.theme-icon');
    
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('🌙');
  });
});