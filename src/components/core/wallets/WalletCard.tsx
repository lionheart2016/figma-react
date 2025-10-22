import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConnectedWallet } from '@privy-io/react-auth';
import { baseSepolia } from 'viem/chains';

interface WalletCardProps {
  wallet: ConnectedWallet;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet }) => {
  const { t } = useTranslation();
  
  // 格式化地址显示
  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // 判断钱包连接状态
  const isConnected: boolean = wallet && wallet.status === 'connected';
  
  return (
    <div className="p-4 bg-white border border-[#E8EAED] rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#4B5EF5] rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-semibold text-xs">ETH</span>
          </div>
          <div>
            <p className="font-medium">{wallet.type === 'ethereum' ? 'Ethereum' : wallet.type}</p>
            <p className="text-xs text-gray-500">{formatAddress(wallet.address)}</p>
          </div>
        </div>
        {isConnected && (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            {t?.('wallets.connected') || 'Connected'}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-gray-500">{t?.('wallets.network') || 'Network'}</p>
          <p className="text-sm font-medium">{baseSepolia.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t?.('wallets.balance') || 'Balance'}</p>
          <p className="text-sm font-medium">0.00</p>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;