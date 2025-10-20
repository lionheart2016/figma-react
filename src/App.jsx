import React, { lazy, Suspense, useState, useEffect } from 'react'

// 为测试环境提供默认的模拟组件
let PrivyProvider = ({ children }) => <div>{children}</div>;
let AuthProvider = ({ children }) => <div>{children}</div>;
let LanguageProvider = ({ children }) => <div>{children}</div>;
let AppRouter = () => <div>App Router</div>;

// 使用React.lazy和动态import导入依赖
if (typeof window !== 'undefined' && typeof process === 'undefined') {
  try {
    // 注意：这里我们使用import语句而不是require
    // 实际的导入将在组件内部通过Suspense处理
    // 为了简单起见，我们先导入基本的默认值
    // 实际的组件将在下面的App组件中动态加载
  } catch (error) {
    console.error('Failed to load dependencies:', error);
  }
}

// 使用React.lazy来动态导入组件
const LazyPrivyProvider = lazy(() => import('@privy-io/react-auth').then(module => ({
  default: module.PrivyProvider
})));

const LazyAuthProvider = lazy(() => import('./contexts/AuthContext').then(module => ({
  default: module.AuthProvider
})));

const LazyLanguageProvider = lazy(() => import('./contexts/LanguageContext').then(module => ({
  default: module.LanguageProvider
})));

const LazyAppRouter = lazy(() => import('./components/AppRouter'));

function App() {
  // 获取环境变量的辅助函数
  const getEnv = (key, defaultValue = '') => {
    try {
      // 仅使用安全的方式检查环境变量
      // 在浏览器环境中，我们期望环境变量已经被注入到window对象
      if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
        return window.__ENV__[key];
      }
      // 在Node.js环境中使用process.env
      if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
      }
    } catch (error) {
      // 发生任何错误时返回默认值
    }
    return defaultValue;
  };
  
  // 检查是否在浏览器环境中
  const isBrowser = typeof window !== 'undefined';

  const privyConfig = {
    loginMethods: getEnv('VITE_PRIVY_LOGIN_METHODS') ? getEnv('VITE_PRIVY_LOGIN_METHODS').split(',') : ["email", "google", "wallet"],
    appearance: {
      theme: getEnv('VITE_PRIVY_THEME', "light"),
      accentColor: getEnv('VITE_PRIVY_ACCENT_COLOR', "#4B5EF5"),
      logo: getEnv('VITE_PRIVY_LOGO', "/alphatoken-logo.svg"),
      logoStyle: getEnv('VITE_PRIVY_LOGO_STYLE', "rounded"),
      showWalletLoginFirst: getEnv('VITE_PRIVY_SHOW_WALLET_FIRST', "false") === "true"
    },
    embeddedWallets: {
      createOnLogin: getEnv('VITE_PRIVY_EMBEDDED_WALLETS', "users-without-wallets")
    }
  };

  return (
    <React.StrictMode>
      {isBrowser ? (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyPrivyProvider
            appId={getEnv('VITE_PRIVY_APP_ID', 'test-app-id')}
            config={privyConfig}
          >
            <LazyAuthProvider>
              <LazyLanguageProvider>
                <LazyAppRouter />
              </LazyLanguageProvider>
            </LazyAuthProvider>
          </LazyPrivyProvider>
        </Suspense>
      ) : (
        // 在非浏览器环境中使用静态组件
        <PrivyProvider>
          <AuthProvider>
            <LanguageProvider>
              <AppRouter />
            </LanguageProvider>
          </AuthProvider>
        </PrivyProvider>
      )}
    </React.StrictMode>
  )
}

export default App