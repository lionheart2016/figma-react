import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ROUTES, routeMeta } from '../config/routes';
import { useUser } from '../services/UserStateService';

// 定义路由元信息类型
interface RouteMeta {
  title?: string;
  requiresAuth?: boolean;
  [key: string]: any;
}

// 定义RouterContext的值类型
interface RouterContextType {
  currentRoute: string;
  routeHistory: string[];
  navigate: (route: string, replace?: boolean) => void;
  goBack: () => void;
  getCurrentRouteMeta: () => RouteMeta;
  ROUTES: typeof ROUTES;
}

// 创建路由上下文
const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

// 路由提供者组件
interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useUser();
  const [currentRoute, setCurrentRoute] = useState<string>(ROUTES.HOME);
  const [routeHistory, setRouteHistory] = useState<string[]>([ROUTES.HOME]);

  // 根据认证状态自动路由
  useEffect(() => {
    // 使用isAuthenticated和user来判断用户登录状态
    const userIsLoggedIn = isAuthenticated && user;
    
    if (userIsLoggedIn) {
      // 用户已登录，重定向到交易页面
      if (routeMeta[currentRoute]?.requiresAuth === false) {
        console.log('用户已登录，重定向到交易页面');
        navigate(ROUTES.TRADE);
      }
    } else {
      // 用户未登录，重定向到认证页面
      if (routeMeta[currentRoute]?.requiresAuth === true) {
        console.log('用户未登录，重定向到认证页面');
        navigate(ROUTES.AUTHENTICATION);
      }
    }
  }, [isAuthenticated, user, currentRoute]);

  // 导航函数
  const navigate = (route: string, replace: boolean = false): void => {
    if (route === currentRoute) return;

    // 检查路由权限 - 使用useUser钩子来判断登录状态
    const userIsLoggedIn = isAuthenticated && user;
    if (routeMeta[route]?.requiresAuth && !userIsLoggedIn) {
      console.warn('需要认证才能访问该页面，重定向到认证页面');
      setCurrentRoute(ROUTES.AUTHENTICATION);
      if (replace) {
        setRouteHistory([ROUTES.AUTHENTICATION]);
      } else {
        setRouteHistory(prev => [...prev, ROUTES.AUTHENTICATION]);
      }
      return;
    }

    setCurrentRoute(route);
    
    if (replace) {
      setRouteHistory([route]);
    } else {
      setRouteHistory(prev => [...prev, route]);
    }

    // 更新页面标题
    document.title = routeMeta[route]?.title || 'Alphatoken';
  };

  // 返回上一页
  const goBack = (): void => {
    if (routeHistory.length > 1) {
      const previousRoute = routeHistory[routeHistory.length - 2];
      setRouteHistory(prev => prev.slice(0, -1));
      setCurrentRoute(previousRoute);
      document.title = routeMeta[previousRoute]?.title || 'Alphatoken';
    }
  };

  // 获取当前路由的元信息
  const getCurrentRouteMeta = (): RouteMeta => {
    return routeMeta[currentRoute] || {};
  };

  const value: RouterContextType = {
    currentRoute,
    routeHistory,
    navigate,
    goBack,
    getCurrentRouteMeta,
    ROUTES
  };

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
};