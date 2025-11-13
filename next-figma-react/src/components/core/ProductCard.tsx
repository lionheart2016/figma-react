import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/hooks/useI18n';

interface Network {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Product {
  id: number;
  icon: string;
  code: string;
  fullName: string;
  keyData1: string;
  keyData1Label: string;
  keyData2: string;
  keyData2Label: string;
  description: string;
  assetType: string;
  liquidity: string;
  network: string[];
  image?: string;
  backgroundImage?: string;
}

interface ProductCardProps {
  product: Product;
  onViewProduct: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewProduct }) => {
  const { t } = useI18n();
  const { isDarkMode } = useTheme();
  // 从支持的网络数组中选择第一个作为默认网络
  // 移除不必要的状态变量

  // 支持的网络列表
  const networks: Network[] = [
    { id: 'ethereum', name: 'Ethereum', icon: '🔷', color: 'from-blue-500 to-blue-700' },
    { id: 'solana', name: 'Solana', icon: '🔷', color: 'from-purple-500 to-purple-700' },
    { id: 'polygon', name: 'Polygon', icon: '🟣', color: 'from-purple-500 to-pink-500' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔵', color: 'from-blue-500 to-indigo-500' },
    { id: 'optimism', name: 'Optimism', icon: '🟠', color: 'from-orange-500 to-red-500' },
    { id: 'bnb', name: 'BNB Chain', icon: '🟡', color: 'from-yellow-500 to-amber-500' }
  ];



  return (
    <div className={`rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 group ${isDarkMode ? 'bg-[#1A1A1A] border-[#2C2C2C] hover:border-blue-900/50' : 'bg-white border-gray-100 hover:border-blue-100'}`}>
      {/* 产品顶部区域 */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          {/* 图标和代码 */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl">
              {product.icon}
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{product.code}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.fullName}</div>
            </div>
          </div>
          
          {/* 网络图标 - 按顺序堆叠展示 */}
          <div className="flex items-center space-x-0 relative">
            {/* 只显示产品支持的网络图标，最多显示3个，多余的显示数量提示 */}
            {product.network.slice(0, 3).map((networkId, index) => {
              const networkData = networks.find(network => network.id === networkId);
              if (!networkData) return null;
              
              return (
                <div 
                  key={networkId}
                  className={`w-6 h-6 bg-gradient-to-br ${networkData.color} rounded-full flex items-center justify-center text-white text-xs font-bold z-10`}
                  style={{ marginLeft: index > 0 ? '-8px' : '0' }}
                  title={networkData.name}
                >
                  {networkData.icon}
                </div>
              );
            })}
            
            {/* 如果网络数量超过3个，显示多余的数量 */}
            {product.network.length > 3 && (
              <div 
                className={`w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold z-10`}
                style={{ marginLeft: '-8px' }}
              >
                +{product.network.length - 3}
              </div>
            )}
          </div>
        </div>
        
        {/* 关键数据 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <div className={`text-xs mb-1 font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{product.keyData1Label}</div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{product.keyData1}</div>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
            <div className={`text-xs mb-1 font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{product.keyData2Label}</div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{product.keyData2}</div>
          </div>
        </div>
        
        {/* 简介 - 最多显示三行 */}
        <p className={`text-sm leading-relaxed line-clamp-3 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-gray-600'}`}>{product.description}</p>
      </div>
      
      {/* 产品底部信息 */}
      <div className="p-5">
        <div className="space-y-3 mb-4">
          {/* 资产类型 */}
          <div className="flex justify-between text-sm">
            <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-gray-500'}>资产类型</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode 
              ? product.assetType === 'Token' 
                ? 'bg-blue-900/30 text-blue-400' 
                : product.assetType === 'NFT' 
                  ? 'bg-purple-900/30 text-purple-400' 
                  : 'bg-green-900/30 text-green-400' 
              : product.assetType === 'Token' 
                ? 'bg-blue-100 text-blue-600' 
                : product.assetType === 'NFT' 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'bg-green-100 text-green-600'
            }`}>
              {product.assetType}
            </span>
          </div>
          
          {/* 流动性 */}
          <div className="flex justify-between text-sm">
            <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-gray-500'}>流动性</span>
            <div className="flex items-center">
              <span className={isDarkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'}>{product.liquidity}</span>
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded ${isDarkMode 
                ? product.liquidity === '高' 
                  ? 'bg-green-900/30 text-green-400' 
                  : product.liquidity === '中' 
                    ? 'bg-yellow-900/30 text-yellow-400' 
                    : 'bg-red-900/30 text-red-400' 
                : product.liquidity === '高' 
                  ? 'bg-green-100 text-green-600' 
                  : product.liquidity === '中' 
                    ? 'bg-yellow-100 text-yellow-600' 
                    : 'bg-red-100 text-red-600'
              }`}>
                {product.liquidity === '高' ? 'High' : product.liquidity === '中' ? 'Medium' : 'Low'}
              </span>
            </div>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <button 
          onClick={() => onViewProduct(product.id)}
          className="w-full bg-[#4B5EF5] text-white px-4 py-3 rounded-lg hover:bg-[#3A4BD4] transition-colors duration-200 font-semibold text-sm flex items-center justify-center space-x-2 group-hover:shadow-lg"
        >
          <span>{t('tradeMain.viewDetails') || '查看详情'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Mock 数据示例
export const mockProducts: Product[] = [
  {
    id: 1,
    icon: 'A',
    code: 'ATK',
    fullName: 'AlphaToken',
    keyData1: '$45.67',
    keyData1Label: '当前价格',
    keyData2: '+12.34%',
    keyData2Label: '24h变化',
    description: 'AlphaToken是一个去中心化金融平台的核心代币，旨在为用户提供更高效、安全的交易体验。该代币支持多种DeFi应用场景，包括流动性挖矿、质押奖励等功能。',
    assetType: 'Token',
    liquidity: '高',
    network: ['ethereum', 'arbitrum', 'optimism']
  },
  {
    id: 2,
    icon: 'G',
    code: 'GLD',
    fullName: 'GoldPeak',
    keyData1: '$89.23',
    keyData1Label: '当前价格',
    keyData2: '-2.45%',
    keyData2Label: '24h变化',
    description: 'GoldPeak是一种与黄金挂钩的稳定币，为用户提供传统资产与区块链技术相结合的投资机会。每枚代币都由实物黄金背书，确保价值稳定。',
    assetType: 'Token',
    liquidity: '中',
    network: ['solana', 'polygon']
  },
  {
    id: 3,
    icon: 'S',
    code: 'SOL',
    fullName: 'Solana',
    keyData1: '$120.56',
    keyData1Label: '当前价格',
    keyData2: '+8.76%',
    keyData2Label: '24h变化',
    description: 'Solana是一个高性能的区块链平台，专为去中心化应用和市场设计。其创新的历史证明机制使其能够处理高吞吐量的交易，同时保持较低的费用。',
    assetType: 'Token',
    liquidity: '高',
    network: ['solana']
  },
  {
    id: 4,
    icon: 'N',
    code: 'NFT',
    fullName: 'ArtBlock',
    keyData1: '0.85 ETH',
    keyData1Label: '底价',
    keyData2: '1.2K',
    keyData2Label: '交易量',
    description: 'ArtBlock是一个专注于生成艺术NFT的平台，每一件作品都是算法生成的独特艺术品。收藏者可以拥有这些独特的数字艺术作品，并在市场上进行交易。',
    assetType: 'NFT',
    liquidity: '中',
    network: ['ethereum', 'polygon', 'bnb']
  }
];

export default ProductCard;