import React, { useCallback } from 'react';
import { useUserState } from '../../../services/UserStateService';
import { useCreateWallet, useConnectWallet } from '@privy-io/react-auth';
import WalletList from './WalletList';
import WalletOperations from './WalletOperations';
import { useTheme } from '../../../contexts/ThemeContext';
import Layout from '../Layout';
import './styles.css';

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
    isLoading: userLoading 
  } = useUserState();
  
  const { theme } = useTheme();
  
  // 使用Privy SDK的钱包功能
  const { createWallet } = useCreateWallet();
  
  // 组件状态
  const [isConnectingExternal, setIsConnectingExternal] = React.useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = React.useState(false);
  
  // 使用Privy SDK的钱包连接功能
  const { connectWallet } = useConnectWallet({
    onSuccess: (wallet) => {
      console.log('外部钱包连接成功:', wallet);
      setIsConnectingExternal(false);
      // 连接成功后刷新钱包数据
      refreshWallets();
    },
    onError: (error) => {
      console.error('外部钱包连接失败:', error);
      setIsConnectingExternal(false);
    }
  });

  /**
   * 处理创建钱包
   */
  const handleCreateWallet = async () => {
    setIsCreatingWallet(true);
    
    try {
      console.log('开始创建嵌入式钱包');
      const wallet = await createWallet();
      console.log('钱包创建成功:', wallet);
      
      // 创建成功后刷新钱包数据
      refreshWallets();
    } catch (err) {
      console.error('创建钱包失败:', err);
    } finally {
      setIsCreatingWallet(false);
    }
  };

  /**
   * 处理连接外部钱包
   */
  const handleConnectExternalWallet = async () => {
    setIsConnectingExternal(true);
    
    try {
      console.log('打开默认钱包选择界面');
      await connectWallet();
    } catch (err) {
      console.error(`连接外部钱包失败:`, err);
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
      })
      .catch((err) => {
        console.error('复制地址失败:', err);
      });
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

        {/* 错误提示 */}
        {walletState.error && (
          <div className="wallets-error-message">
            <p className="wallets-error-content">
              <span className="wallets-error-icon">⚠️</span>
              {walletState.error}
            </p>
          </div>
        )}
        
        {/* 钱包操作区域 */}
        <WalletOperations
          onConnectExternalWallet={handleConnectExternalWallet}
          onCreateWallet={handleCreateWallet}
          isConnectingExternal={isConnectingExternal}
          isCreatingWallet={isCreatingWallet}
          hasEmbeddedWallet={walletState.hasEmbeddedWallet}
        />
        
        {/* 钱包列表区域 */}
        <WalletList
          wallets={walletState.wallets}
          activeWallet={walletState.activeWallet}
          onActivateWallet={handleActivateWallet}
          onCopyAddress={handleCopyAddress}
        />
      </div>
    </Layout>
  );
};

export default Wallets;