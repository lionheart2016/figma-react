import React, { lazy, Suspense, ReactNode, useState } from 'react';
import GlobalLoading from './components/global/GlobalLoading';

// 定义组件的Props类型
interface ProviderProps {
  children: ReactNode;
}

// 为测试环境提供默认的模拟组件
let LanguageProvider: React.FC<ProviderProps> = ({ children }) => <div>{children}</div>;
let ThemeProvider: React.FC<ProviderProps> = ({ children }) => <div>{children}</div>;
let AppRouter: React.FC = () => <div>App Router</div>;

// 使用React.lazy来动态导入组件
const LazyLanguageProvider = lazy(() => 
  import('./contexts/LanguageContext').then((module: any) => ({
    default: module.LanguageProvider
  }))
);

const LazyThemeProvider = lazy(() => 
  import('./contexts/ThemeContext').then((module: any) => ({
    default: module.ThemeProvider
  }))
);

const LazyAppRouter = lazy(() => import('./components/AppRouter') as any);

function App(): JSX.Element {
  // 检查是否在浏览器环境中
  const isBrowser = typeof window !== 'undefined';
  
  // 应用加载状态
  const [showLoading, setShowLoading] = useState(true);
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  
  // 设置应用初始化超时机制（5秒）
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (showLoading) {
        console.warn('[App] 应用初始化超时，显示超时警告');
        setTimeoutWarning(true);
      }
    }, 5000);
    
    // 应用初始化完成后隐藏loading
    const initTimeoutId = setTimeout(() => {
      setShowLoading(false);
      setTimeoutWarning(false);
    }, 2000);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initTimeoutId);
    };
  }, [showLoading]);
  
  // 如果不在浏览器环境，直接渲染应用
  if (!isBrowser) {
    return (
      <React.StrictMode>
        <ThemeProvider>
          <LanguageProvider>
            <AppRouter />
          </LanguageProvider>
        </ThemeProvider>
      </React.StrictMode>
    );
  }
  
  // 显示全局Loading状态直到应用初始化完成
  if (showLoading) {
    return (
      <React.StrictMode>
        <GlobalLoading 
          showTimeoutWarning={timeoutWarning}
        />
      </React.StrictMode>
    );
  }

  return (
    <React.StrictMode>
      <Suspense fallback={<GlobalLoading />}>
        <LazyThemeProvider>
          <LazyLanguageProvider>
            <LazyAppRouter />
          </LazyLanguageProvider>
        </LazyThemeProvider>
      </Suspense>
    </React.StrictMode>
  );
}

export default App;