import { afterEach, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// 每个测试后清理DOM
afterEach(() => {
  cleanup();
});

// 全局模拟JSON导入
beforeEach(() => {
  // 模拟所有JSON文件导入
  vi.doMock('@/locales/en.json', () => ({
    default: {
      common: {
        welcome: 'Welcome',
        login: 'Login',
        logout: 'Logout'
      }
    }
  }));
  
  vi.doMock('@/locales/zh-CN.json', () => ({
    default: {
      common: {
        welcome: '欢迎',
        login: '登录',
        logout: '退出'
      }
    }
  }));
  
  vi.doMock('@/locales/zh-TW.json', () => ({
    default: {
      common: {
        welcome: '歡迎',
        login: '登錄',
        logout: '退出'
      }
    }
  }));
});

// 模拟全局环境变量
process.env = {
  ...process.env,
  NODE_ENV: 'test'
};

// 模拟window对象
window.__ENV__ = {};



vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en'
    }
  }),
  Trans: ({ children }) => children
}));