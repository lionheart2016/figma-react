import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TradeView from '../TradeView';

// Mock all dependencies to prevent errors
vi.mock('../../Layout', () => ({
  default: ({ children }) => <div>{children}</div>
}));

vi.mock('../TradeMain', () => ({
  default: () => <div>TradeMain Component</div>
}));

vi.mock('../TradeDetail', () => ({
  default: () => <div>TradeDetail Component</div>
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

describe('TradeView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    // Just test that it renders without crashing
    expect(() => 
      render(
        <MemoryRouter>
          <TradeView />
        </MemoryRouter>
      )
    ).not.toThrow();
  });

  it('initializes correctly with MemoryRouter', () => {
    // Test with initial route
    expect(() => 
      render(
        <MemoryRouter initialEntries={['/trade']}>
          <TradeView />
        </MemoryRouter>
      )
    ).not.toThrow();
  });
});