import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard, { mockProducts } from './ProductCard';
import InvestmentTip from './InvestmentTip';

const TradeMain: React.FC = () => {
  // 移除未使用的t变量
  const navigate = useNavigate();

  const handleViewProduct = (productId: number) => {
    navigate(`/trade/${productId}`);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">

      {/* 投资配置提示 */}
      <InvestmentTip />

      {/* 交易产品卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default TradeMain;