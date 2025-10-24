import React, { useState, useEffect } from 'react';
import { useUser, AccountUtils } from '../../../services/UserStateService';
import { useCreateWallet, useWallets, useConnectWallet } from '@privy-io/react-auth';
import WalletList from './WalletList';
import WalletOperations from './WalletOperations';
import { Wallet } from './types';
import { useTheme } from '../../../contexts/ThemeContext';
import Layout from '../Layout';
import './styles.css';

/**
 * 钱包管理组件
 * 集成Privy SDK实现钱包创建、连接和管理功能
 */
const Wallets: React.FC = () => {
  // 使用用户状态服务
  const { user, isLoading: userLoading } = useUser();
  const { theme } = useTheme();
  
  // 使用Privy SDK的钱包功能
  const { createWallet } = useCreateWallet();
  const { wallets: privyWallets, ready: walletsReady } = useWallets();
  
  // 组件状态
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allWallets, setAllWallets] = useState<Wallet[]>([]);
  const [activeWallet, setActiveWallet] = useState<Wallet | null>(null);
  const [isConnectingExternal, setIsConnectingExternal] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [hasEmbeddedWallet, setHasEmbeddedWallet] = useState(false);
  
  // 使用Privy SDK的钱包连接功能
  const { connectWallet } = useConnectWallet({
    onSuccess: (wallet) => {
      console.log('外部钱包连接成功:', wallet);
      setIsConnectingExternal(false);
    },
    onError: (error) => {
      console.error('外部钱包连接失败:', error);
      setError('连接外部钱包失败，请重试');
      setIsConnectingExternal(false);
    }
  });

  /**
   * 初始化和同步钱包数据
   */
  useEffect(() => {
    if (userLoading || !walletsReady || !user) {
      setIsLoading(true);
      return;
    }

    const syncWalletData = () => {
      try {
        setError(null);
        const walletList: Wallet[] = [];
        const processedAddresses = new Set<string>(); // 用于避免重复地址
        
        // 1. 从Privy的useWallets获取钱包数据
        if (privyWallets && privyWallets.length > 0) {
          privyWallets.forEach(wallet => {
            if (wallet.address && !processedAddresses.has(wallet.address.toLowerCase())) {
              const isEmbedded = wallet.walletClientType === 'privy';
              if (isEmbedded) {
                setHasEmbeddedWallet(true);
              }
              
              walletList.push({
                address: wallet.address,
                chain: wallet.chainId || 'ethereum',
                type: isEmbedded ? 'embedded' : 'external',
                walletType: wallet.walletClientType || (isEmbedded ? 'privy' : 'unknown'),
                name: isEmbedded ? '嵌入式钱包' : (getWalletTypeName(wallet.walletClientType) || '外部钱包')
              });
              
              processedAddresses.add(wallet.address.toLowerCase());
            }
          });
        }
        
        // 2. 从user.linkedAccounts获取钱包数据
        if (user.linkedAccounts && user.linkedAccounts.length > 0) {
          const walletAccounts = user.linkedAccounts.filter(account => 
            AccountUtils.isWalletAccount(account)
          );
          
          walletAccounts.forEach(account => {
            if (account.address && !processedAddresses.has(account.address.toLowerCase())) {
              const isEmbedded = account.walletClientType === 'privy';
              if (isEmbedded) {
                setHasEmbeddedWallet(true);
              }
              
              walletList.push({
                address: account.address,
                chain: account.chainType || 'ethereum',
                type: isEmbedded ? 'embedded' : 'external',
                walletType: account.walletClientType || (isEmbedded ? 'privy' : 'unknown'),
                name: isEmbedded ? '嵌入式钱包' : (getWalletTypeName(account.walletClientType) || '外部钱包')
              });
              
              processedAddresses.add(account.address.toLowerCase());
            }
          });
        }
        
        // 3. 从user.walletAddress获取嵌入式钱包地址（如果有）
        if (user.walletAddress) {
          const walletAddress = user.walletAddress;
          if (walletAddress && !processedAddresses.has(walletAddress.toLowerCase())) {
            setHasEmbeddedWallet(true);
            
            walletList.push({
              address: walletAddress,
              chain: 'ethereum', // 默认为以太坊链
              type: 'embedded',
              walletType: 'privy',
              name: '嵌入式钱包'
            });
            
            processedAddresses.add(walletAddress.toLowerCase());
          }
        }
        
        setAllWallets(walletList);
        
        // 设置默认激活钱包（如果还没有激活钱包）
        if (walletList.length > 0 && !activeWallet) {
          // 优先使用外部钱包作为默认激活钱包
          const defaultWallet = walletList.find(w => w.type === 'external') || walletList[0];
          setActiveWallet(defaultWallet);
        }
      } catch (err) {
        console.error('同步钱包数据失败:', err);
        setError('加载钱包数据失败，请刷新页面重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    syncWalletData();
  }, [user, userLoading, walletsReady, privyWallets, activeWallet]);

  /**
   * 获取钱包类型的可读名称
   */
  const getWalletTypeName = (walletType?: string): string => {
    const walletTypeMap: Record<string, string> = {
      'metamask': 'MetaMask',
      'coinbase-wallet': 'Coinbase Wallet',
      'wallet-connect': 'WalletConnect',
      'rainbow': 'Rainbow',
      'phantom': 'Phantom',
      'privy': 'Privy嵌入式钱包'
    };
    
    return walletTypeMap[walletType || ''] || '';
  };

  /**
   * 处理创建钱包
   */
  const handleCreateWallet = async () => {
    setIsCreatingWallet(true);
    setError(null);
    
    try {
      console.log('开始创建嵌入式钱包');
      const wallet = await createWallet();
      console.log('钱包创建成功:', wallet);
      
      // 创建成功后刷新钱包列表
      setHasEmbeddedWallet(true);
    } catch (err) {
      console.error('创建钱包失败:', err);
      const errorMessage = err instanceof Error ? 
        `创建钱包失败: ${err.message}` : 
        '创建钱包失败，请重试';
      setError(errorMessage);
    } finally {
      setIsCreatingWallet(false);
    }
  };

  /**
   * 处理连接外部钱包
   */
  const handleConnectExternalWallet = async () => {
    setIsConnectingExternal(true);
    setError(null);
    
    try {
      // 使用Privy SDK提供的钱包连接UI
        console.log('打开默认钱包选择界面');
        await connectWallet();
      
    } catch (err) {
      console.error(`连接外部钱包失败:`, err);
      setError('连接外部钱包失败，请重试');
      setIsConnectingExternal(false);
    }
  };

  /**
   * 处理激活钱包
   */
  const handleActivateWallet = (wallet: Wallet) => {
    console.log('激活钱包:', wallet);
    setActiveWallet(wallet);
    // 这里可以添加额外的激活逻辑，如更新用户状态等
  };

  /**
   * 处理复制钱包地址
   */
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        console.log('地址已复制到剪贴板:', address);
        // 这里可以添加成功提示
      })
      .catch((err) => {
        console.error('复制地址失败:', err);
        setError('复制地址失败，请手动复制');
      });
  };



  // 加载状态显示
  if (isLoading) {
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
        {error && (
          <div className="wallets-error-message">
            <p className="wallets-error-content">
              <span className="wallets-error-icon">⚠️</span>
              {error}
            </p>
          </div>
        )}
        
        {/* 钱包操作区域 */}
        <WalletOperations
          onConnectExternalWallet={handleConnectExternalWallet}
          onCreateWallet={handleCreateWallet}
          isConnectingExternal={isConnectingExternal}
          isCreatingWallet={isCreatingWallet}
          hasEmbeddedWallet={hasEmbeddedWallet}
        />
        
        {/* 钱包列表区域 */}
        <WalletList
          wallets={allWallets}
          activeWallet={activeWallet}
          onActivateWallet={handleActivateWallet}
          onCopyAddress={handleCopyAddress}
        />
      </div>
    </Layout>
  );
};

export default Wallets;