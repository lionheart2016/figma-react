// Privy Configuration
export const privyConfig = {
  appId: import.meta.env.VITE_PRIVY_APP_ID, // 从环境变量中读取appId
  appearance: {
    theme: 'light',
    accentColor: '#1F32D6',
    logo: '/alpha-privy-logo.svg'
  },
  embeddedWallets: {
    createOnLogin: 'off' // 暂时禁用嵌入式钱包以解决跨域问题
  },
  loginMethods: [
    'email',
    'google'
    // 暂时禁用钱包登录以解决跨域问题
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