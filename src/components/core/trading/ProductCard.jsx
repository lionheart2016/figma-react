import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product, onViewProduct }) => {
  const { t } = useTranslation();
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  // 支持的网络列表
  const networks = [
    { id: 'ethereum', name: 'Ethereum', icon: '🔷' },
    { id: 'polygon', name: 'Polygon', icon: '🟣' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔵' },
    { id: 'optimism', name: 'Optimism', icon: '🟠' },
    { id: 'bnb', name: 'BNB Chain', icon: '🟡' }
  ];

  const selectedNetworkData = networks.find(network => network.id === selectedNetwork);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-blue-100 transition-all duration-300 group">
      {/* 产品图片背景 - 使用设计稿主色调 #4B5EF5 */}
      <div className="relative h-40 bg-gradient-to-br from-[#4B5EF5] to-[#7B8AFF] overflow-hidden">
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* 产品图片 */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-20 h-20 object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* 装饰性元素 - 类似设计稿中的装饰 */}
        <div className="absolute top-3 right-3 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm"></div>
        <div className="absolute bottom-3 left-3 w-8 h-8 bg-white/5 rounded-full"></div>
      </div>
      
      {/* 产品信息 */}
      <div className="p-5">
        {/* 产品标题和描述 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{product.description}</p>
        </div>
        
        {/* 产品详细信息 */}
        <div className="space-y-2 mb-4">
          {/* 代币类型 */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('tradeMain.tokenType')}</span>
            <span className="text-gray-900 font-medium">{product.tokenType || 'ERC-20'}</span>
          </div>
          
          {/* 总供应量 */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('tradeMain.totalSupply')}</span>
            <span className="text-gray-900 font-medium">{product.totalSupply || '10,000,000'}</span>
          </div>
          
          {/* 当前价格 */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('tradeMain.currentPrice')}</span>
            <span className="text-gray-900 font-medium">{product.currentPrice || '$1.00'}</span>
          </div>
        </div>
        
        {/* 最低投资额 - 突出显示 */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="text-xs text-blue-600 mb-1 font-medium">{t('tradeMain.minInvestment')}</div>
          <div className="text-xl font-bold text-blue-700">{product.minInvestment}</div>
        </div>
        
        {/* 卡片底部 - 可交互的网络选择器 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* 网络选择器 */}
          <div className="relative">
            <button
              onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200 bg-white"
            >
              {/* 网络图标 */}
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {selectedNetworkData?.icon || '🔷'}
              </div>
              
              {/* 网络名称 */}
              <span className="text-sm font-medium text-gray-700">{selectedNetworkData?.name}</span>
              
              {/* 下拉箭头 */}
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showNetworkDropdown ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* 网络选择下拉菜单 */}
            {showNetworkDropdown && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {networks.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => {
                        setSelectedNetwork(network.id);
                        setShowNetworkDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${
                        selectedNetwork === network.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {network.icon}
                      </div>
                      <span className="text-sm font-medium">{network.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 查看按钮 */}
          <button 
            onClick={() => onViewProduct(product.id)}
            className="bg-[#4B5EF5] text-white px-4 py-2 rounded-lg hover:bg-[#3A4BD4] transition-colors duration-200 font-semibold text-sm flex items-center space-x-2 group-hover:shadow-lg"
          >
            <span>{t('tradeMain.view')}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;