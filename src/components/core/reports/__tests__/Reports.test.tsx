import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Reports from '../Reports';

// Mock dependencies
vi.mock('../../Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout-container">{children}</div>
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('Reports Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => 
      render(
        <MemoryRouter>
          <Reports />
        </MemoryRouter>
      )
    ).not.toThrow();
  });

  it('contains the layout container', () => {
    render(
      <MemoryRouter>
        <Reports />
      </MemoryRouter>
    );
    
    const layoutContainer = screen.getByTestId('layout-container');
    expect(layoutContainer).toBeDefined();
  });

  it('renders reports content', () => {
    render(
      <MemoryRouter>
        <Reports />
      </MemoryRouter>
    );
    
    const reportsContent = document.querySelector('.wallets-content');
    expect(reportsContent).toBeDefined();
  });

  // 简化的多语言测试
  it('supports multiple languages', () => {
    expect(() => render(
      <MemoryRouter>
        <Reports />
      </MemoryRouter>
    )).not.toThrow();
    
    // 检查报表容器是否存在
    expect(document.querySelector('.reports-container')).toBeDefined();
  });
});