import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Authentication from './auth-module/Authentication';
import InvestmentTypeSelection from './auth-module/InvestmentTypeSelection';
import Register from './auth-module/Register';
import Register_new from './auth-module/Register_new';
import EmailVerification from './auth-module/EmailVerification';
import Login from './auth-module/Login';
import ProtectedRoute from './auth-module/ProtectedRoute';
import Dashboard from './core/dashboard/Dashboard';
import TradeView from './core/trading/TradeView';
import Wallets from './core/wallets/Wallets';
import Reports from './core/reports/Reports';
import Settings from './core/settings/Settings';
import { ROUTES } from '../config/routes';
import { useUser } from '../services/UserStateService';
import PageTracker from './global/PageTracker';

// 条件重定向组件 - 根据用户认证状态决定跳转目标
const ConditionalRedirect: React.FC = () => {
  const { isAuthenticated } = useUser();
  
  // 如果用户已登录，重定向到交易页面
  // 如果用户未登录，重定向到登录页面
  return isAuthenticated ? 
    <Navigate to={ROUTES.TRADE} replace /> : 
    <Navigate to={ROUTES.LOGIN} replace />;
};

const AppRouter: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route 
          path={ROUTES.AUTHENTICATION} 
          element={
            <PageTracker pageName="认证页面">
              <Authentication />
            </PageTracker>
          } 
        />
        
        <Route 
          path={ROUTES.INVESTMENT_SELECTION} 
          element={
            <PageTracker pageName="投资类型选择">
              <InvestmentTypeSelection />
            </PageTracker>
          } 
        />

        <Route 
          path={ROUTES.REGISTER} 
          element={
            <PageTracker pageName="注册页面">
              {/* <Register /> */}
              <Register />
            </PageTracker>
          } 
        />
        
        <Route 
          path={ROUTES.REGISTER_NEW} 
          element={
            <PageTracker pageName="注册页面">
              {/* <Register /> */}
              <Register_new />
            </PageTracker>
          } 
        />
        
        <Route 
          path={ROUTES.EMAIL_VERIFICATION} 
          element={
            <PageTracker pageName="邮箱验证">
              <EmailVerification />
            </PageTracker>
          } 
        />
        
        <Route 
          path={ROUTES.LOGIN} 
          element={
            <PageTracker pageName="登录页面">
              <Login />
            </PageTracker>
          } 
        />
        
        {/* 需要认证的路由 */}
        <Route element={<ProtectedRoute />}>
          <Route 
            path={ROUTES.DASHBOARD} 
            element={
              <PageTracker pageName="仪表板">
                <Dashboard />
              </PageTracker>
            } 
          />
          
          <Route 
            path={`${ROUTES.TRADE}/*`} 
            element={
              <PageTracker pageName="交易页面">
                <TradeView />
              </PageTracker>
            } 
          />
          
          <Route 
            path={ROUTES.WALLETS} 
            element={
              <PageTracker pageName="钱包页面">
                <Wallets />
              </PageTracker>
            } 
          />
          
          <Route 
            path={ROUTES.REPORTS} 
            element={
              <PageTracker pageName="报告页面">
                <Reports />
              </PageTracker>
            } 
          />
          
          <Route 
            path={ROUTES.SETTINGS} 
            element={
              <PageTracker pageName="设置页面">
                <Settings />
              </PageTracker>
            } 
          />
        </Route>
        
        {/* 默认路由 - 根据认证状态条件重定向 */}
        <Route 
          path={ROUTES.HOME} 
          element={
            <PageTracker pageName="首页">
              <ConditionalRedirect />
            </PageTracker>
          } 
        />
        
        {/* 404路由 */}
        <Route 
          path="*" 
          element={
            <PageTracker pageName="404页面">
              <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">{t('common.pageNotFound')}</h1>
              </div>
            </PageTracker>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;