import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';
import InvestmentTip from './InvestmentTip';

interface TradingProduct {
  id: number;
  name: string;
  description: string;
  minInvestment: string;
  image: string;
  backgroundImage: string;
}

// 交易产品数据
const tradingProducts: TradingProduct[] = [
  {
    id: 1,
    name: 'CloudPeak Gold Token',
    description: 'This is a description This is a description This is a description This is a description This is a description This is a description.',
    minInvestment: '$1,000',
    image: '/cloudpeak-gold-token.svg',
    backgroundImage: '/brand-delivery-bg.png'
  },
  {
    id: 2,
    name: 'Alpha Token',
    description: 'Another trading product with detailed description and investment information for users.',
    minInvestment: '$500',
    image: '/alphatoken-logo.svg',
    backgroundImage: '/brand-delivery-bg.png'
  },
  {
    id: 3,
    name: 'Beta Token',
    description: 'Premium trading product offering high returns with comprehensive market analysis.',
    minInvestment: '$2,000',
    image: '/cloudpeak-gold-token.svg',
    backgroundImage: '/brand-delivery-bg.png'
  }
];

const TradeMain: React.FC = () => {
  const { t } = useTranslation();
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
        {tradingProducts.map((product) => (
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