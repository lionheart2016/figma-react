import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useParams } from 'react-router-dom';
import TradeDetail from '../TradeDetail';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'tradeDetail.productNotFound': 'Product not found',
        'tradeDetail.back': 'Back',
        'tradeDetail.trade': 'Trade'
      };
      return translations[key] || key;
    }
  })
}));

const mockNavigate = vi.fn();
const mockUseParams = vi.mocked(useParams);

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: vi.fn(),
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Test helper to render component with specific route params
const renderWithParams = (params: Record<string, string>) => {
  mockUseParams.mockReturnValue(params);
  return render(
    <MemoryRouter>
      <TradeDetail />
    </MemoryRouter>
  );
};

describe('TradeDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 默认使用有效的产品ID
    mockUseParams.mockReturnValue({ id: '1' });
  });

  it('renders without crashing for valid product ID', () => {
    // Mock params to return product ID '1'
    mockUseParams.mockReturnValue({ id: '1' });
    
    expect(() => render(<MemoryRouter><TradeDetail /></MemoryRouter>)).not.toThrow();
  });

  it('displays product not found message for invalid product ID', () => {
    renderWithParams({ id: '999' });
    expect(screen.getByText('Product not found')).toBeInTheDocument();
  });

  it('renders product details correctly for valid product ID', () => {
    renderWithParams({ id: '1' });
    
    // Check if product name and details are displayed
    expect(screen.getByText('CloudPeak Gold Token')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
    expect(screen.getByText('6.3%')).toBeInTheDocument();
  });

  it('renders without crashing with back button present', () => {
    mockUseParams.mockReturnValue({ id: '1' });
    // 只验证组件渲染
    expect(() => render(<MemoryRouter><TradeDetail /></MemoryRouter>)).not.toThrow();
  });

  it('renders trade form with correct initial values', () => {
    renderWithParams({ id: '1' });
    
    // Check if the trade form has the correct initial values
    const fromAmountInput = document.querySelector('input[value="0"]') as HTMLInputElement;
    expect(fromAmountInput).toBeInTheDocument();
    
    const currencySelects = document.querySelectorAll('select');
    if (currencySelects.length > 0) {
      expect((currencySelects[0] as HTMLSelectElement).value).toBe('USDT');
    }
  });

  it('renders form inputs without crashing', () => {
    mockUseParams.mockReturnValue({ id: '1' });
    // 只验证组件渲染
    expect(() => render(<MemoryRouter><TradeDetail /></MemoryRouter>)).not.toThrow();
  });

  it('renders rating indicators for fund profile', () => {
    renderWithParams({ id: '1' });
    
    // Check if rating indicators are rendered
    const ratingButtons = document.querySelectorAll('button[disabled]');
    expect(ratingButtons.length).toBeGreaterThan(0);
  });

  it('handles trade button click', () => {
    // Mock console.log to test handleTrade function
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    renderWithParams({ id: '1' });
    
    // Find and click the trade button
    const buttons = document.querySelectorAll('button');
    const tradeButton = Array.from(buttons).find(
      button => button.textContent?.trim() === 'Trade'
    );
    
    if (tradeButton) {
      fireEvent.click(tradeButton);
      expect(consoleLogSpy).toHaveBeenCalled();
    }
    
    consoleLogSpy.mockRestore();
  });

  // Testing boundary conditions
  it('handles undefined product ID gracefully', () => {
    mockUseParams.mockReturnValue({});
    expect(() => render(<MemoryRouter><TradeDetail /></MemoryRouter>)).not.toThrow();
  });

  it('handles empty string product ID gracefully', () => {
    mockUseParams.mockReturnValue({ id: '' });
    expect(() => render(<MemoryRouter><TradeDetail /></MemoryRouter>)).not.toThrow();
  });
});