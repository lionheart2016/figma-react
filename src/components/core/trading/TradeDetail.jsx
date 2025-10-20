import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 模拟交易产品数据
const tradingProducts = {
  1: {
    id: 1,
    name: 'CloudPeak Gold Token',
    description: 'This is a description This is a description This is a description This is a description This is a description This is a description.',
    minInvestment: '$1,000',
    image: '/cloudpeak-gold-token.svg',
    backgroundImage: '/brand-delivery-bg.png',
    details: {
      tokenType: 'ERC-20',
      totalSupply: '10,000,000',
      currentPrice: '$2.50',
      marketCap: '$25,000,000',
      circulatingSupply: '8,500,000',
      allTimeHigh: '$4.20',
      allTimeLow: '$0.80'
    }
  },
  2: {
    id: 2,
    name: 'Alpha Token',
    description: 'Another trading product with detailed description and investment information for users.',
    minInvestment: '$500',
    image: '/alphatoken-logo.svg',
    backgroundImage: '/brand-delivery-bg.png',
    details: {
      tokenType: 'ERC-20',
      totalSupply: '5,000,000',
      currentPrice: '$1.80',
      marketCap: '$9,000,000',
      circulatingSupply: '4,200,000',
      allTimeHigh: '$3.50',
      allTimeLow: '$0.60'
    }
  },
  3: {
    id: 3,
    name: 'Beta Token',
    description: 'Premium trading product offering high returns with comprehensive market analysis.',
    minInvestment: '$2,000',
    image: '/cloudpeak-gold-token.svg',
    backgroundImage: '/brand-delivery-bg.png',
    details: {
      tokenType: 'ERC-20',
      totalSupply: '15,000,000',
      currentPrice: '$3.20',
      marketCap: '$48,000,000',
      circulatingSupply: '12,000,000',
      allTimeHigh: '$5.80',
      allTimeLow: '$1.20'
    }
  }
};

const TradeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [investmentAmount, setInvestmentAmount] = useState('');
  
  const product = tradingProducts[id];
  
  if (!product) {
    return <div className="p-6 text-center text-gray-500">Product not found</div>;
  }

  const handleBack = () => {
    navigate('/trade');
  };

  const handleInvest = () => {
    if (investmentAmount && parseFloat(investmentAmount) > 0) {
      // 处理投资逻辑
      console.log(`Investing $${investmentAmount} in ${product.name}`);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：产品信息 */}
        <div className="space-y-6">
          {/* 产品标题和描述 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
            
            {/* 价格信息 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 mb-1">{t('tradeDetail.currentPrice')}</div>
                <div className="text-2xl font-bold text-blue-900">{product.details.currentPrice}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 mb-1">{t('tradeDetail.minInvestment')}</div>
                <div className="text-2xl font-bold text-green-900">{product.minInvestment}</div>
              </div>
            </div>

            {/* 投资输入 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tradeDetail.investmentAmount')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder={t('tradeDetail.enterAmount')}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 投资按钮 */}
            <button 
              onClick={handleInvest}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              {t('tradeDetail.investNow')}
            </button>
          </div>
        </div>

        {/* 右侧：详细信息 */}
        <div className="space-y-6">
          {/* 代币详情 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('tradeDetail.tokenDetails')}</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">{t('tradeDetail.tokenType')}</span>
                <span className="font-medium text-gray-900">{product.details.tokenType}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">{t('tradeDetail.totalSupply')}</span>
                <span className="font-medium text-gray-900">{product.details.totalSupply}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">{t('tradeDetail.circulatingSupply')}</span>
                <span className="font-medium text-gray-900">{product.details.circulatingSupply}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">{t('tradeDetail.marketCap')}</span>
                <span className="font-medium text-gray-900">{product.details.marketCap}</span>
              </div>
            </div>
          </div>

          {/* 价格历史 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('tradeDetail.priceHistory')}</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">{t('tradeDetail.allTimeHigh')}</span>
                <span className="font-medium text-green-600">{product.details.allTimeHigh}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">{t('tradeDetail.allTimeLow')}</span>
                <span className="font-medium text-red-600">{product.details.allTimeLow}</span>
              </div>
            </div>
          </div>

          {/* 风险提示 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">{t('tradeDetail.investmentRisk')}</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {t('tradeDetail.investmentRiskDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDetail;