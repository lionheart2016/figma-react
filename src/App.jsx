import React, { lazy, Suspense } from 'react'
import { privyConfig } from './config/privy';

// 为测试环境提供默认的模拟组件
let LanguageProvider = ({ children }) => <div>{children}</div>;
let AppRouter = () => <div>App Router</div>;
let RootAuthProvider = ({ children }) => <div>{children}</div>;

// 使用React.lazy来动态导入组件
const LazyRootAuthProvider = lazy(() => import('./contexts/AuthContext').then(module => ({
  default: module.RootAuthProvider
})));

const LazyLanguageProvider = lazy(() => import('./contexts/LanguageContext').then(module => ({
  default: module.LanguageProvider
})));

const LazyAppRouter = lazy(() => import('./components/AppRouter'));

function App() {
  // 检查是否在浏览器环境中
  const isBrowser = typeof window !== 'undefined';

  return (
    <React.StrictMode>
      {isBrowser ? (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyRootAuthProvider>
            <LazyLanguageProvider>
              <LazyAppRouter />
            </LazyLanguageProvider>
          </LazyRootAuthProvider>
        </Suspense>
      ) : (
        // 在非浏览器环境中使用静态组件
        <RootAuthProvider>
          <LanguageProvider>
            <AppRouter />
          </LanguageProvider>
        </RootAuthProvider>
      )}
    </React.StrictMode>
  )
}

export default App