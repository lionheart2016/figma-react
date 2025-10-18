// Privy Configuration
export const privyConfig = {
  appId: 'cm2v3q9g2000qk90f7f8q9q9q', // 这是一个示例appId，实际使用时需要替换为真实的appId
  appearance: {
    theme: 'light',
    accentColor: '#1F32D6',
    logo: '/alpha-privy-logo.svg'
  },
  embeddedWallets: {
    createOnLogin: 'users-without-wallets'
  },
  loginMethods: [
    'email',
    'wallet',
    'google',
    'apple'
  ],
  mfa: {
    deviceShareFactor: {
      requireOnLogin: false
    }
  }
};

// 测试配置
export const testConfig = {
  testEmail: 'test-1143@privy.io',
  testVerificationCode: '894575'
};