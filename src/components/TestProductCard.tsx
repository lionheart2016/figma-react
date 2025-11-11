import React from 'react';
import ProductCard, { mockProducts } from './core/trading/ProductCard';
import { useTheme } from '../contexts/ThemeContext';

const TestProductCard: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  const handleViewProduct = (productId: number) => {
    console.log('View product:', productId);
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h1 className="text-2xl font-bold mb-6">Product Card Network Icons Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onViewProduct={handleViewProduct}
          />
        ))}
      </div>
    </div>
  );
};

export default TestProductCard;