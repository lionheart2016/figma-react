// Privy配置模块的TypeScript类型声明

declare module '../config/privy' {
  interface PrivyConfig {
    appId: string;
    appearance?: object;
    embeddedWallets: 'on' | 'off' | object;
    loginMethods: object[];
    mfa?: object;
  }

  export const privyConfig: PrivyConfig;
}