import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../Layout';
import WalletCard from './WalletCard';
import { usePrivy, useWallets, ConnectedWallet } from '@privy-io/react-auth';

const Wallets: React.FC = () => {
  const { t } = useTranslation();
  const { authenticated, createWallet, connectWallet } = usePrivy();
  const wallets = useWallets();
  
  // 创建钱包按钮点击处理
  const handleCreateWallet = () => {
    createWallet('ethereum');
  };

  // 连接外部钱包
  const handleConnectWallet = () => {
    connectWallet();
  };

  // 渲染钱包卡片
  const renderWalletCard = (wallet: ConnectedWallet, index: number) => {
    return <WalletCard key={`${wallet.address}-${index}`} wallet={wallet} />;
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t?.('wallets.title') || 'Wallets'}</h1>
            <p className="text-gray-600">{t?.('wallets.description') || 'Manage your connected wallets and assets'}</p>
          </div>
          
          {!authenticated && (
            <div className="mt-4 md:mt-0 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                {t?.('wallets.loginToManage') || 'Please login to manage your wallets'}
              </p>
            </div>
          )}
        </div>
        
        {authenticated ? (
          <>
            {/* 创建新钱包区域 */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t?.('wallets.createNew') || 'Create New Wallet'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={handleCreateWallet}
                  className="p-4 bg-[#F8FAFF] border border-[#E8EAED] rounded-lg hover:bg-[#F0F4FF] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#4B5EF5] rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">ETH</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{t?.('wallets.ethereum') || 'Ethereum'}</h4>
                      <p className="text-xs text-gray-500">{t?.('wallets.create') || 'Create'}</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={handleConnectWallet}
                  className="p-4 bg-[#F8FAFF] border border-[#E8EAED] rounded-lg hover:bg-[#F0F4FF] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7B61FF] to-[#5733FF] rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">+</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{t?.('wallets.external') || 'External'}</h4>
                      <p className="text-xs text-gray-500">{t?.('wallets.connect') || 'Connect'}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            {/* 显示钱包列表 */}
            <div className="mt-4 space-y-3">
              {wallets.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{t?.('wallets.connectedWallets') || 'Connected Wallets'}</h3>
                  <div className="space-y-3">
                    {wallets.map(renderWalletCard)}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-[#F8FAFF] rounded-lg border border-[#E8EAED]">
                  <div className="w-16 h-16 bg-[#E8EAED] rounded-full flex items-center justify-center mb-4">
                    <span className="text-[#73798B] text-xl">💳</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{t?.('wallets.noWallets') || 'No wallets connected'}</h3>
                  <p className="text-gray-600 text-center max-w-md mb-6">
                    {t?.('wallets.connectWalletMessage') || 'Connect or create a wallet to start managing your digital assets'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={handleCreateWallet}
                      className="px-4 py-2 bg-[#4B5EF5] text-white rounded-lg hover:bg-[#3A4EDE] transition-colors"
                    >
                      {t?.('wallets.createWallet') || 'Create Wallet'}
                    </button>
                    <button 
                      onClick={handleConnectWallet}
                      className="px-4 py-2 border border-[#4B5EF5] text-[#4B5EF5] rounded-lg hover:bg-[#F0F4FF] transition-colors"
                    >
                      {t?.('wallets.connectWallet') || 'Connect Wallet'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-[#F8FAFF] rounded-lg border border-[#E8EAED]">
            <div className="w-16 h-16 bg-[#E8EAED] rounded-full flex items-center justify-center mb-4">
              <span className="text-[#73798B] text-xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{t?.('wallets.loginRequired') || 'Login Required'}</h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              {t?.('wallets.loginToAccess') || 'Please login to view and manage your wallets'}
            </p>
          </div>
        )}
        
        {/* 钱包使用指南 */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t?.('wallets.guide') || 'Wallet Guide'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-[#E8EAED] rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-blue-600">1</span>
              </div>
              <h4 className="font-medium mb-2">{t?.('wallets.guide.create') || 'Create Wallet'}</h4>
              <p className="text-sm text-gray-600">
                {t?.('wallets.guide.createDesc') || 'Create a new Ethereum wallet to manage your assets'}
              </p>
            </div>
            
            <div className="p-4 bg-white border border-[#E8EAED] rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-green-600">2</span>
              </div>
              <h4 className="font-medium mb-2">{t?.('wallets.guide.connect') || 'Connect Wallet'}</h4>
              <p className="text-sm text-gray-600">
                {t?.('wallets.guide.connectDesc') || 'Connect your existing wallet to access your funds'}
              </p>
            </div>
            
            <div className="p-4 bg-white border border-[#E8EAED] rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-purple-600">3</span>
              </div>
              <h4 className="font-medium mb-2">{t?.('wallets.guide.manage') || 'Manage Assets'}</h4>
              <p className="text-sm text-gray-600">
                {t?.('wallets.guide.manageDesc') || 'View balances and manage your digital assets'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wallets;