import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';

interface Network {
  id: string;
  name: string;
  icon: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  minInvestment: string;
  image: string;
  backgroundImage: string;
  tokenType?: string;
  totalSupply?: string;
  currentPrice?: string;
}

interface ProductCardProps {
  product: Product;
  onViewProduct: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewProduct }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedNetwork, setSelectedNetwork] = useState<string>('ethereum');
  const [showNetworkDropdown, setShowNetworkDropdown] = useState<boolean>(false);

  // 支持的网络列表
  const networks: Network[] = [
    { id: 'ethereum', name: 'Ethereum', icon: '🔷' },
    { id: 'polygon', name: 'Polygon', icon: '🟣' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔵' },
    { id: 'optimism', name: 'Optimism', icon: '🟠' },
    { id: 'bnb', name: 'BNB Chain', icon: '🟡' }
  ];

  const selectedNetworkData = networks.find(network => network.id === selectedNetwork);

  return (
    <div className={`rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 group ${isDarkMode ? 'bg-[#1A1A1A] border-[#2C2C2C] hover:border-blue-900/50' : 'bg-white border-gray-100 hover:border-blue-100'}`}>
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
          <h3 className={`text-lg font-semibold mb-2 line-clamp-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
          <p className={`text-sm leading-relaxed line-clamp-2 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-gray-600'}`}>{product.description}</p>
        </div>
        
        {/* 产品详细信息 */}
        <div className="space-y-2 mb-4">
          {/* 代币类型 */}
          <div className="flex justify-between text-sm">
            <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-gray-500'}>{t('tradeMain.tokenType')}</span>
            <span className={isDarkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'}>{product.tokenType || 'ERC-20'}</span>
          </div>
          
          {/* 总供应量 */}
          <div className="flex justify-between text-sm">
            <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-gray-500'}>{t('tradeMain.totalSupply')}</span>
            <span className={isDarkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'}>{product.totalSupply || '10,000,000'}</span>
          </div>
          
          {/* 当前价格 */}
          <div className="flex justify-between text-sm">
            <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-gray-500'}>{t('tradeMain.currentPrice')}</span>
            <span className={isDarkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'}>{product.currentPrice || '$1.00'}</span>
          </div>
        </div>
        
        {/* 最低投资额 - 突出显示 */}
        <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border-blue-900/30 border' : 'bg-blue-50 border border-blue-100'}`}>
          <div className={`text-xs mb-1 font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{t('tradeMain.minInvestment')}</div>
          <div className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>{product.minInvestment}</div>
        </div>
        
        {/* 卡片底部 - 可交互的网络选择器 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* 网络选择器 */}
          <div className="relative">
            <button
              onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
              className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors duration-200 ${isDarkMode ? 'border-[#2C2C2C] bg-[#1A1A1A] hover:border-[#3C3C3C]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              {/* 网络图标 */}
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {selectedNetworkData?.icon || '🔷'}
              </div>
              
              {/* 网络名称 */}
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{selectedNetworkData?.name}</span>
              
              {/* 下拉箭头 */}
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showNetworkDropdown ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* 网络选择下拉菜单 */}
            {showNetworkDropdown && (
              <div className={`absolute bottom-full left-0 mb-2 w-48 border rounded-lg shadow-lg z-10 ${isDarkMode ? 'bg-[#1A1A1A] border-[#2C2C2C]' : 'bg-white border border-gray-200'}`}>
                <div className="py-1">
                  {networks.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => {
                        setSelectedNetwork(network.id);
                        setShowNetworkDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors duration-150 ${isDarkMode 
                        ? selectedNetwork === network.id 
                          ? 'bg-blue-900/20 text-blue-400' 
                          : 'text-white hover:bg-[#2C2C2C]' 
                        : selectedNetwork === network.id 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
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