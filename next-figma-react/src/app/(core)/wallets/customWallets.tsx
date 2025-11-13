import React from 'react';
import WalletOperations from './WalletOperations';
import WalletList from './WalletList';
import { Wallet } from '@/services/UserStateService';

interface CustomWalletsProps {
  wallets: Wallet[];
  activeWallet: Wallet | null;
  isConnectingExternal: boolean;
  onConnectExternalWallet: () => Promise<void>;
  onActivateWallet: (wallet: Wallet) => void;
  onCopyAddress: (address: string) => void;
}

/**
 * 钱包列表和操作组件
 * 显示钱包操作区域和钱包列表
 */
const CustomWallets: React.FC<CustomWalletsProps> = ({
  wallets,
  activeWallet,
  isConnectingExternal,
  onConnectExternalWallet,
  onActivateWallet,
  onCopyAddress
}) => {
  return (
    <>
      {/* 钱包操作区域 */}
      <WalletOperations
        onConnectExternalWallet={onConnectExternalWallet}
        isConnectingExternal={isConnectingExternal}
      />
      
      {/* 钱包列表区域 */}
      <WalletList
        wallets={wallets}
        activeWallet={activeWallet}
        onActivateWallet={onActivateWallet}
        onCopyAddress={onCopyAddress}
      />
    </>
  );
};

export default CustomWallets;