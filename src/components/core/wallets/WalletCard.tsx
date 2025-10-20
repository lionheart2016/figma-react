import React from 'react';
import { useTranslation } from 'react-i18next';

type WalletInfo = {
  address?: string;
  balance: string;
  isConnected: boolean;
  isLoading: boolean;
  network: string;
};

const WalletCard: React.FC = () => {
  const { t } = useTranslation();
  // 模拟钱包数据，因为之前的useWallets可能有类型问题
  const walletInfo: WalletInfo = {
    address: '', // 初始为空，实际应用中会从钱包连接状态获取
    balance: '0.00',
    isConnected: false,
    isLoading: false,
    network: t('wallets.ethereumMainnet')
  };
  
  const { address, balance, isConnected, isLoading, network } = walletInfo;

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-[#1c1c1c]">{t('wallets.walletInfo')}</h2>
        <div className={`tag ${isConnected ? 'tag-success' : 'tag-warning'} text-xs sm:text-sm`}>
          {isConnected ? t('wallets.connected') : t('wallets.notConnected')}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* 钱包地址 */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-[#73798B] mb-1 sm:mb-2 block">{t('wallets.walletAddress')}</label>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="icon-container icon-container-primary w-6 h-6 sm:w-8 sm:h-8">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
              </svg>
            </div>
            <span className="font-mono text-xs sm:text-sm text-[#1c1c1c]">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : t('wallets.noWalletConnected')}
            </span>
          </div>
        </div>

        {/* 余额 */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-[#73798B] mb-1 sm:mb-2 block">{t('wallets.balance')}</label>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="icon-container icon-container-gray w-6 h-6 sm:w-8 sm:h-8">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
              </svg>
            </div>
            <span className="text-base sm:text-lg font-semibold text-[#1c1c1c]">
              {isLoading ? t('wallets.loading') : `${balance} ETH`}
            </span>
          </div>
        </div>

        {/* 网络信息 */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-[#73798B] mb-1 sm:mb-2 block">{t('wallets.network')}</label>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="icon-container icon-container-primary w-6 h-6 sm:w-8 sm:h-8">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
              </svg>
            </div>
            <span className="text-xs sm:text-sm text-[#1c1c1c]">{network}</span>
          </div>
        </div>
      </div>

      {!isConnected && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#4B5EF5]/10 rounded-xl border border-[#4B5EF5]/20">
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#4B5EF5] mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs sm:text-sm text-[#4B5EF5]">{t('wallets.connectWalletToTrade')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletCard;