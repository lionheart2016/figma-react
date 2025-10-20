import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 交易产品数据
const tradingProducts = [
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

const TradeMain = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewProduct = (productId) => {
    navigate(`/trade/${productId}`);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('tradeMain.title')}</h1>
        <p className="text-gray-600">{t('tradeMain.subtitle')}</p>
      </div>

      {/* 投资配置提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">{t('tradeMain.completeProfile')}</h3>
            <p className="text-blue-700 mb-4">{t('tradeMain.completeProfileDesc')}</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              {t('tradeMain.complete')}
            </button>
          </div>
        </div>
      </div>

      {/* 交易产品卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tradingProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* 产品图片背景 */}
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-24 h-24 object-contain"
                />
              </div>
              {/* 装饰性椭圆 */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
            </div>
            
            {/* 产品信息 */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
              
              {/* 最低投资额 */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">{t('tradeMain.minInvestment')}</div>
                <div className="text-2xl font-bold text-gray-900">{product.minInvestment}</div>
              </div>
              
              {/* 查看按钮 */}
              <button 
                onClick={() => handleViewProduct(product.id)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('tradeMain.view')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeMain;