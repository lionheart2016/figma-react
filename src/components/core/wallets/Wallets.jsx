import React from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';
import Layout from '../Layout';
import WalletCard from './WalletCard';

function Wallets() {
  const { t } = useTranslation();
  const { user, logout } = usePrivy();
  const { wallets } = useWallets();

  return (
    <Layout activeMenu="wallets" pageTitle="wallets.title" breadcrumbItems={['sidebar.dashboard', 'sidebar.wallets']}>
      <div className="wallets-content">
        <div className="mb-6 sm:mb-8">
          <p className="text-sm sm:text-base text-[#73798B] mt-2">
            {t('wallets.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* 钱包信息卡片 */}
          <div className="lg:col-span-1">
            <WalletCard />
          </div>

          {/* 钱包列表 */}
          <div className="lg:col-span-1">
            <div className="card p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[#1c1c1c] mb-4 sm:mb-6">
                {t('wallets.connectedWallets')}
              </h2>
              
              {wallets.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#F8FAFF] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#73798B]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base text-[#73798B]">{t('wallets.noWallets')}</p>
                  <p className="text-xs sm:text-sm text-[#73798B] mt-1">{t('wallets.connectToStart')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {wallets.map((wallet, index) => (
                    <div key={wallet.address} className="flex items-center justify-between p-3 bg-[#F8FAFF] rounded-lg border border-[#E8EAED]">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#4B5EF5] to-[#1F32D6] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {wallet.walletClientType?.charAt(0) || 'W'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1c1c1c]">
                            {wallet.walletClientType || t('wallets.unknownWallet')}
                          </p>
                          <p className="text-xs text-[#73798B] font-mono">
                            {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {t('wallets.connected')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 钱包操作指南 */}
        <div className="mt-6 sm:mt-8">
          <div className="card p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-[#1c1c1c] mb-4">{t('wallets.usageGuide')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#1c1c1c]">{t('wallets.connectWallet')}</h4>
                <p className="text-sm text-[#73798B] mt-1">{t('wallets.connectWalletDesc')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#1c1c1c]">{t('wallets.manageAssets')}</h4>
                <p className="text-sm text-[#73798B] mt-1">{t('wallets.manageAssetsDesc')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#1c1c1c]">{t('wallets.secureTrading')}</h4>
                <p className="text-sm text-[#73798B] mt-1">{t('wallets.secureTradingDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Wallets;