import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import userStateService, { UserStateService, useUserState, UserStateProvider } from '../userState.jsx';
import { renderHook, act } from '@testing-library/react';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

global.localStorage = mockLocalStorage;

describe('UserStateService', () => {
  let service;
  
  beforeEach(() => {
    // 清除localStorage
    localStorage.clear();
    // 重置所有mock
    vi.clearAllMocks();
    // 创建新实例
    service = new UserStateService();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const state = service.getState();
      expect(state.isLoggedIn).toBe(false);
      expect(state.user).toBeNull();
      expect(state.wallet).toBeNull();
      expect(state.lastLoginTime).toBeNull();
      expect(state.sessionExpiry).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.investmentTipClosed).toBe(false);
    });
  });

  describe('restoreFromStorage', () => {
    it('should restore state from localStorage when session is valid', () => {
      const mockState = {
        isLoggedIn: true,
        user: { id: '1', name: 'Test User' },
        wallet: { address: '0x123' },
        lastLoginTime: Date.now() - 1000,
        sessionExpiry: Date.now() + 100000,
        isLoading: false,
        investmentTipClosed: true
      };
      localStorage.setItem('userState', JSON.stringify(mockState));
      
      const newService = new UserStateService();
      const state = newService.getState();
      
      expect(state.isLoggedIn).toBe(true);
      expect(state.user).toEqual(mockState.user);
      expect(state.wallet).toEqual(mockState.wallet);
      expect(state.investmentTipClosed).toBe(true);
    });

    it('should clear state when session is expired', () => {
      const mockState = {
        isLoggedIn: true,
        user: { id: '1' },
        sessionExpiry: Date.now() - 1000 // 已过期
      };
      localStorage.setItem('userState', JSON.stringify(mockState));
      
      const newService = new UserStateService();
      const state = newService.getState();
      
      expect(state.isLoggedIn).toBe(false);
      expect(state.user).toBeNull();
    });

    it('should handle localStorage parse errors gracefully', () => {
      localStorage.getItem.mockReturnValueOnce('invalid json');
      console.error = vi.fn();
      
      const newService = new UserStateService();
      const state = newService.getState();
      
      expect(console.error).toHaveBeenCalled();
      expect(state.isLoggedIn).toBe(false);
    });
  });

  describe('setLoginState', () => {
    it('should set login state with user and wallet data', () => {
      const userData = { id: '1', name: 'Test User' };
      const walletData = { address: '0x123' };
      
      act(() => {
        service.setLoginState(userData, walletData);
      });
      
      const state = service.getState();
      expect(state.isLoggedIn).toBe(true);
      expect(state.user).toEqual(userData);
      expect(state.wallet).toEqual(walletData);
      expect(state.lastLoginTime).toBeDefined();
      expect(state.sessionExpiry).toBeDefined();
      expect(localStorage.setItem).toHaveBeenCalledWith('userState', expect.any(String));
    });

    it('should set login state with only user data', () => {
      const userData = { id: '1', name: 'Test User' };
      
      act(() => {
        service.setLoginState(userData);
      });
      
      const state = service.getState();
      expect(state.isLoggedIn).toBe(true);
      expect(state.user).toEqual(userData);
      expect(state.wallet).toBeNull();
    });
  });

  describe('setLogoutState', () => {
    it('should clear all user state and notify listeners', () => {
      // 先设置登录状态
      act(() => {
        service.setLoginState({ id: '1' });
      });
      
      // 然后登出
      act(() => {
        service.setLogoutState();
      });
      
      const state = service.getState();
      expect(state.isLoggedIn).toBe(false);
      expect(state.user).toBeNull();
      expect(state.wallet).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('userState');
    });
  });

  describe('updateUserInfo', () => {
    it('should update user info when logged in', () => {
      // 先设置登录状态
      act(() => {
        service.setLoginState({ id: '1', name: 'Old Name' });
      });
      
      // 更新用户信息
      act(() => {
        service.updateUserInfo({ name: 'New Name', email: 'test@example.com' });
      });
      
      const state = service.getState();
      expect(state.user.name).toBe('New Name');
      expect(state.user.email).toBe('test@example.com');
      expect(state.user.id).toBe('1'); // 保持不变的字段
    });

    it('should not update user info when not logged in', () => {
      act(() => {
        service.updateUserInfo({ name: 'Test' });
      });
      
      const state = service.getState();
      expect(state.user).toBeNull();
    });
  });

  describe('updateWalletInfo', () => {
    it('should update wallet info when logged in', () => {
      // 先设置登录状态
      act(() => {
        service.setLoginState({ id: '1' }, { address: '0x123' });
      });
      
      // 更新钱包信息
      const newWalletData = { address: '0x456', balance: '100' };
      act(() => {
        service.updateWalletInfo(newWalletData);
      });
      
      const state = service.getState();
      expect(state.wallet).toEqual(newWalletData);
    });

    it('should not update wallet info when not logged in', () => {
      act(() => {
        service.updateWalletInfo({ address: '0x456' });
      });
      
      const state = service.getState();
      expect(state.wallet).toBeNull();
    });
  });

  describe('setInvestmentTipClosed', () => {
    it('should update investment tip closed state', () => {
      act(() => {
        service.setInvestmentTipClosed(true);
      });
      
      const state = service.getState();
      expect(state.investmentTipClosed).toBe(true);
      
      act(() => {
        service.setInvestmentTipClosed(false);
      });
      
      expect(service.getState().investmentTipClosed).toBe(false);
    });
  });

  describe('isSessionValid', () => {
    it('should return true when session is valid', () => {
      act(() => {
        service.setLoginState({ id: '1' });
      });
      
      expect(service.isSessionValid()).toBe(true);
    });

    it('should return false when session is expired', () => {
      // Mock Date.now to simulate expired session
      const now = Date.now();
      vi.useFakeTimers();
      vi.setSystemTime(now);
      
      act(() => {
        service.setLoginState({ id: '1' });
      });
      
      // 快进到会话过期
      vi.setSystemTime(now + 25 * 60 * 60 * 1000); // 25小时后
      
      expect(service.isSessionValid()).toBe(false);
    });

    it('should return false when not logged in', () => {
      expect(service.isSessionValid()).toBe(false);
    });
  });

  describe('event subscription', () => {
    it('should notify subscribers when state changes', () => {
      const listener = vi.fn();
      const unsubscribe = service.subscribe(listener);
      
      act(() => {
        service.setLoginState({ id: '1' });
      });
      
      expect(listener).toHaveBeenCalled();
      unsubscribe();
    });

    it('should remove subscribers properly', () => {
      const listener = vi.fn();
      const unsubscribe = service.subscribe(listener);
      unsubscribe();
      
      act(() => {
        service.setLoginState({ id: '1' });
      });
      
      expect(listener).not.toHaveBeenCalled();
    });
  });
});

// 测试React Hooks
describe('React Hooks', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('useUserState', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useUserState());
      
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('should update state when user logs in', () => {
      const { result } = renderHook(() => useUserState());
      
      act(() => {
        result.current.setLoginState({ id: '1', name: 'Test' });
      });
      
      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.user.name).toBe('Test');
    });

    it('should update state when user logs out', () => {
      // 先登录
      const { result } = renderHook(() => useUserState());
      
      act(() => {
        result.current.setLoginState({ id: '1' });
      });
      
      expect(result.current.isLoggedIn).toBe(true);
      
      // 再登出
      act(() => {
        result.current.setLogoutState();
      });
      
      expect(result.current.isLoggedIn).toBe(false);
    });
  });

  describe('global service instance', () => {
    it('should be a singleton instance', () => {
      expect(userStateService).toBeInstanceOf(UserStateService);
    });
  });
});