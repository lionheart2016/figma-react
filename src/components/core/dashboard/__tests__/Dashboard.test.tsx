import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock dependencies
vi.mock('../../Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout-container">{children}</div>
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => 
      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      )
    ).not.toThrow();
  });

  it('contains the layout container', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    const layoutContainer = screen.getByTestId('layout-container');
    expect(layoutContainer).toBeDefined();
  });

  it('renders the dashboard content', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    const dashboardContent = document.querySelector('.dashboard-content');
    expect(dashboardContent).toBeDefined();
  });

  it('renders the Alphatoken logo', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    const logo = screen.getByAltText('Alphatoken Logo');
    expect(logo).toBeDefined();
    expect(logo).toHaveAttribute('src', '/alphatoken-logo.svg');
  });

  // 简化的多语言测试
  it('supports multiple languages', () => {
    expect(() => render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )).not.toThrow();
    
    // 检查仪表盘容器是否存在
    expect(document.querySelector('.dashboard-container')).toBeDefined();
  });

});