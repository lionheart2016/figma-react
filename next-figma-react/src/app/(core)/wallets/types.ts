/**
 * 钱包类型定义
 */
export interface Wallet {
  address: string;
  chain: string;
  type: 'embedded' | 'external';
  walletType: string;
  name: string;
  balance?: string;
}

/**
 * 钱包组件通用属性
 */
export interface WalletComponentProps {
  isLoading?: boolean;
  error?: string | null;
}

/**
 * 钱包操作相关回调函数类型
 */
export interface WalletActions {
  onConnectWallet: (walletType?: string) => void;
  onCreateWallet: () => void;
  onActivateWallet: (wallet: Wallet) => void;
  onCopyAddress: (address: string) => void;
}