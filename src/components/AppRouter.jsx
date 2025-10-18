import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserState } from '../services/userState.jsx';
import { useTranslation } from 'react-i18next';
import Authentication from './auth-module/Authentication';
import InvestmentTypeSelection from './auth-module/InvestmentTypeSelection';
import Register from './auth-module/Register';
import EmailVerification from './auth-module/EmailVerification';
import Dashboard from './Dashboard';
import TradeView from './TradeView';
import Wallets from './Wallets';
import Reports from './Reports';
import Settings from './Settings';
import { ROUTES } from '../config/routes';

// 路由守卫组件
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { isLoggedIn, isSessionValid, user: userStateUser } = useUserState();
  
  const userIsLoggedIn = isLoggedIn && isSessionValid() && userStateUser;
  
  if (!userIsLoggedIn && !isAuthenticated) {
    return <Navigate to={ROUTES.AUTHENTICATION} replace />;
  }
  
  return children;
};

// 公开路由组件（已登录用户重定向到交易页面）
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { isLoggedIn, isSessionValid, user: userStateUser } = useUserState();
  
  const userIsLoggedIn = isLoggedIn && isSessionValid() && userStateUser;
  
  if (userIsLoggedIn || isAuthenticated) {
    return <Navigate to={ROUTES.TRADE} replace />;
  }
  
  return children;
};

const AppRouter = () => {
  const { isAuthenticated } = useAuth();
  const { isLoggedIn, isSessionValid, user: userStateUser } = useUserState();
  const { t } = useTranslation();
  
  const userIsLoggedIn = isLoggedIn && isSessionValid() && userStateUser;
  
  return (
    <BrowserRouter>
      <Routes>
        {/* 认证相关路由 */}
        <Route 
          path={ROUTES.AUTHENTICATION} 
          element={
            <PublicRoute>
              <Authentication />
            </PublicRoute>
          } 
        />
        
        <Route 
          path={ROUTES.INVESTMENT_SELECTION} 
          element={
            <PublicRoute>
              <InvestmentTypeSelection />
            </PublicRoute>
          } 
        />
        
        <Route 
          path={ROUTES.REGISTER} 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        
        <Route 
          path={ROUTES.EMAIL_VERIFICATION} 
          element={
            <PublicRoute>
              <EmailVerification />
            </PublicRoute>
          } 
        />
        
        {/* 需要认证的路由 */}
        <Route 
          path={ROUTES.DASHBOARD} 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path={ROUTES.TRADE} 
          element={
            <ProtectedRoute>
              <TradeView />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path={ROUTES.WALLETS} 
          element={
            <ProtectedRoute>
              <Wallets />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path={ROUTES.REPORTS} 
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path={ROUTES.SETTINGS} 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        
        {/* 默认路由 */}
        <Route 
          path={ROUTES.HOME} 
          element={
            userIsLoggedIn || isAuthenticated ? 
              <Navigate to={ROUTES.TRADE} replace /> : 
              <Navigate to={ROUTES.INVESTMENT_SELECTION} replace />
          } 
        />
        
        {/* 404路由 */}
        <Route 
          path="*" 
          element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-2xl font-bold">{t('common.pageNotFound')}</h1>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;