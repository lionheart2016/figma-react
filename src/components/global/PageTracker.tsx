import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useUser } from '../../services/UserStateService';
import AutoButtonTracker from './AutoButtonTracker';

interface PageTrackerProps {
  children: React.ReactNode;
  pageName?: string;
  trackButtons?: boolean;
}

/**
 * 页面追踪组件
 * 自动追踪页面浏览和页面内的按钮点击
 */
export const PageTracker: React.FC<PageTrackerProps> = ({
  children,
  pageName,
  trackButtons = true
}) => {
  const location = useLocation();
  const { trackPageView, setUserProperties } = useAnalytics();
  const userContext = useUser();

  useEffect(() => {
    // 获取页面信息
    const currentPageName = pageName || getPageNameFromPath(location.pathname);
    const pagePath = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    
    // 构建页面上下文数据
    const pageContext = {
      page_name: currentPageName,
      page_path: pagePath,
      search_params: Object.fromEntries(searchParams.entries()),
      hash: location.hash || '',
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      referrer: document.referrer || ''
    };

    // 记录页面浏览
    trackPageView(currentPageName, pagePath);

    // 设置用户属性（如果用户已登录）
    if (userContext && userContext.user) {
      const hasWallet = userContext.user.walletAddress || 
                       (userContext.user.linkedAccounts && 
                        userContext.user.linkedAccounts.some(account => 
                          account.type === 'wallet'
                        ));
      
      setUserProperties({
        userId: userContext.user.id,
        userType: userContext.user.email ? 'authenticated' : 'anonymous',
        walletConnected: !!hasWallet,
        language: navigator.language,
        country: '' // User类型没有country属性，留空
      });
    }

    // 记录详细的页面浏览事件（使用额外的参数）
    trackPageView(currentPageName, pagePath, pageContext);

    console.log(`[PageTracker] 页面浏览记录: ${currentPageName} (${pagePath})`);
  }, [location.pathname, location.search, location.hash, pageName, trackPageView, setUserProperties, userContext]);

  // 根据路径获取页面名称
  const getPageNameFromPath = (path: string): string => {
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
  };

  return (
    <div data-page-tracker={pageName || getPageNameFromPath(location.pathname)}>
      {trackButtons ? (
        <AutoButtonTracker componentName={pageName || getPageNameFromPath(location.pathname)}>
          {children}
        </AutoButtonTracker>
      ) : (
        children
      )}
    </div>
  );
};

export default PageTracker;