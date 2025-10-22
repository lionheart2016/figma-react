import React, { lazy, Suspense, ReactNode } from 'react';

// 定义组件的Props类型
interface ProviderProps {
  children: ReactNode;
}

// 为测试环境提供默认的模拟组件
let LanguageProvider: React.FC<ProviderProps> = ({ children }) => <div>{children}</div>;
let ThemeProvider: React.FC<ProviderProps> = ({ children }) => <div>{children}</div>;
let AppRouter: React.FC = () => <div>App Router</div>;

// 使用React.lazy来动态导入组件
const LazyLanguageProvider = lazy<React.FC<ProviderProps>>(() => 
  import('./contexts/LanguageContext').then((module: any) => ({
    default: module.LanguageProvider
  }))
);

const LazyThemeProvider = lazy<React.FC<ProviderProps>>(() => 
  import('./contexts/ThemeContext').then((module: any) => ({
    default: module.ThemeProvider
  }))
);

const LazyAppRouter = lazy<React.FC>(() => import('./components/AppRouter') as any);

function App(): JSX.Element {
  // 检查是否在浏览器环境中
  const isBrowser = typeof window !== 'undefined';

  return (
    <React.StrictMode>
      {isBrowser ? (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyThemeProvider>
            <LazyLanguageProvider>
              <LazyAppRouter />
            </LazyLanguageProvider>
          </LazyThemeProvider>
        </Suspense>
      ) : (
        // 在非浏览器环境中使用静态组件
        <ThemeProvider>
          <LanguageProvider>
            <AppRouter />
          </LanguageProvider>
        </ThemeProvider>
      )}
    </React.StrictMode>
  );
}

export default App;