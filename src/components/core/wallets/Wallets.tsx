import React, { useState } from 'react';
import { useUserState } from '../../../services/UserStateService';
import WalletList from './WalletList';
import WalletOperations from './WalletOperations';
import ActivityHistory from './ActivityHistory';
import WalletAssets from './WalletAssets';
import CustomWallets from './customWallets';
import { useTheme } from '../../../contexts/ThemeContext';
import Layout from '../Layout';
import './styles.css';
import { providers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { Wallet } from './types';

/**
 * 钱包管理组件
 * 使用UserStateService的统一钱包状态管理
 */
const Wallets: React.FC = () => {
  // 使用用户状态服务中的统一钱包状态
  const { 
    walletState, 
    setActiveWallet, 
    refreshWallets,
    addExternalWallet
  } = useUserState();
  
  const { theme } = useTheme();
  
  // 组件状态
  const [isConnectingExternal, setIsConnectingExternal] = useState(false);
  const [activeTab, setActiveTab] = useState<'assets' | 'activities' | 'wallets'>('assets');

  /**
   * 处理连接外部钱包 - 专门连接MetaMask钱包
   */
  const handleConnectExternalWallet = async () => {
    setIsConnectingExternal(true);
    
    try {
      console.log('开始连接MetaMask钱包...');
      
      // 检测MetaMask提供者
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        throw new Error('未检测到MetaMask钱包，请先安装MetaMask扩展程序');
      }
      
      console.log('MetaMask提供者检测成功:', provider);
      
      // 请求账户访问权限
      const accounts = await (window.ethereum as any).request({
        method: 'eth_requestAccounts'
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('用户拒绝了账户访问请求');
      }
      
      const userAddress = accounts[0];
      console.log('MetaMask钱包连接成功，用户地址:', userAddress);
      
      // 创建ethers提供者
      const ethersProvider = new providers.Web3Provider(window.ethereum as any);
      
      // 获取网络信息
      const network = await ethersProvider.getNetwork();
      console.log('当前网络信息:', network);
      
      // 获取签名者
      const signer = await ethersProvider.getSigner();
      console.log('签名者信息:', signer);
      
      // 将钱包添加到用户状态中
      try {
        await addExternalWallet({
          address: userAddress,
          walletClientType: 'metamask',
          connectorType: 'injected',
          chainType: 'ethereum',
          name: 'MetaMask Wallet'
        });
        
        console.log('MetaMask钱包连接成功！钱包已添加到您的账户中。');
        alert('MetaMask钱包连接成功！钱包已添加到您的账户中。');
        
      } catch (err: any) {
        console.error('添加MetaMask钱包到用户状态失败:', err);
        
        if (err.message?.includes('用户未登录')) {
          alert('请先登录后再连接钱包');
        } else if (err.message?.includes('钱包已存在')) {
          console.log('钱包已存在，无需重复添加');
          alert('MetaMask钱包连接成功！钱包已存在于您的账户中。');
        } else {
          alert(`添加钱包失败: ${err.message || '未知错误'}`);
        }
      }
      
      // 刷新钱包数据
      refreshWallets();
      
    } catch (err: any) {
      console.error('连接MetaMask钱包失败:', err);
      
      // 显示用户友好的错误信息
      if (err.code === 4001) {
        alert('用户拒绝了MetaMask连接请求');
      } else if (err.message?.includes('未检测到MetaMask')) {
        alert('请先安装MetaMask浏览器扩展程序');
      } else {
        alert(`连接MetaMask失败: ${err.message || '未知错误'}`);
      }
    } finally {
      setIsConnectingExternal(false);
    }
  };

  /**
   * 处理激活钱包
   */
  const handleActivateWallet = (wallet: any) => {
    console.log('激活钱包:', wallet);
    setActiveWallet(wallet);
  };

  /**
   * 处理复制钱包地址
   */
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        console.log('地址已复制到剪贴板:', address);
        // 可以添加一个短暂的成功提示
      })
      .catch((err) => {
        console.error('复制地址失败:', err);
      });
  };



  // 资产Tab使用独立组件

  /**
   * 渲染活动Tab内容 - 使用ActivityHistory组件
   */
  const renderActivitiesTab = () => {
    return (
      <div className="wallet-tab-content">
        <ActivityHistory activeWallet={walletState.activeWallet} />
      </div>
    );
  };



  // 加载状态显示
  if (walletState.isLoading) {
    return (
      <Layout activeMenu="wallets">
        <div className={`wallets-container ${theme}`}>
          <div className="wallets-loading-container">
            <div className="wallets-loading-icon">🔄</div>
            <div className="wallets-loading-text">加载钱包中...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeMenu="wallets">
      <div className={`wallets-container ${theme}`}>
        <h1>钱包管理</h1>

        {/* 错误提示 */}
        {walletState.error && (
          <div className="wallets-error-message">
            <p className="wallets-error-content">
              <span className="wallets-error-icon">⚠️</span>
              {walletState.error}
            </p>
          </div>
        )}
        
        {/* Tab导航 */}
        <div className="wallet-tabs">
          <button 
            className={`tab-button ${activeTab === 'assets' ? 'active' : ''}`}
            onClick={() => setActiveTab('assets')}
          >
            资产
          </button>
          <button 
            className={`tab-button ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            活动
          </button>
          <button 
            className={`tab-button ${activeTab === 'wallets' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallets')}
          >
            钱包
          </button>
        </div>
        
        {/* Tab内容 */}
        <div className="wallet-tabs-content">
          {activeTab === 'assets' && <WalletAssets walletState={walletState} />}
          {activeTab === 'activities' && renderActivitiesTab()}
          {activeTab === 'wallets' && (
            <CustomWallets
              wallets={walletState.wallets}
              activeWallet={walletState.activeWallet}
              isConnectingExternal={isConnectingExternal}
              onConnectExternalWallet={handleConnectExternalWallet}
              onActivateWallet={handleActivateWallet}
              onCopyAddress={handleCopyAddress}
            />
          )}
        </div>
        

      </div>
    </Layout>
  );
};

export default Wallets;