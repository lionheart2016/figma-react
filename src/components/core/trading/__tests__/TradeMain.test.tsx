import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TradeMain from '../TradeMain';

// Mock all dependencies to prevent errors
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

vi.mock('../InvestmentTip', () => ({
  default: () => <div>Investment Tip</div>
}));

vi.mock('../ProductCard', () => ({
  default: () => <div>Product Card</div>
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

describe('TradeMain Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    // Just test that it renders without crashing
    expect(() => render(<TradeMain />)).not.toThrow();
  });

  it('initializes correctly', () => {
    // Test that the component initializes without errors
    expect(() => render(<TradeMain />)).not.toThrow();
  });
});