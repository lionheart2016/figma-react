// 全局模块声明文件

declare module '*.tsx';
declare module '*.jsx';
declare module '*.js';
declare module '*.ts';

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

declare module './config/privy';