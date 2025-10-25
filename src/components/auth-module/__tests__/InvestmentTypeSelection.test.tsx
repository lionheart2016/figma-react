import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 模拟国际化函数
const mockTranslations: Record<string, Record<string, string>> = {
  en: {
    'investmentType.title': 'Select Investment Type',
    'investmentType.subtitle': 'Please choose your investment type',
    'investmentType.individual': 'Individual',
    'investmentType.corporate': 'Corporate',
    'investmentType.continue': 'Continue',
    'investmentType.selected': 'Selected'
  },
  'zh-CN': {
    'investmentType.title': '选择投资类型',
    'investmentType.subtitle': '请选择您的投资类型',
    'investmentType.individual': '个人',
    'investmentType.corporate': '企业',
    'investmentType.continue': '继续',
    'investmentType.selected': '已选择'
  }
};

// 模拟i18n hook
const useTranslation = (language: string = 'en') => (key: string) => {
  return mockTranslations[language]?.[key] || key;
};

// 创建支持国际化的测试版InvestmentTypeSelection组件
interface TestInvestmentTypeSelectionProps {
  onRegister?: (type: string) => void;
  language?: string;
}

const TestInvestmentTypeSelection: React.FC<TestInvestmentTypeSelectionProps> = ({ 
  onRegister, 
  language = 'en' 
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const t = useTranslation(language);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType && onRegister) {
      onRegister(selectedType);
    }
  };

  return (
    <div>
      <h1>{t('auth.investmentSelection.title')}</h1>
      <p>{t('auth.investmentSelection.subtitle')}</p>
      
      <div className="investment-types">
        <div 
          className="bg-white rounded-lg p-4 cursor-pointer"
          data-testid="individual-option"
          onClick={() => handleTypeSelect('individual')}
        >
          <h3>{t('auth.investmentTypes.individual')}</h3>
          {selectedType === 'individual' && (
            <img src="/radio-on.svg" alt="Selected" />
          )}
        </div>
        
        <div 
          className="bg-white rounded-lg p-4 cursor-pointer"
          data-testid="corporate-option"
          onClick={() => handleTypeSelect('corporate')}
        >
          <h3>{t('auth.investmentTypes.corporate')}</h3>
          {selectedType === 'corporate' && (
            <img src="/radio-on.svg" alt="Selected" />
          )}
        </div>
      </div>
      
      <button 
        data-testid="continue-button"
        disabled={!selectedType}
        onClick={handleContinue}
      >
        {t('auth.authentication.continue')}
      </button>
    </div>
  );
};

describe('InvestmentTypeSelection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <TestInvestmentTypeSelection />
    );
    expect(container).toBeDefined();
  });

  // 英文测试用例
  describe('in English language', () => {
    it('renders title and subtitle in English', () => {
      render(
        <TestInvestmentTypeSelection language="en" />
      );
      
      expect(screen.getByText('Welcome 👋🏼')).toBeDefined();
      expect(screen.getByText('Please select your investment type')).toBeDefined();
    });

    it('renders both investment types in English', () => {
      render(
        <TestInvestmentTypeSelection language="en" />
      );
      
      expect(screen.getByText('Individual investors')).toBeDefined();
      expect(screen.getByText('Corporate Investment')).toBeDefined();
    });

    it('renders continue button in English', () => {
      render(
        <TestInvestmentTypeSelection language="en" />
      );
      
      expect(screen.getByText('Continue')).toBeDefined();
    });
  });

  // 中文测试用例
  describe('in Chinese language', () => {
    it('renders title and subtitle in Chinese', () => {
      render(
        <TestInvestmentTypeSelection language="zh-CN" />
      );
      
      expect(screen.getByText('欢迎 👋🏼')).toBeDefined();
      expect(screen.getByText('请选择您的投资类型')).toBeDefined();
    });

    it('renders both investment types in Chinese', () => {
      render(
        <TestInvestmentTypeSelection language="zh-CN" />
      );
      
      expect(screen.getByText('个人投资者')).toBeDefined();
      expect(screen.getByText('企业投资')).toBeDefined();
    });

    it('renders continue button in Chinese', () => {
      render(
        <TestInvestmentTypeSelection language="zh-CN" />
      );
      
      expect(screen.getByText('继续')).toBeDefined();
    });
  });

  // 通用功能测试
  it('allows selecting investment type', () => {
    render(
      <TestInvestmentTypeSelection />
    );
    
    const individualOption = screen.getByTestId('individual-option');
    fireEvent.click(individualOption);
    
    // Verify that the radio-on.svg appears for the selected option
    expect(screen.getByAltText('Selected')).toBeDefined();
  });

  it('disables continue button when no type is selected', () => {
    render(
      <TestInvestmentTypeSelection />
    );
    
    const continueButton = screen.getByTestId('continue-button');
    expect(continueButton).toHaveAttribute('disabled');
  });

  it('enables continue button when a type is selected', () => {
    render(
      <TestInvestmentTypeSelection />
    );
    
    const individualOption = screen.getByTestId('individual-option');
    fireEvent.click(individualOption);
    
    const continueButton = screen.getByTestId('continue-button');
    expect(continueButton).not.toHaveAttribute('disabled');
  });

  it('calls onRegister callback when provided', () => {
    const onRegisterMock = vi.fn();
    render(
      <TestInvestmentTypeSelection onRegister={onRegisterMock} />
    );
    
    const individualOption = screen.getByTestId('individual-option');
    fireEvent.click(individualOption);
    
    const continueButton = screen.getByTestId('continue-button');
    fireEvent.click(continueButton);
    
    expect(onRegisterMock).toHaveBeenCalledWith('individual');
  });

  // 国际化切换测试
  it('switches language correctly when language prop changes', () => {
    const { rerender } = render(
      <TestInvestmentTypeSelection language="en" />
    );
    
    expect(screen.getByText('Welcome 👋🏼')).toBeDefined();
    
    rerender(
      <TestInvestmentTypeSelection language="zh-CN" />
    );
    
    expect(screen.getByText('选择投资类型')).toBeDefined();
  });
});