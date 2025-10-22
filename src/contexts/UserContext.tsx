import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export interface User {
  id: string;
  email: string;
  walletAddress?: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithEmail: (email: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // 在顶层调用usePrivy，获取所有需要的属性
  const privy = usePrivy();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // 安全地获取privy中的属性
  const privyUser = privy?.user;
  const authenticated = privy?.authenticated;
  const logout = privy?.logout;
  const ready = privy?.ready;

  // 使用useEffect来更新用户状态
  useEffect(() => {
    if (privyUser) {
      // 处理email类型问题，确保转换为字符串
      const emailString = typeof privyUser.email === 'string' 
        ? privyUser.email 
        : String(privyUser.email || '');
        
      setUser({
        id: privyUser.id,
        email: emailString,
        walletAddress: privyUser.wallet?.address,
      });
    } else {
      setUser(null);
    }
  }, [privyUser]);

  // 当ready状态变化时更新加载状态
  useEffect(() => {
    if (ready !== undefined) {
      setIsLoading(!ready);
    }
  }, [ready]);

  const loginWithEmail = async (_email: string) => {
    setError(null);
    try {
      // 由于privy的loginWithEmailLink方法可能不存在，这里使用模拟实现
      // 在实际集成中应该使用privy SDK提供的正确登录方法
      throw new Error('Email login not implemented yet');
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送验证码失败，请重试');
      throw err;
    }
  };

  const verifyEmail = async (_email: string, _code: string) => {
    setError(null);
    try {
      // 由于privy的verifyEmailCode可能不存在，这里使用模拟实现
      // 在实际集成中应该使用privy SDK提供的正确方法
      throw new Error('Email verification not implemented yet');
    } catch (err) {
      setError(err instanceof Error ? err.message : '验证失败，请检查验证码是否正确');
      throw err;
    }
  };

  const logoutHandler = async () => {
    setIsLoading(true);
    try {
      await logout?.();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登出失败，请重试');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: UserContextType = {
    user,
    isAuthenticated: !!authenticated,
    isLoading,
    error,
    loginWithEmail,
    verifyEmail,
    logout: logoutHandler,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};