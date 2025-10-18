import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useUserState } from '../services/userState.jsx';
import { ROUTES, routeMeta } from '../config/routes';

const RouterContext = createContext();

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const RouterProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { isLoggedIn, user: userStateUser, isSessionValid } = useUserState();
  const [currentRoute, setCurrentRoute] = useState(ROUTES.HOME);
  const [routeHistory, setRouteHistory] = useState([ROUTES.HOME]);

  // 根据认证状态自动路由
  useEffect(() => {
    // 使用userState服务来判断用户登录状态
    const userIsLoggedIn = isLoggedIn && isSessionValid() && userStateUser;
    
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
  }, [isLoggedIn, isSessionValid, userStateUser, currentRoute, isAuthenticated, user]);

  // 导航函数
  const navigate = (route, replace = false) => {
    if (route === currentRoute) return;

    // 检查路由权限 - 使用userState服务来判断登录状态
    const userIsLoggedIn = isLoggedIn && isSessionValid() && userStateUser;
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
  const goBack = () => {
    if (routeHistory.length > 1) {
      const previousRoute = routeHistory[routeHistory.length - 2];
      setRouteHistory(prev => prev.slice(0, -1));
      setCurrentRoute(previousRoute);
      document.title = routeMeta[previousRoute]?.title || 'Alphatoken';
    }
  };

  // 获取当前路由的元信息
  const getCurrentRouteMeta = () => {
    return routeMeta[currentRoute] || {};
  };

  const value = {
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

export default RouterContext;