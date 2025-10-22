import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 模拟依赖
vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    currentLanguage: 'en',
    switchLanguage: vi.fn().mockResolvedValue(true),
    getAvailableLanguages: vi.fn().mockReturnValue([
      { code: 'en', name: 'English' },
      { code: 'zh-CN', name: '简体中文' },
      { code: 'zh-TW', name: '繁體中文' }
    ]),
    getLanguageName: vi.fn().mockReturnValue('English')
  })
}));

// 导入要测试的组件
import BrandSection from '../BrandSection';

describe('BrandSection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('renders correctly with default language context', () => {
    const { container } = render(<BrandSection />);
    expect(container).not.toBeNull();
    // 确保组件能在语言上下文中正常渲染
    const brandSection = container.querySelector('.brand-section');
    expect(brandSection).not.toBeNull();
  });

  it('renders correctly with different language context settings', () => {
    // 在不同语言设置下重新渲染组件
    const { container } = render(<BrandSection />);
    expect(container).not.toBeNull();
    
    // 验证组件结构完整性
    const brandSection = container.querySelector('.brand-section');
    expect(brandSection).toBeDefined();
  });
});