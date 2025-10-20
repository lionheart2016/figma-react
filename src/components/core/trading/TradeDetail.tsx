import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface FeeData {
  totalManagementFee: string;
  totalPerformanceFee: string;
  performanceFeePercentage: string;
  currency: string;
}

interface HighlightData {
  returnsAndFees: FeeData;
  subscription: FeeData;
  redemptions: FeeData;
}

interface FundProfile {
  diversification: string;
  volatility: string;
  liquidity: string;
}

interface TradingProduct {
  id: number;
  name: string;
  description: string;
  minInvestment: string;
  managementFee: string;
  liquidity: string;
  annualizedYield: string;
  image: string;
  unitPrice: string;
  totalAUM: string;
  highlightData: HighlightData;
  fundProfile: FundProfile;
  documents: string[];
}

// 模拟交易产品数据
const tradingProducts: Record<string, TradingProduct> = {
  '1': {
    id: 1,
    name: 'CloudPeak Gold Token',
    description: 'This is a description This is a description This is a description This is a description This is a description This is a description.',
    minInvestment: '$1,000',
    managementFee: '0.50%',
    liquidity: 'Daily / Weekly',
    annualizedYield: '6.3%',
    image: '/cloudpeak-gold-token.svg',
    unitPrice: '$1,209.851812',
    totalAUM: '$1,209.851812',
    highlightData: {
      returnsAndFees: {
        totalManagementFee: '$1,209.851812',
        totalPerformanceFee: 'USD',
        performanceFeePercentage: '0%',
        currency: 'USD'      
      },
      subscription: {
        totalManagementFee: '$1,209.851812',
        totalPerformanceFee: 'USD',
        performanceFeePercentage: '0%',
        currency: 'USD'
      },
      redemptions: {
        totalManagementFee: '$1,209.851812',
        totalPerformanceFee: 'USD',
        performanceFeePercentage: '0%',
        currency: 'USD'
      }
    },
    fundProfile: {
      diversification: 'Medium',
      volatility: 'Medium',
      liquidity: 'Medium'
    },
    documents: ['Document1', 'Document2', 'Document3']
  },
  '2': {
    id: 2,
    name: 'Alpha Token',
    description: 'Another trading product with detailed description and investment information for users.',
    minInvestment: '$500',
    managementFee: '0.75%',
    liquidity: 'Weekly',
    annualizedYield: '5.8%',
    image: '/alphatoken-logo.svg',
    unitPrice: '$897.321098',
    totalAUM: '$897.321098',
    highlightData: {
      returnsAndFees: {
        totalManagementFee: '$897.321098',
        totalPerformanceFee: 'USD',
        performanceFeePercentage: '0%',
        currency: 'USD'      
      },
      subscription: {
        totalManagementFee: '$897.321098',
        totalPerformanceFee: 'USD',
        performanceFeePercentage: '0%',
        currency: 'USD'
      },
      redemptions: {
        totalManagementFee: '$897.321098',
        totalPerformanceFee: 'USD',
        performanceFeePercentage: '0%',
        currency: 'USD'
      }
    },
    fundProfile: {
      diversification: 'Medium',
      volatility: 'High',
      liquidity: 'Medium'
    },
    documents: ['Document1', 'Document2', 'Document3']
  },
  '3': {
    id: 3,
    name: 'Beta Token',
    description: 'Premium trading product offering high returns with comprehensive market analysis.',
    minInvestment: '$2,000',
    managementFee: '0.60%',
    liquidity: 'Daily',
    annualizedYield: '7.1%',
    image: '/cloudpeak-gold-token.svg',
    unitPrice: '$1,543.216789',
    totalAUM: '$1,543.216789',
    highlightData: {
      returnsAndFees: {
        totalManagementFee: '$1,543.216789',
        totalPerformanceFee: 'USD',
        performanceFeePercentage: '0%',
        currency: 'USD'      
      },
      subscription: {
        totalManagementFee: '$1,543.216789',
        totalPerformanceFee: 'USD',
        performanceFeePercentage: '0%',
        currency: 'USD'
      },
      redemptions: {
        totalManagementFee: '$1,543.216789',
        totalPerformanceFee: 'USD',
        performanceFeePercentage: '0%',
        currency: 'USD'
      }
    },
    fundProfile: {
      diversification: 'High',
      volatility: 'Medium',
      liquidity: 'High'
    },
    documents: ['Document1', 'Document2', 'Document3']
  }
};

const TradeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [fromAmount, setFromAmount] = useState<string>('0');
  const [fromCurrency, setFromCurrency] = useState<string>('USDT');
  const [toCurrency, setToCurrency] = useState<string>('Gold Token');
  
  const product = id ? tradingProducts[id] : undefined;
  
  if (!product) {
    return <div className="p-6 text-center text-gray-500">{t('tradeDetail.productNotFound')}</div>;
  }

  const handleBack = (): void => {
    navigate('/trade');
  };

  const handleTrade = (): void => {
    // 处理交易逻辑
    console.log(`Trading ${fromAmount} ${fromCurrency} to ${toCurrency}`);
  };

  // 渲染评级指标
  const renderRating = (type: string, selectedValue: string): JSX.Element => {
    const options: string[] = ['Low', 'Med', 'High'];
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700 w-12">{type}</span>
        <div className="flex-1 flex space-x-1">
          {options.map(option => (
            <button
              key={option}
              className={`px-3 py-1 text-xs rounded ${selectedValue === option ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              disabled
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* 整合的产品信息和交易表单卡片 - 左右结构布局 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          {/* 左右布局容器 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* 左侧：产品信息 */}
            <div className="w-full md:w-2/3">
              {/* 产品头部信息 */}
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </div>
              
              {/* 基本信息 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">Min. Investment</div>
                  <div className="font-bold text-gray-900">{product.minInvestment}</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">Management Fee</div>
                  <div className="font-bold text-gray-900">{product.managementFee}</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">Liquidity</div>
                  <div className="font-bold text-gray-900">{product.liquidity}</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">Annualized Yield</div>
                  <div className="font-bold text-gray-900">{product.annualizedYield}</div>
                </div>
              </div>
            </div>
            
            {/* 右侧：交易表单 */}
            <div className="w-full md:w-1/3">
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border-l border-gray-300 focus:outline-none"
                    >
                      <option value="USDT">USDT</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <input
                      type="text"
                      value="0"
                      disabled
                      className="flex-1 px-4 py-3 bg-gray-50 focus:outline-none"
                    />
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border-l border-gray-300 focus:outline-none"
                    >
                      <option value="Gold Token">Gold Token</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  This is an estimate of the units you will receive subject to funds arriving during the current investment phase and the exchange rate applied to the funds.
                </p>

                <button 
                  onClick={handleTrade}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Trade
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 单栏详细信息区域 */}
        <div className="space-y-6">
          {/* 概览区域 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Unit Price</span>
                  <span className="text-sm text-gray-600">Updated Daily</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-bold text-gray-900">{product.unitPrice}</span>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Total AUM</span>
                  <span className="text-sm text-gray-600">Updated Daily</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-bold text-gray-900">{product.totalAUM}</span>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Annualized Yield</span>
                  <span className="text-sm text-gray-600">Since 2025</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-bold text-green-600">6.57%</span>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Tokenized Unit Price is updated on a daily basis. As a result, this value may not reflect the actual Unit Price at a given time. Tokenized unit Price is an estimate and subject to fluctuation. Subscriptions made on a Determination Date will be valued based on a Net Asset Value (NAV) per Tokenized Unit as of that date, while redemptions on any other date will be priced at the Assumed Value Per Unit which will be calculated based on the trailing monthly NAV which will be equal to the stated value of a Unit assuming appreciation or depreciation. Please refer to the PPM for further description of the Tokenized Unit Price.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mt-2">
              AUM is as of 2025-10-13 and is updated on a daily basis. As a result, this value may not reflect the actual AUM at given time.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mt-2">
              Annualized yield for HISCOPE fund, net of fees/expenses. Based on Tokenized Unit Price performance between 07/01/2025 – 09/30/2025, calculated by multiplying the quarterly return by four. Tokenized Unit Price is an estimate and subject to fluctuation. Actual annual results may differ. Please refer to the PPM for further description of the Tokenized Unit Price. May include return of capital. Past performance is not indicative of future results.
            </p>
          </div>

          {/* 亮点信息 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Highlights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 返回和费用 */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 pb-2 border-b border-gray-200">Returns & Fees</h3>
                <div className="text-sm space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Management Fee</span>
                    <span className="font-medium text-gray-900">{product.highlightData.returnsAndFees.totalManagementFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Performance Fee</span>
                    <span className="font-medium text-gray-900">{product.highlightData.returnsAndFees.performanceFeePercentage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency</span>
                    <span className="font-medium text-gray-900">{product.highlightData.returnsAndFees.currency}</span>
                  </div>
                </div>
              </div>

              {/* 订阅 */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 pb-2 border-b border-gray-200">Subscription</h3>
                <div className="text-sm space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Management Fee</span>
                    <span className="font-medium text-gray-900">{product.highlightData.subscription.totalManagementFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Performance Fee</span>
                    <span className="font-medium text-gray-900">{product.highlightData.subscription.performanceFeePercentage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency</span>
                    <span className="font-medium text-gray-900">{product.highlightData.subscription.currency}</span>
                  </div>
                </div>
              </div>

              {/* 赎回 */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 pb-2 border-b border-gray-200">Redemptions</h3>
                <div className="text-sm space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Management Fee</span>
                    <span className="font-medium text-gray-900">{product.highlightData.redemptions.totalManagementFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Performance Fee</span>
                    <span className="font-medium text-gray-900">{product.highlightData.redemptions.performanceFeePercentage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency</span>
                    <span className="font-medium text-gray-900">{product.highlightData.redemptions.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-600 space-y-2">
              <p>• Token purchases are available via a smart contract swap with USD.</p>
              <p>• On-demand redemptions via a liquidity pool are available at OP discretion. Liquidity may be subject to delays due to blockchain settlement mechanics.</p>
              <p>• Monthly redemptions are available during a monthly notice period with the fund. Full redemptions are not guaranteed and may be subject to delays due to market conditions or blockchain settlement mechanics.</p>
              <p>• Tokens can be transferred to other whitelisted holders after issuance.</p>
            </div>
          </div>

          {/* 基金概况 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Fund Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderRating('Diversification', product.fundProfile.diversification)}
              {renderRating('Volatility', product.fundProfile.volatility)}
              {renderRating('Liquidity', product.fundProfile.liquidity)}
            </div>
          </div>

          {/* 文档 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Documents</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <span className="font-medium text-gray-900">{doc}</span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDetail;