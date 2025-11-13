"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type ShowButtonContextType = {
  showButton: boolean;
  setShowButton: (show: boolean) => void;
  resetShowButton: () => void;
};

const ShowButtonContext = createContext<ShowButtonContextType | undefined>(undefined);

// 定义需要显示返回按钮的页面路径
const PAGES_WITH_BACK_BUTTON = [
  '/email-verification',
  '/authentication',
  '/institutional-auth'
];

// 定义需要隐藏返回按钮的页面路径
const PAGES_WITHOUT_BACK_BUTTON = [
  '/register'
];

export function ShowButtonProvider({ children }: { children: ReactNode }) {
  const [showButton, setShowButton] = useState(true);
  const pathname = usePathname();

  // 根据当前路由自动设置按钮显示状态
  useEffect(() => {
    // 如果当前页面在需要显示返回按钮的列表中，强制显示
    if (PAGES_WITH_BACK_BUTTON.some(path => pathname.includes(path))) {
      setShowButton(true);
    }
    // 如果当前页面在需要隐藏返回按钮的列表中，强制隐藏
    else if (PAGES_WITHOUT_BACK_BUTTON.some(path => pathname.includes(path))) {
      setShowButton(false);
    }
    // 其他页面保持当前状态
  }, [pathname]);

  const resetShowButton = () => {
    // 根据当前路由重置按钮状态
    if (PAGES_WITH_BACK_BUTTON.some(path => pathname.includes(path))) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  return (
    <ShowButtonContext.Provider value={{ showButton, setShowButton, resetShowButton }}>
      {children}
    </ShowButtonContext.Provider>
  );
}

export function useShowButton() {
  const context = useContext(ShowButtonContext);
  if (!context) throw new Error('useShowButton must be inside ShowButtonProvider');
  return context;
}