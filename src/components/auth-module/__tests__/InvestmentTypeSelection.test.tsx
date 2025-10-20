import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 模拟依赖
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        'auth.investmentSelection.title': 'Select Investment Type',
        'auth.investmentSelection.subtitle': 'Please choose your investment type',
        'auth.investmentTypes.individual': 'Individual',
        'auth.investmentTypes.corporate': 'Corporate',
        'auth.register.registerButton': 'Continue',
        'auth.investmentSelection.selectedType': 'Selected investment type:'
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
import InvestmentTypeSelection from '../InvestmentTypeSelection';

vi.mock('../../config/routes', () => ({
  ROUTES: {
    REGISTER: '/register'
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

describe('InvestmentTypeSelection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <InvestmentTypeSelection />
    );
    expect(container).not.toBeNull();
  });

  it('renders title and subtitle', () => {
    render(
      <InvestmentTypeSelection />
    );
    
    expect(screen.getByText('Select Investment Type')).not.toBeNull();
    expect(screen.getByText('Please choose your investment type')).not.toBeNull();
  });

  it('renders both investment types', () => {
    render(
      <InvestmentTypeSelection />
    );
    
    expect(screen.getByText('Individual')).not.toBeNull();
    expect(screen.getByText('Corporate')).not.toBeNull();
  });

  it('allows selecting investment type', () => {
    const { container } = render(
      <InvestmentTypeSelection />
    );
    
    const individualOption = container.querySelector('.bg-white.rounded-lg.p-4') as HTMLElement;
    fireEvent.click(individualOption);
    
    // Verify that the radio-on.svg appears for the selected option
    const selectedIcon = container.querySelector('img[src="/radio-on.svg"]');
    expect(selectedIcon).not.toBeNull();
  });

  it('disables continue button when no type is selected', () => {
    render(
      <InvestmentTypeSelection />
    );
    
    const continueButton = screen.getByText('Continue');
    expect(continueButton).toHaveAttribute('disabled');
  });

  it('enables continue button when a type is selected', () => {
    const { container } = render(
      <InvestmentTypeSelection />
    );
    
    const individualOption = container.querySelector('.bg-white.rounded-lg.p-4') as HTMLElement;
    fireEvent.click(individualOption);
    
    const continueButton = screen.getByText('Continue');
    expect(continueButton).not.toHaveAttribute('disabled');
  });

  it('calls onRegister callback when provided', () => {
    const onRegisterMock = vi.fn();
    const { container } = render(
      <InvestmentTypeSelection onRegister={onRegisterMock} />
    );
    
    const individualOption = container.querySelector('.bg-white.rounded-lg.p-4') as HTMLElement;
    fireEvent.click(individualOption);
    
    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);
    
    expect(onRegisterMock).toHaveBeenCalledWith('individual');
  });
});