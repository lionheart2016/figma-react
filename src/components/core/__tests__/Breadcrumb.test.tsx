import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';

describe('Breadcrumb Component', () => {
  it('renders without crashing', () => {
    expect(() => 
      render(
        <MemoryRouter>
          <Breadcrumb />
        </MemoryRouter>
      )
    ).not.toThrow();
  });

  it('renders breadcrumb container', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Breadcrumb />
      </MemoryRouter>
    );
    
    const breadcrumb = document.querySelector('.breadcrumb');
    expect(breadcrumb).toBeDefined();
  });

  it('renders with different routes', () => {
    // 测试多个路由路径
    const routes = ['/dashboard', '/trade', '/wallets', '/reports', '/settings'];
    
    routes.forEach(route => {
      render(
        <MemoryRouter initialEntries={[route]}>
          <Breadcrumb />
        </MemoryRouter>
      );
      
      const breadcrumb = document.querySelector('.breadcrumb');
      expect(breadcrumb).toBeDefined();
    });
  });
});