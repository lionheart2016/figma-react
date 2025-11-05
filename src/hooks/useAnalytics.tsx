import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnalyticsServiceWrapper } from '../services/analyticsService';

// 分析 Hook
export const useAnalytics = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 自动追踪页面浏览
  useEffect(() => {
    const pageName = getPageNameFromPath(location.pathname);
    AnalyticsServiceWrapper.trackPageView(pageName, location.pathname);
  }, [location.pathname]);

  // 追踪按钮点击
  const trackButtonClick = useCallback((buttonName: string, additionalParams?: Record<string, any>) => {
    const pageName = getPageNameFromPath(location.pathname);
    AnalyticsServiceWrapper.trackButtonClick(buttonName, pageName, additionalParams);
  }, [location.pathname]);

  // 追踪链接点击
  const trackLinkClick = useCallback((linkText: string, destination: string) => {
    const pageName = getPageNameFromPath(location.pathname);
    AnalyticsServiceWrapper.trackButtonClick('link_click', pageName, {
      link_text: linkText,
      destination: destination
    });
  }, [location.pathname]);

  // 追踪表单提交
  const trackFormSubmit = useCallback((formName: string, success: boolean, errorMessage?: string) => {
    const pageName = getPageNameFromPath(location.pathname);
    AnalyticsServiceWrapper.trackButtonClick('form_submit', pageName, {
      form_name: formName,
      success: success,
      error_message: errorMessage || ''
    });
  }, [location.pathname]);

  // 追踪导航
  const trackNavigation = useCallback((from: string, to: string, navigationType: string) => {
    AnalyticsServiceWrapper.trackButtonClick('navigation', from, {
      from_page: from,
      to_page: to,
      navigation_type: navigationType
    });
  }, []);

  // 增强的导航函数
  const navigateWithTracking = useCallback((to: string, options?: any) => {
    const from = getPageNameFromPath(location.pathname);
    const toPage = getPageNameFromPath(to);
    
    trackNavigation(from, toPage, 'programmatic');
    navigate(to, options);
  }, [navigate, location.pathname, trackNavigation]);

  return {
    trackButtonClick,
    trackLinkClick,
    trackFormSubmit,
    trackNavigation,
    navigateWithTracking,
    // 导出原始服务方法
    trackPageView: AnalyticsServiceWrapper.trackPageView,
    trackWalletConnect: AnalyticsServiceWrapper.trackWalletConnect,
    trackTransaction: AnalyticsServiceWrapper.trackTransaction,
    trackAuthEvent: AnalyticsServiceWrapper.trackAuthEvent,
    trackSearch: AnalyticsServiceWrapper.trackSearch,
    trackError: AnalyticsServiceWrapper.trackError,
    setUserProperties: AnalyticsServiceWrapper.setUserProperties,
    trackSettingsChange: AnalyticsServiceWrapper.trackSettingsChange,
    trackPerformance: AnalyticsServiceWrapper.trackPerformance
  };
};

// 根据路径获取页面名称
function getPageNameFromPath(path: string): string {
  const pathMap: Record<string, string> = {
    '/': '首页',
    '/authentication': '认证页面',
    '/investment-selection': '投资类型选择',
    '/register': '注册页面',
    '/email-verification': '邮箱验证',
    '/login': '登录页面',
    '/dashboard': '仪表板',
    '/trade': '交易页面',
    '/wallets': '钱包页面',
    '/reports': '报告页面',
    '/settings': '设置页面',
    '/404': '404页面'
  };

  return pathMap[path] || path.split('/').filter(Boolean).pop() || '未知页面';
}

// 高阶组件 - 自动追踪组件交互
export const withAnalytics = <P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> => {
  const WrappedComponent = (props: P) => {
    // 追踪组件挂载
    useEffect(() => {
      AnalyticsServiceWrapper.trackButtonClick('component_mount', componentName, {
        component_name: componentName
      });

      return () => {
        AnalyticsServiceWrapper.trackButtonClick('component_unmount', componentName, {
          component_name: componentName
        });
      };
    }, []);

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default useAnalytics;