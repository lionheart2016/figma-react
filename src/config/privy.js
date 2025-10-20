// Privy Configuration
export const privyConfig = {
  appId: 'cmgkk8drf001lk00cob8vgj4e', // 使用环境变量中的正确appId
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