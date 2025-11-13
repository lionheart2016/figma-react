// 用户相关类型定义
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'user' | 'institutional';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstitutionalUser extends User {
  role: 'institutional';
  organizationName?: string;
  walletLimit?: number;
  tradingLimit?: number;
}

export interface UserPreferences {
  language: 'en' | 'zh-Hans' | 'zh-Hant';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    trading: boolean;
    wallet: boolean;
  };
}

// 钱包相关类型
export interface Wallet {
  id: string;
  userId: string;
  name: string;
  address: string;
  balance: Record<string, number>;
  isSmartWallet: boolean;
  signers?: Signer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Signer {
  address: string;
  name: string;
  threshold: number;
  permissions: string[];
}

// 交易相关类型
export interface Trade {
  id: string;
  userId: string;
  walletId: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: Date;
}

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: number;
  symbol: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  timestamp: Date;
}

// API响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 认证相关类型
export interface LoginCredentials {
  email: string;
  verificationCode: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface EmailVerificationRequest {
  email: string;
  code: string;
}