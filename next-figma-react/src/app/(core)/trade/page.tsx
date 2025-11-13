'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProductCard, { mockProducts } from '@/components/core/ProductCard';
import InvestmentTip from '@/components/core/InvestmentTip';

const TradeMain: React.FC = () => {
  const router = useRouter();

  const handleViewProduct = (productId: number) => {
    router.push(`/trade/${productId}`);
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