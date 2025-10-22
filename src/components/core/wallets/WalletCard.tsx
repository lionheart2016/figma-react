import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import { ConnectedWallet } from '@privy-io/react-auth';
import { baseSepolia } from 'viem/chains';

interface WalletCardProps {
  wallet: ConnectedWallet;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  // 格式化地址显示
  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // 判断钱包连接状态
  const isConnected: boolean = wallet && wallet.status === 'connected';
  
  return (
    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-[#1A1A1A] border-[#2C2C2C]' : 'bg-white border-[#E8EAED]'}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#4B5EF5] rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-semibold text-xs">ETH</span>
          </div>
          <div>
            <p className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>{wallet.type === 'ethereum' ? 'Ethereum' : wallet.type}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatAddress(wallet.address)}</p>
          </div>
        </div>
        {isConnected && (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'}`}>
            {t?.('wallets.connected') || 'Connected'}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t?.('wallets.network') || 'Network'}</p>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : ''}`}>{baseSepolia.name}</p>
        </div>
        <div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t?.('wallets.balance') || 'Balance'}</p>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : ''}`}>0.00</p>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;