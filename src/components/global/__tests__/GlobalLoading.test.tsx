import React from 'react';
import { render, screen } from '@testing-library/react';
import GlobalLoading from '../GlobalLoading';
import { describe, it, expect, vi } from 'vitest';

// Mock the react-i18next module
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'common.loadingInitializing': 'Initializing...',
          'common.loadingPleaseWait': 'Please wait...',
          'common.loadingTakingLonger': 'This is taking longer than expected',
          'common.loadingInitializingApp': 'Initializing Application'
        };
        return translations[key] || key;
      }
    })
  };
});

describe('GlobalLoading Component', () => {
  it('should render with default message', () => {
    render(<GlobalLoading />);
    
    expect(screen.getByText('Initializing...')).toBeInTheDocument();
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
    expect(screen.getByText('Initializing Application')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<GlobalLoading message="Custom loading message" />);
    
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('should not show timeout warning by default', () => {
    render(<GlobalLoading />);
    
    expect(screen.queryByText('This is taking longer than expected')).not.toBeInTheDocument();
  });

  it('should show timeout warning when showTimeoutWarning is true', () => {
    render(<GlobalLoading showTimeoutWarning={true} />);
    
    expect(screen.getByText('This is taking longer than expected')).toBeInTheDocument();
  });

  it('should render with custom timeout message', () => {
    render(<GlobalLoading showTimeoutWarning={true} timeoutMessage="Custom timeout message" />);
    
    expect(screen.getByText('Custom timeout message')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<GlobalLoading />);
    
    // 查找根容器元素
    const loadingContainer = screen.getByText('Initializing...').closest('.fixed');
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).toHaveClass('inset-0');
    expect(loadingContainer).toHaveClass('z-50');
  });

  it('should render loading animation elements', () => {
    render(<GlobalLoading />);
    
    // 检查加载动画元素
    const spinner = document.querySelector('.animate-spin');
    const pulse = document.querySelector('.animate-pulse');
    
    expect(spinner).toBeInTheDocument();
    expect(pulse).toBeInTheDocument();
  });

  it('should render bouncing dots for progress indicator', () => {
    render(<GlobalLoading />);
    
    const dots = document.querySelectorAll('.animate-bounce');
    expect(dots).toHaveLength(3);
  });

  it('should apply dark mode classes', () => {
    render(<GlobalLoading />);
    
    // 验证根容器有暗黑模式类
    const rootContainer = screen.getByText('Initializing...').closest('.fixed');
    expect(rootContainer).toHaveClass('dark:bg-gray-900');
    
    // 验证文本有暗黑模式类
    const textElement = screen.getByText('Initializing...');
    expect(textElement).toHaveClass('dark:text-white');
  });
});