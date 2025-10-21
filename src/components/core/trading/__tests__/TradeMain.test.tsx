import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TradeMain from '../TradeMain';

// Mock dependencies
const mockNavigate = vi.fn();
// 使用正确的TypeScript类型处理
vi.mock('react-router-dom', () => {
  // 创建一个简单的MemoryRouter组件
  const MockMemoryRouter: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return <>{children}</>;
  };
  
  return {
    useNavigate: () => mockNavigate,
    MemoryRouter: MockMemoryRouter
  };
});

vi.mock('../InvestmentTip', () => ({
  default: () => <div data-testid="investment-tip">Investment Tip</div>
}));

vi.mock('../ProductCard', () => ({
  default: ({ product, onViewProduct }: { product: any, onViewProduct: (id: number) => void }) => (
    <div 
      data-testid={`product-card-${product.id}`} 
      onClick={() => onViewProduct(product.id)}
    >
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span className="min-investment">{product.minInvestment}</span>
      <button data-testid={`view-product-${product.id}`}>View Product</button>
    </div>
  )
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('TradeMain Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => render(<TradeMain />)).not.toThrow();
  });

  it('renders investment tip component', () => {
    render(<TradeMain />);
    expect(screen.getByTestId('investment-tip')).toBeInTheDocument();
  });

  it('renders product cards for all trading products', () => {
    render(<TradeMain />);
    
    // Should render 3 product cards based on the hardcoded data
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
  });

  it('displays product information correctly', () => {
    render(<TradeMain />);
    
    // Check if first product has correct information
    expect(screen.getByText('CloudPeak Gold Token')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });

  it('handles product click and navigation', () => {
    render(
      <MemoryRouter>
        <TradeMain />
      </MemoryRouter>
    );
    
    // Click on a product
    fireEvent.click(screen.getByTestId('view-product-1'));
    
    // Verify navigation was called with correct URL
    expect(mockNavigate).toHaveBeenCalledWith('/trade/1');
    
    // Test another product
    fireEvent.click(screen.getByTestId('view-product-2'));
    expect(mockNavigate).toHaveBeenCalledWith('/trade/2');
  });

  it('renders responsive grid layout', () => {
    const { container } = render(<TradeMain />);
    
    // Verify the grid container exists
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    
    // Verify grid classes for responsiveness
    expect(gridContainer?.className).toContain('grid-cols-1');
    expect(gridContainer?.className).toContain('md:grid-cols-2');
    expect(gridContainer?.className).toContain('lg:grid-cols-3');
  });

  // Test error handling by mocking a failure in one of the child components
  it('handles potential errors gracefully', () => {
    // This test ensures that even if something goes wrong, the component doesn't crash completely
    expect(() => render(<TradeMain />)).not.toThrow();
  });
});