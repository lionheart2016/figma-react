import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { usePrivy, useLoginWithEmail, useWallets } from '@privy-io/react-auth';

// 账户类型常量定义
export const ACCOUNT_TYPES = {
  WALLET: 'wallet',
  GOOGLE_OAUTH: 'google_oauth',
  EMAIL: 'email',
  // 可以根据需要添加更多账户类型
} as const;

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];

export interface User {
  id: string;
  email: string;
  walletAddress?: string;
  linkedAccounts?: LinkedAccount[];
}

export interface LinkedAccount {
  id?: string | null;
  address?: string;
  type: AccountType;
  email?: string;
  name?: string;
  chainType?: string;
  walletClientType?: string;
  connectorType?: string;
  recoveryMethod?: string;
  imported?: boolean;
  delegated?: boolean;
  walletIndex?: number;
  firstVerifiedAt?: string;
  latestVerifiedAt?: string;
}

// 钱包数据接口
export interface Wallet {
  address: string;
  chain: string;
  type: 'embedded' | 'external';
  walletType: string;
  name: string;
}

// 钱包状态接口
export interface WalletState {
  wallets: Wallet[];
  activeWallet: Wallet | null;
  hasEmbeddedWallet: boolean;
  isLoading: boolean;
  error: string | null;
}

// 账户分类辅助函数
export const AccountUtils = {
  // 检查账户是否为钱包账户
  isWalletAccount: (account: LinkedAccount): boolean => {
    return account.type === ACCOUNT_TYPES.WALLET;
  },

  // 检查账户是否为第三方OAuth账户
  isOAuthAccount: (account: LinkedAccount): boolean => {
    return account.type === ACCOUNT_TYPES.GOOGLE_OAUTH;
    // 可以根据需要添加其他OAuth类型
  },

  // 检查账户是否为邮箱账户
  isEmailAccount: (account: LinkedAccount): boolean => {
    return account.type === ACCOUNT_TYPES.EMAIL;
  },

  // 获取账户的显示名称
  getAccountDisplayName: (account: LinkedAccount): string => {
    if (AccountUtils.isWalletAccount(account)) {
      return account.address ? `${account.address.substring(0, 8)}...${account.address.substring(account.address.length - 6)}` : 'Unknown Wallet';
    }
    
    if (AccountUtils.isOAuthAccount(account)) {
      return account.name || account.email || 'Unknown Account';
    }
    
    return account.email || 'Unknown Account';
  },

  // 获取账户类型描述
  getAccountTypeDescription: (account: LinkedAccount): string => {
    switch (account.type) {
      case ACCOUNT_TYPES.WALLET:
        return `Wallet (${account.chainType || 'Unknown Chain'})`;
      case ACCOUNT_TYPES.GOOGLE_OAUTH:
        return 'Google Account';
      case ACCOUNT_TYPES.EMAIL:
        return 'Email Account';
      default:
        return 'Unknown Account Type';
    }
  },

  // 过滤钱包账户
  filterWalletAccounts: (accounts: LinkedAccount[]): LinkedAccount[] => {
    return accounts.filter(account => AccountUtils.isWalletAccount(account));
  },

  // 过滤非钱包账户
  filterNonWalletAccounts: (accounts: LinkedAccount[]): LinkedAccount[] => {
    return accounts.filter(account => !AccountUtils.isWalletAccount(account));
  },

  // 按账户类型分组
  groupAccountsByType: (accounts: LinkedAccount[]): Record<AccountType, LinkedAccount[]> => {
    const grouped = {} as Record<AccountType, LinkedAccount[]>;
    
    accounts.forEach(account => {
      if (!grouped[account.type]) {
        grouped[account.type] = [];
      }
      grouped[account.type].push(account);
    });
    
    return grouped;
  }
};

interface UserStateContextType {
  // 用户状态
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // 钱包状态
  walletState: WalletState;
  
  // 认证方法
  loginWithEmail: (email: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // 钱包操作方法
  setActiveWallet: (wallet: Wallet | null) => void;
  refreshWallets: () => void;
  
  // Privy SDK 直接访问（可选，用于高级功能）
  privy: ReturnType<typeof usePrivy>;
}

const UserStateContext = createContext<UserStateContextType | undefined>(undefined);

export const useUserState = () => {
  const context = useContext(UserStateContext);
  if (!context) {
    throw new Error('useUserState must be used within a UserStateProvider');
  }
  return context;
};

// 简化的用户状态钩子，用于基本场景
export const useUser = () => {
  const context = useUserState();
  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    error: context.error,
    loginWithEmail: context.loginWithEmail,
    verifyEmail: context.verifyEmail,
    logout: context.logout,
  };
};

interface UserStateProviderProps {
  children: ReactNode;
}

export const UserStateProvider: React.FC<UserStateProviderProps> = ({ children }) => {
  // 直接使用Privy SDK
  const privy = usePrivy();
  const { wallets: privyWallets, ready: walletsReady } = useWallets();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  // 钱包状态管理
  const [walletState, setWalletState] = useState<WalletState>({
    wallets: [],
    activeWallet: null,
    hasEmbeddedWallet: false,
    isLoading: true,
    error: null
  });

  // Privy邮箱登录功能
  const {
    sendCode: sendEmailCode,
    loginWithCode: loginWithEmailCode,
  } = useLoginWithEmail({
    onComplete: ({ user: privyUser }) => {
      console.log('[UserStateService] 用户登录流程完成');
      setError(null);
    },
    onError: (error) => {
      console.error('[UserStateService] 用户登录流程失败:', error);
      
      if (typeof error === 'string') {
        if (error.includes('invalid_credentials')) {
          setError('登录失败：无效的凭证');
        } else {
          setError(`登录失败：${error}`);
        }
      } else {
        setError('登录失败，请重试');
      }
    },
  });

  // 钱包数据同步逻辑
  const syncWalletData = useCallback(() => {
    if (!user || !walletsReady) {
      setWalletState(prev => ({
        ...prev,
        isLoading: true
      }));
      return;
    }

    try {
      const walletList: Wallet[] = [];
      const processedAddresses = new Set<string>(); // 用于避免重复地址
      let hasEmbedded = false;
      
      // 1. 从Privy的useWallets获取钱包数据
      if (privyWallets && privyWallets.length > 0) {
        privyWallets.forEach(wallet => {
          if (wallet.address && !processedAddresses.has(wallet.address.toLowerCase())) {
            const isEmbedded = wallet.walletClientType === 'privy';
            if (isEmbedded) {
              hasEmbedded = true;
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
              hasEmbedded = true;
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
      
      // 设置默认激活钱包（如果还没有激活钱包）
      let activeWallet = walletState.activeWallet;
      if (walletList.length > 0 && !activeWallet) {
        // 优先使用外部钱包作为默认激活钱包
        activeWallet = walletList.find(w => w.type === 'external') || walletList[0];
      }
      
      setWalletState({
        wallets: walletList,
        activeWallet,
        hasEmbeddedWallet: hasEmbedded,
        isLoading: false,
        error: null
      });
    } catch (err) {
      console.error('[UserStateService] 同步钱包数据失败:', err);
      setWalletState(prev => ({
        ...prev,
        error: '加载钱包数据失败，请刷新页面重试',
        isLoading: false
      }));
    }
  }, [user, walletsReady, privyWallets, walletState.activeWallet]);

  // 获取钱包类型的可读名称
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

  // 钱包数据同步监听
  useEffect(() => {
    syncWalletData();
  }, [syncWalletData]);

  // 设置激活钱包
  const setActiveWallet = useCallback((wallet: Wallet | null) => {
    setWalletState(prev => ({
      ...prev,
      activeWallet: wallet
    }));
  }, []);

  // 刷新钱包数据
  const refreshWallets = useCallback(() => {
    syncWalletData();
  }, [syncWalletData]);

  // 同步Privy用户状态到应用状态
  useEffect(() => {
    if (privy.ready !== undefined) {
      const { user: privyUser, authenticated } = privy;
      console.log('[UserStateService] Privy用户状态:', { authenticated, privyUser });
      
      if (authenticated && privyUser) {
        try {
          // 解析linkedAccounts字段，正确分类账户类型
          const linkedAccounts: LinkedAccount[] = privyUser.linkedAccounts?.map(account => {
            // 根据账户类型进行准确分类
            let accountType: AccountType;
            
            if (account.type === ACCOUNT_TYPES.WALLET) {
              // 明确标识为钱包账户
              accountType = ACCOUNT_TYPES.WALLET;
            } else if (account.type === ACCOUNT_TYPES.GOOGLE_OAUTH) {
              // 明确标识为Google OAuth账户
              accountType = ACCOUNT_TYPES.GOOGLE_OAUTH;
            } else {
              // 其他类型账户，根据业务需求进一步分类
              // 这里可以根据实际需要添加更多类型判断
              accountType = account.type as AccountType;
            }
            
            // 安全地访问可能不存在的属性
            return {
              id: account.id || null,
              address: account.address || '',
              type: accountType,
              email: account.email || '',
              name: account.name || '',
              chainType: (account as any).chainType || '',
              walletClientType: (account as any).walletClientType || '',
              connectorType: (account as any).connectorType || '',
              recoveryMethod: (account as any).recoveryMethod || '',
              imported: (account as any).imported || false,
              delegated: (account as any).delegated || false,
              walletIndex: (account as any).walletIndex || 0,
              firstVerifiedAt: (account as any).firstVerifiedAt || '',
              latestVerifiedAt: (account as any).latestVerifiedAt || '',
            };
          }) || [];

          const appUser: User = {
            id: String(privyUser.id || ''),
            email: privyUser.email?.address || '',
            walletAddress: privyUser.wallet?.address ? String(privyUser.wallet.address) : undefined,
            linkedAccounts,
          };
          setUser(appUser);
        } catch (typeError) {
          console.error('[UserStateService] 转换用户数据类型时出错:', typeError);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(!privy.ready);
    }
  }, [privy.ready, privy.user, privy.authenticated]);

  // 邮箱登录方法
  const loginWithEmail = useCallback(async (email: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      await sendEmailCode({ email });
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err 
        ? `发送验证码失败：${(err as Error).message}` 
        : '发送验证码失败，请重试';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sendEmailCode]);

  // 邮箱验证方法
  const verifyEmail = useCallback(async (_email: string, code: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      await loginWithEmailCode({ code });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('invalid_credentials') || err.message.includes('invalid code')) {
          setError('验证失败：验证码不正确或已过期');
        } else {
          setError(`验证失败：${err.message}`);
        }
      } else {
        setError('验证失败，请检查验证码是否正确');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loginWithEmailCode]);

  // 登出方法
  const logoutHandler = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await privy.logout?.();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登出失败，请重试';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [privy.logout]);

  const value: UserStateContextType = {
    user,
    isAuthenticated: !!privy.authenticated,
    isLoading,
    error,
    walletState,
    loginWithEmail,
    verifyEmail,
    logout: logoutHandler,
    setActiveWallet,
    refreshWallets,
    privy, // 暴露完整的Privy实例用于高级功能
  };

  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
};