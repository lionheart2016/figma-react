// 全局模块声明文件

declare module '*.tsx';
declare module '*.jsx';
declare module '*.js';
declare module '*.ts';

// MetaMask Ethereum提供者类型声明
interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    isMetaMask?: boolean;
    chainId?: string;
    selectedAddress?: string;
  };
}

// 声明CSS模块
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// 声明上下文模块
declare module './contexts/AuthContext' {
  const RootAuthProvider: React.FC<{ children: React.ReactNode }>;
  export default RootAuthProvider;
}

declare module './contexts/LanguageContext' {
  const LanguageProvider: React.FC<{ children: React.ReactNode }>;
  export { LanguageProvider };
}

declare module './components/AppRouter' {
  const AppRouter: React.FC;
  export default AppRouter;
}

// 用户认证相关类型声明