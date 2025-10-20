import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// 导入要测试的组件
import BrandSection from '../BrandSection';

describe('BrandSection Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<BrandSection />);
    expect(container).not.toBeNull();
  });

  it('renders logo by default', () => {
    render(<BrandSection />);
    const logoImage = screen.getByAltText('Brand background');
    expect(logoImage).not.toBeNull();
    expect(logoImage).toHaveAttribute('src', '/brand-delivery-bg.png');
  });

  it('does not render logo when showLogo is false', () => {
    render(<BrandSection showLogo={false} />);
    const logoImage = screen.queryByAltText('Brand background');
    expect(logoImage).toBeNull();
  });

  it('applies additional className correctly', () => {
    const { container } = render(<BrandSection className="test-class" />);
    const brandSection = container.querySelector('.brand-section');
    expect(brandSection).not.toBeNull();
    expect(brandSection?.classList.contains('test-class')).toBe(true);
  });
});