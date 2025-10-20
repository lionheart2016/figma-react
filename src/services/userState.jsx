import { createContext, useContext, useState, useEffect } from 'react';

// 创建全局用户状态上下文
const UserStateContext = createContext();

// 用户状态服务类
export class UserStateService {
  constructor() {
    this.listeners = new Set();
    this.state = {
      isLoggedIn: false,
      user: null,
      wallet: null,
      lastLoginTime: null,
      sessionExpiry: null,
      isLoading: false,
      investmentTipClosed: false // 新增：投资配置提示关闭状态
    };
    
    // 从本地存储恢复状态
    this.restoreFromStorage();
  }

  // 从本地存储恢复状态
  restoreFromStorage() {
    try {
      const savedState = localStorage.getItem('userState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // 检查会话是否过期
        if (parsedState.sessionExpiry && Date.now() < parsedState.sessionExpiry) {
          this.state = { ...this.state, ...parsedState };
        } else {
          // 会话过期，清除状态
          this.clearState();
        }
      }
    } catch (error) {
      console.error('Failed to restore user state from storage:', error);
      this.clearState();
    }
  }

  // 保存状态到本地存储
  saveToStorage() {
    try {
      localStorage.setItem('userState', JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save user state to storage:', error);
    }
  }

  // 清除状态
  clearState() {
    this.state = {
      isLoggedIn: false,
      user: null,
      wallet: null,
      lastLoginTime: null,
      sessionExpiry: null,
      isLoading: false,
      investmentTipClosed: false
    };
    localStorage.removeItem('userState');
  }

  // 设置登录状态
  setLoginState(userData, walletData = null) {
    const sessionDuration = 24 * 60 * 60 * 1000; // 24小时会话
    
    this.state = {
      isLoggedIn: true,
      user: userData,
      wallet: walletData,
      lastLoginTime: Date.now(),
      sessionExpiry: Date.now() + sessionDuration,
      isLoading: false
    };

    this.saveToStorage();
    this.notifyListeners();
  }

  // 设置登出状态
  setLogoutState() {
    this.clearState();
    this.notifyListeners();
  }

  // 设置加载状态
  setLoadingState(isLoading) {
    this.state.isLoading = isLoading;
    this.notifyListeners();
  }

  // 更新用户信息
  updateUserInfo(userData) {
    if (this.state.isLoggedIn) {
      this.state.user = { ...this.state.user, ...userData };
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // 更新钱包信息
  updateWalletInfo(walletData) {
    if (this.state.isLoggedIn) {
      this.state.wallet = walletData;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // 设置投资配置提示关闭状态
  setInvestmentTipClosed(isClosed) {
    this.state.investmentTipClosed = isClosed;
    this.saveToStorage();
    this.notifyListeners();
  }

  // 检查会话是否有效
  isSessionValid() {
    return this.state.isLoggedIn && 
           this.state.sessionExpiry && 
           Date.now() < this.state.sessionExpiry;
  }

  // 获取当前状态
  getState() {
    return { ...this.state };
  }

  // 订阅状态变化
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // 通知所有监听器
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}

// 创建全局实例
const userStateService = new UserStateService();

// React Hook 用于访问用户状态
export const useUserState = () => {
  const [state, setState] = useState(userStateService.getState());

  useEffect(() => {
    const unsubscribe = userStateService.subscribe(newState => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  return {
    ...state,
    setLoginState: (userData, walletData) => userStateService.setLoginState(userData, walletData),
    setLogoutState: () => userStateService.setLogoutState(),
    setLoadingState: (isLoading) => userStateService.setLoadingState(isLoading),
    updateUserInfo: (userData) => userStateService.updateUserInfo(userData),
    updateWalletInfo: (walletData) => userStateService.updateWalletInfo(walletData),
    setInvestmentTipClosed: (isClosed) => userStateService.setInvestmentTipClosed(isClosed),
    isSessionValid: () => userStateService.isSessionValid()
  };
};

// 提供者组件
export const UserStateProvider = ({ children }) => {
  const [state, setState] = useState(userStateService.getState());

  useEffect(() => {
    const unsubscribe = userStateService.subscribe(newState => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  const value = {
    ...state,
    setLoginState: (userData, walletData) => userStateService.setLoginState(userData, walletData),
    setLogoutState: () => userStateService.setLogoutState(),
    setLoadingState: (isLoading) => userStateService.setLoadingState(isLoading),
    updateUserInfo: (userData) => userStateService.updateUserInfo(userData),
    updateWalletInfo: (walletData) => userStateService.updateWalletInfo(walletData),
    setInvestmentTipClosed: (isClosed) => userStateService.setInvestmentTipClosed(isClosed),
    isSessionValid: () => userStateService.isSessionValid()
  };

  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
};

// 直接访问用户状态的Hook
export const useUserStateContext = () => {
  const context = useContext(UserStateContext);
  if (!context) {
    throw new Error('useUserStateContext must be used within a UserStateProvider');
  }
  return context;
};

export default userStateService;