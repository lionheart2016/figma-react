import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 定义主题类型
export type ThemeType = 'light' | 'dark';

// 定义主题上下文接口
export interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者组件接口
interface ThemeProviderProps {
  children: ReactNode;
}

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 从localStorage获取保存的主题，如果没有则默认为light
  const getInitialTheme = (): ThemeType => {
    try {
      const savedTheme = localStorage.getItem('alphatoken-theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
    } catch (error) {
      console.warn('Failed to get theme from localStorage:', error);
    }
    // 默认使用light主题
    return 'light';
  };

  const [theme, setTheme] = useState<ThemeType>(getInitialTheme);

  // 当主题改变时，更新localStorage和document的class
  useEffect(() => {
    try {
      localStorage.setItem('alphatoken-theme', theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
    
    // 更新document的class，用于CSS主题切换
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  // 切换主题函数
  const toggleTheme = (): void => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // 构建上下文值
  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isDarkMode: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义hook，用于在组件中访问主题上下文
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;