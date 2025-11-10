import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';

// 账户类型常量定义
export const ACCOUNT_TYPES = {
  WALLET: 'wallet',
  GOOGLE_OAUTH: 'google_oauth',
  EMAIL: 'email',
  // 可以根据需要添加更多账户类型
} as const;

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];

// 用户类型枚举
export const USER_TYPES = {
  INDIVIDUAL: 'individual',
  INSTITUTION: 'institution',
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

// 认证状态枚举
export const AUTH_STATUS = {
  NOT_AUTHENTICATED: 'not_authenticated',
  UNDER_REVIEW: 'under_review',
  AUTHENTICATED: 'authenticated',
  AUTHENTICATION_FAILED: 'authentication_failed'
} as const;

export type AuthStatus = typeof AUTH_STATUS[keyof typeof AUTH_STATUS];

export interface User {
  id: string;
  email: string;
  userType: UserType;
  walletAddress?: string;
  linkedAccounts?: LinkedAccount[];
  authStatus?: AuthStatus;
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

// 简化的用户认证状态
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
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

// 用户类型辅助函数
export const UserTypeUtils = {
  // 获取用户类型的显示名称
  getUserTypeDisplayName: (userType: UserType): string => {
    switch (userType) {
      case USER_TYPES.INDIVIDUAL:
        return '普通用户';
      case USER_TYPES.INSTITUTION:
        return '机构用户';
      default:
        return '未知用户类型';
    }
  },

  // 检查用户是否为机构用户
  isInstitutionUser: (user: User | null): boolean => {
    return user?.userType === USER_TYPES.INSTITUTION;
  },

  // 检查用户是否为普通用户
  isIndividualUser: (user: User | null): boolean => {
    return user?.userType === USER_TYPES.INDIVIDUAL;
  },

  // 获取用户类型的权限级别
  getUserPermissionLevel: (userType: UserType): number => {
    switch (userType) {
      case USER_TYPES.INSTITUTION:
        return 2; // 机构用户有更高权限
      case USER_TYPES.INDIVIDUAL:
        return 1; // 普通用户基础权限
      default:
        return 0;
    }
  }
};

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
  
  // 用户类型相关状态
  userType: UserType | null;
  isInstitutionUser: boolean;
  isIndividualUser: boolean;
  
  // 钱包状态
  walletState: WalletState;
  
  // 认证方法
  loginWithEmail: (email: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  updateAuthStatus: (status: AuthStatus) => Promise<void>;
  
  // 钱包操作方法
  setActiveWallet: (wallet: Wallet | null) => void;
  refreshWallets: () => void;
  addExternalWallet: (walletData: {
    address: string;
    walletClientType: string;
    connectorType: string;
    chainType?: string;
    name?: string;
  }) => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    // 从localStorage恢复用户状态
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      console.error('[UserStateService] 从本地存储恢复用户状态失败:', err);
      return null;
    }
  });
  
  // 钱包状态管理
  const [walletState, setWalletState] = useState<WalletState>({
    wallets: [],
    activeWallet: null,
    hasEmbeddedWallet: false,
    isLoading: false,
    error: null
  });

  // 简化的钱包数据同步逻辑
  const syncWalletData = useCallback(() => {
    if (!user) {
      setWalletState(prev => ({
        ...prev,
        isLoading: false
      }));
      return;
    }

    try {
      const walletList: Wallet[] = [];
      const processedAddresses = new Set<string>(); // 用于避免重复地址
      let hasEmbedded = false;
      
      // 从user.linkedAccounts获取钱包数据
      if (user.linkedAccounts && user.linkedAccounts.length > 0) {
        const walletAccounts = user.linkedAccounts.filter(account => 
          AccountUtils.isWalletAccount(account)
        );
        
        walletAccounts.forEach(account => {
          if (account.address && !processedAddresses.has(account.address.toLowerCase())) {
            const isEmbedded = account.walletClientType === 'embedded';
            if (isEmbedded) {
              hasEmbedded = true;
            }
            
            walletList.push({
              address: account.address,
              chain: account.chainType || 'ethereum',
              type: isEmbedded ? 'embedded' : 'external',
              walletType: account.walletClientType || (isEmbedded ? 'embedded' : 'unknown'),
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
  }, [user, walletState.activeWallet]);

  // 获取钱包类型的可读名称
  const getWalletTypeName = (walletType?: string): string => {
    const walletTypeMap: Record<string, string> = {
      'metamask': 'MetaMask',
      'coinbase-wallet': 'Coinbase Wallet',
      'wallet-connect': 'WalletConnect',
      'rainbow': 'Rainbow',
      'phantom': 'Phantom',
      'embedded': '嵌入式钱包'
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

  // 简化的用户状态管理
  useEffect(() => {
    // 这里可以添加本地存储的用户状态同步逻辑
    // 目前保持为空，后续可以根据需要添加本地认证逻辑
  }, []);

  // 简化的邮箱登录方法
  const loginWithEmail = useCallback(async (email: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // 模拟发送验证码过程
      console.log(`[UserStateService] 发送验证码到邮箱: ${email}`);
      // 这里可以添加实际的邮箱验证码发送逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err 
        ? `发送验证码失败：${(err as Error).message}` 
        : '发送验证码失败，请重试';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 添加外部钱包到用户状态
  const addExternalWallet = useCallback(async (walletData: {
    address: string;
    walletClientType: string;
    connectorType: string;
    chainType?: string;
    name?: string;
  }) => {
    if (!user) {
      throw new Error('用户未登录，请先登录后再连接钱包');
    }
    
    try {
      // 检查钱包是否已存在
      const existingWallet = user.linkedAccounts?.find(account => 
        account.type === ACCOUNT_TYPES.WALLET && 
        account.address?.toLowerCase() === walletData.address.toLowerCase()
      );
      
      if (existingWallet) {
        console.log('[UserStateService] 钱包已存在，无需重复添加:', walletData.address);
        return;
      }
      
      // 创建新的钱包账户
      const newWalletAccount: LinkedAccount = {
        type: ACCOUNT_TYPES.WALLET,
        address: walletData.address,
        walletClientType: walletData.walletClientType,
        connectorType: walletData.connectorType,
        chainType: walletData.chainType || 'ethereum',
        name: walletData.name || `External Wallet ${walletData.address.slice(0, 8)}...`
      };
      
      // 更新用户状态，添加新钱包
      setUser(prevUser => {
        if (!prevUser) return prevUser;
        
        const updatedUser = {
          ...prevUser,
          linkedAccounts: [
            ...(prevUser.linkedAccounts || []),
            newWalletAccount
          ]
        };
        
        // 保存更新后的用户状态到localStorage
        saveUserToLocalStorage(updatedUser);
        
        return updatedUser;
      });
      
      console.log('[UserStateService] 外部钱包添加成功:', walletData.address);
      
      // 刷新钱包数据
      syncWalletData();
      
    } catch (err) {
      console.error('[UserStateService] 添加外部钱包失败:', err);
      throw err;
    }
  }, [user, syncWalletData]);

  // 机构认证流程自动触发逻辑
  const triggerInstitutionalAuthFlow = useCallback((user: User) => {
    const timestamp = new Date().toISOString();
    const auditLog = {
      timestamp,
      userId: user.id,
      userType: user.userType,
      action: 'INSTITUTIONAL_AUTH_TRIGGERED',
      message: '机构用户登录成功，自动触发机构认证流程'
    };
    
    // 控制台审计日志
    console.group(`[机构认证审计] ${timestamp}`);
    console.log('用户ID:', user.id);
    console.log('用户类型:', user.userType);
    console.log('触发时间:', timestamp);
    console.log('操作类型: 机构认证流程自动触发');
    console.log('状态: 用户会话已验证，准备导航至机构认证页面');
    console.groupEnd();
    
    // 存储审计信息到localStorage用于追踪
    localStorage.setItem('institutionalAuthTriggered', 'true');
    localStorage.setItem('institutionalAuthUserId', user.id);
    localStorage.setItem('institutionalAuthTimestamp', timestamp);
    localStorage.setItem('institutionalAuthAudit', JSON.stringify(auditLog));
    
    // 打印审计摘要到控制台
    console.log(`✅ [机构认证] ${timestamp} - 用户 ${user.id} 的机构认证流程已触发`);
    
    // 这里可以添加实际的机构认证流程触发逻辑
    // 例如：导航到机构认证页面、显示认证模态框等
    console.log(`[机构认证] 检测到机构用户登录，准备启动认证流程`);
  }, []);

  // 更新认证状态方法
  const updateAuthStatus = useCallback(async (status: AuthStatus) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // 记录审计日志
      const timestamp = new Date().toISOString();
      const auditLog = {
        timestamp,
        userId: user?.id || 'unknown',
        action: 'AUTH_STATUS_UPDATED',
        oldStatus: user?.authStatus || 'unknown',
        newStatus: status,
        message: `用户认证状态更新为: ${status}`
      };
      
      // 控制台审计日志
      console.group(`[认证状态审计] ${timestamp}`);
      console.log('用户ID:', user?.id);
      console.log('旧认证状态:', user?.authStatus);
      console.log('新认证状态:', status);
      console.log('操作类型: 更新用户认证状态');
      console.groupEnd();
      
      // 更新用户状态
      setUser(prevUser => {
        if (!prevUser) return prevUser;
        
        const updatedUser = {
          ...prevUser,
          authStatus: status
        };
        
        // 保存更新后的用户状态到localStorage
        saveUserToLocalStorage(updatedUser);
        
        return updatedUser;
      });
      
      // 存储审计信息到localStorage用于追踪
      localStorage.setItem('lastAuthStatusUpdate', timestamp);
      localStorage.setItem('lastAuthStatus', status);
      localStorage.setItem('authStatusAudit', JSON.stringify(auditLog));
      
      console.log(`✅ [认证状态] ${timestamp} - 用户认证状态已更新为: ${status}`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? `更新认证状态失败：${err.message}` 
        : '更新认证状态失败，请重试';
      setError(errorMessage);
      console.error('[UserStateService] 更新认证状态失败:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // 简化的邮箱验证方法
  const verifyEmail = useCallback(async (_email: string, code: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // 模拟验证码验证过程
      console.log(`[UserStateService] 验证邮箱验证码: ${code}`);
      
      // 模拟验证成功
      if (code === '894575') {
        // 创建模拟用户数据
        const mockUser: User = {
          id: 'mock-user-id',
          email: _email,
          userType: USER_TYPES.INSTITUTION, // 测试账号设置为机构用户
          authStatus: AUTH_STATUS.AUTHENTICATED, // 登录成功后设置为已认证状态
          linkedAccounts: [
            {
              type: ACCOUNT_TYPES.EMAIL,
              email: _email
            }
          ]
        };
        setUser(mockUser);
        // 保存用户状态到localStorage
        saveUserToLocalStorage(mockUser);
        
        // 检测是否为机构用户，如果是则自动触发机构认证流程
        if (UserTypeUtils.isInstitutionUser(mockUser)) {
          triggerInstitutionalAuthFlow(mockUser);
        }
      } else {
        throw new Error('验证码不正确');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
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
  }, [triggerInstitutionalAuthFlow]);

  // 保存用户状态到localStorage的辅助函数
  const saveUserToLocalStorage = useCallback((userData: User | null) => {
    try {
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('user');
      }
    } catch (err) {
      console.error('[UserStateService] 保存用户状态到本地存储失败:', err);
    }
  }, []);

  // 简化的登出方法
  const logoutHandler = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // 清除用户状态
      setUser(null);
      // 清除本地存储的用户数据
      saveUserToLocalStorage(null);
      // 清除机构认证相关数据
      localStorage.removeItem('institutionalAuthTriggered');
      localStorage.removeItem('institutionalAuthUserId');
      localStorage.removeItem('institutionalAuthTimestamp');
      localStorage.removeItem('institutionalAuthAudit');
      
      setWalletState({
        wallets: [],
        activeWallet: null,
        hasEmbeddedWallet: false,
        isLoading: false,
        error: null
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登出失败，请重试';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [saveUserToLocalStorage]);

  // 计算用户类型相关状态
  const userType = user?.userType || null;
  const isInstitutionUser = UserTypeUtils.isInstitutionUser(user);
  const isIndividualUser = UserTypeUtils.isIndividualUser(user);

  // 计算认证状态 - 确保用户对象存在且认证状态为AUTHENTICATED
  const isAuthenticated = !!user && user.authStatus === AUTH_STATUS.AUTHENTICATED;

  const value: UserStateContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    userType,
    isInstitutionUser,
    isIndividualUser,
    walletState,
    loginWithEmail,
    verifyEmail,
    logout: logoutHandler,
    updateAuthStatus,
    setActiveWallet,
    refreshWallets,
    addExternalWallet,
  };

  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
};