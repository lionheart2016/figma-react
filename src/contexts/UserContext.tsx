import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { usePrivy, useLoginWithEmail } from '@privy-io/react-auth';

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
  
  // 使用Privy SDK的邮箱登录功能
  const {
    sendCode: sendEmailCode,
    loginWithCode: loginWithEmailCode,
  } = useLoginWithEmail({
    onComplete: ({user: privyUser}) => {
      console.log('用户成功登录:', privyUser);
      setError(null);
      // 登录成功后，应用会通过React Router的保护路由自动处理导航
    },
    onError: (error) => {
        console.error('登录失败:', error);
        // 优化错误信息显示
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

  // 监听privy用户状态变化，同步到应用状态
  useEffect(() => {
    if (ready !== undefined) {
      // 安全地获取privy中的属性
      const privyUser = privy.user;
      const isAuthenticated = privy.authenticated;
      
      // 如果用户已认证，更新用户状态
      if (isAuthenticated && privyUser) {
        // 将privy用户数据转换为应用的User类型
        try {
          const appUser: User = {
            id: String(privyUser.id || ''),
            email: privyUser.email ? String(privyUser.email) : '',
            walletAddress: privyUser.wallet?.address ? String(privyUser.wallet.address) : undefined,
          };
          setUser(appUser);
          console.log('用户状态已更新:', appUser);
        } catch (typeError) {
          console.error('转换用户数据类型时出错:', typeError);
          setUser(null);
        }
      } else {
        // 用户未认证或登出，清空用户状态
        setUser(null);
      }
      
      setIsLoading(!ready);
    }
  }, [ready, privy.user, privy.authenticated]);

  const loginWithEmail = async (email: string) => {
    setError(null);
    setIsLoading(true);
    try {
      // 使用Privy SDK发送邮箱验证码
      await sendEmailCode({ email });
      console.log('验证码已发送到邮箱:', email);
    } catch (err) {
      console.error('发送验证码失败:', err);
      const errorMessage = err instanceof Error ? `发送验证码失败：${err.message}` : '发送验证码失败，请重试';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (_email: string, code: string) => {
    setError(null);
    setIsLoading(true);
    try {
      // 使用Privy SDK验证邮箱验证码
      await loginWithEmailCode({ code });
      console.log('邮箱验证成功');
    } catch (err) {
      console.error('验证失败:', err);
      // 优化错误信息显示
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