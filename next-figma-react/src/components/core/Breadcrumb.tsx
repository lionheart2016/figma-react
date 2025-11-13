'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// 定义面包屑项接口
interface BreadcrumbItem {
  label: string;
  path: string;
  isLink: boolean;
}

const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  // 判断是否为一级页面（不需要面包屑导航）
  const isRootPage = [
    '/dashboard',
    '/trade',
    '/wallets',
    '/reports',
    '/settings'
  ].some(route => route === pathname);

  // 如果是一级页面，不显示面包屑
  if (isRootPage) {
    return null;
  }

  // 构建面包屑项目
  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];

    // 根据当前路径添加相应的面包屑项
    if (pathname.startsWith('/trade/')) {
      const pathSegments = pathname.split('/');
      const productId = pathSegments[pathSegments.length - 1];
      
      // 交易详情页面
      breadcrumbs.push({
        label: t('tradeMain.title'),
        path: '/trade',
        isLink: true
      });
      breadcrumbs.push({
        label: t('tradeDetail.title') || `Product ${productId}`,
        path: pathname,
        isLink: false
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  return (
    <nav className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
            )}
            <li>
              {crumb.isLink ? (
                <Link 
                  href={crumb.path} 
                  className="hover:text-blue-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">
                  {crumb.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;