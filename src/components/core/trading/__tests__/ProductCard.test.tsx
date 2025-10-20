import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../ProductCard';

// Mock useTranslation with JavaScript syntax
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: function(key) { return key; }
  })
}));

describe('ProductCard Component', function() {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test description',
    minInvestment: '$1,000',
    image: '/test-image.svg',
    backgroundImage: '/test-bg.png',
    currentPrice: '$100.00'
  };

  const mockOnViewProduct = vi.fn();

  it('renders without crashing', function() {
    expect(function() {
      render(
        React.createElement(ProductCard, {
          product: mockProduct,
          onViewProduct: mockOnViewProduct
        })
      );
    }).not.toThrow();
  });

  it('accepts product prop correctly', function() {
    expect(function() {
      render(
        React.createElement(ProductCard, {
          product: mockProduct,
          onViewProduct: mockOnViewProduct
        })
      );
    }).not.toThrow();
  });

  it('accepts onViewProduct callback prop', function() {
    expect(function() {
      render(
        React.createElement(ProductCard, {
          product: mockProduct,
          onViewProduct: mockOnViewProduct
        })
      );
    }).not.toThrow();
  });
});