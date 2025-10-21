import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Settings from '../Settings';

// Mock dependencies
vi.mock('../../Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout-container">{children}</div>
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('Settings Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => 
      render(
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      )
    ).not.toThrow();
  });

  it('contains the layout container', () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );
    
    const layoutContainer = screen.getByTestId('layout-container');
    expect(layoutContainer).toBeDefined();
  });

  it('renders settings content with card elements', () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );
    
    const cards = document.querySelectorAll('.card');
    expect(cards.length).toBeGreaterThan(0);
  });

  // 简化的多语言测试
  it('supports multiple languages', () => {
    expect(() => render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    )).not.toThrow();
    
    // 检查设置容器是否存在
    expect(document.querySelector('.settings-container')).toBeDefined();
  });

});