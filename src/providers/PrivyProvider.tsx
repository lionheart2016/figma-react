import React from 'react';
import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { baseSepolia } from 'viem/chains';

interface PrivyProviderProps {
  children: React.ReactNode;
}

export const PrivyProvider: React.FC<PrivyProviderProps> = ({ children }) => {
  // 使用类型断言确保appId是字符串类型
  const appId = (import.meta.env.VITE_PRIVY_APP_ID || '') as string;
  
  if (!appId || appId === 'your_privy_app_id_here') {
    console.error('Privy App ID is not properly configured. Please set VITE_PRIVY_APP_ID in your environment variables.');
  }

  return (
    <BasePrivyProvider
      appId={appId}
      config={{
        appearance: { theme: 'light', walletChainType: 'ethereum-and-solana' },
        defaultChain: baseSepolia,
        mfa: {
          noPromptOnMfaRequired: true,
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  );
};