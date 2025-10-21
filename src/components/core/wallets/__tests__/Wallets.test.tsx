import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Wallets from '../Wallets';

// Mock dependencies
vi.mock('../../Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout-container">{children}</div>
}));

// Simple mock for WalletCard to avoid rendering issues
vi.mock('../WalletCard', () => ({
  default: () => null
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('Wallets Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => render(
      <MemoryRouter>
        <Wallets />
      </MemoryRouter>
    )).not.toThrow();
  });

  it('contains the layout container', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Wallets />
      </MemoryRouter>
    );
    const layoutContainer = getByTestId('layout-container');
    expect(layoutContainer).toBeInTheDocument();
  });
});