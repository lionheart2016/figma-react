import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Authentication from './auth-module/Authentication';
import InvestmentTypeSelection from './auth-module/InvestmentTypeSelection';
import Register from './auth-module/Register';
import EmailVerification from './auth-module/EmailVerification';
import Login from './auth-module/Login';
import ProtectedRoute from './auth-module/ProtectedRoute';
import Dashboard from './core/dashboard/Dashboard';
import TradeView from './core/trading/TradeView';
import Wallets from './core/wallets/Wallets';
import Reports from './core/reports/Reports';
import Settings from './core/settings/Settings';
import { ROUTES } from '../config/routes';

const AppRouter: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route 
          path={ROUTES.AUTHENTICATION} 
          element={<Authentication />} 
        />
        
        <Route 
          path={ROUTES.INVESTMENT_SELECTION} 
          element={<InvestmentTypeSelection />} 
        />
        
        <Route 
          path={ROUTES.REGISTER} 
          element={<Register />} 
        />
        
        <Route 
          path={ROUTES.EMAIL_VERIFICATION} 
          element={<EmailVerification />} 
        />
        
        <Route 
          path={ROUTES.LOGIN} 
          element={<Login />} 
        />
        
        {/* 需要认证的路由 */}
        <Route element={<ProtectedRoute />}>
          <Route 
            path={ROUTES.DASHBOARD} 
            element={<Dashboard />} 
          />
          
          <Route 
            path={`${ROUTES.TRADE}/*`} 
            element={<TradeView />} 
          />
          
          <Route 
            path={ROUTES.WALLETS} 
            element={<Wallets />} 
          />
          
          <Route 
            path={ROUTES.REPORTS} 
            element={<Reports />} 
          />
          
          <Route 
            path={ROUTES.SETTINGS} 
            element={<Settings />} 
          />
        </Route>
        
        {/* 默认路由 */}
        <Route 
          path={ROUTES.HOME} 
          element={<Navigate to={ROUTES.LOGIN} replace />} 
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