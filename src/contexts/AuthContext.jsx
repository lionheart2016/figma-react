import React, { createContext, useContext, useEffect, useState } from 'react';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';
import { privyConfig } from '../config/privy';
import userStateService from '../services/userState.jsx';

// 创建认证上下文
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    wallet: null,
    isLoading: true
  });

  useEffect(() => {
    if (ready) {
      // 同步认证状态到userState服务
      if (authenticated && user) {
        // 用户已登录，更新userState服务
        userStateService.setLoginState(user, wallets[0] || null);
        console.log('用户已通过Privy认证，userState服务已更新');
      } else if (!authenticated) {
        // 用户未登录，清除userState服务
        userStateService.setLogoutState();
        console.log('用户未认证，userState服务已清除');
      }
      
      setAuthState({
        isAuthenticated: authenticated,
        user: user,
        wallet: wallets[0] || null,
        isLoading: false
      });
    }
  }, [ready, authenticated, user, wallets]);

  // 登录函数
  const handleLogin = async (method = 'email') => {
    try {
      userStateService.setLoadingState(true);
      await login({
        method: method
      });
      // 登录成功后，userState服务会在useEffect中自动更新
    } catch (error) {
      console.error('Login failed:', error);
      userStateService.setLoadingState(false);
      throw error;
    }
  };

  // 登出函数
  const handleLogout = async () => {
    try {
      await logout();
      // 登出后，userState服务会在useEffect中自动清除
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  // 获取访问令牌
  const getAuthToken = async () => {
    try {
      return await getAccessToken();
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  };

  // 连接钱包
  const connectWallet = async () => {
    try {
      if (wallets.length > 0) {
        const wallet = wallets[0];
        await wallet.connect();
        return wallet;
      }
      return null;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  };

  const value = {
    ...authState,
    login: handleLogin,
    logout: handleLogout,
    getAuthToken,
    connectWallet,
    wallets
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 根级Privy提供者
export const RootAuthProvider = ({ children }) => {
  return (
    <PrivyProvider
      appId={privyConfig.appId}
      config={{
        appearance: privyConfig.appearance,
        embeddedWallets: privyConfig.embeddedWallets,
        loginMethods: privyConfig.loginMethods,
        mfa: privyConfig.mfa
      }}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </PrivyProvider>
  );
};