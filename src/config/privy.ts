// Privy Configuration
interface PrivyAppearance {
  theme: 'light' | 'dark';
  accentColor: string;
  logo: string;
}

interface PrivyEmbeddedWallets {
  createOnLogin: 'on' | 'off';
}

interface PrivyMFA {
  deviceShareFactor: {
    requireOnLogin: boolean;
  };
}

interface PrivyConfig {
  appId: string | undefined;
  appearance: PrivyAppearance;
  embeddedWallets: PrivyEmbeddedWallets;
  loginMethods: string[];
  mfa: PrivyMFA;
}

interface TestConfig {
  testEmail: string;
  testVerificationCode: string;
}

export const privyConfig: PrivyConfig = {
  appId: import.meta.env.VITE_PRIVY_APP_ID || 'demo-app-id', // 使用Vite环境变量
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
export const testConfig: TestConfig = {
  testEmail: 'test-1143@privy.io',
  testVerificationCode: '894575'
};