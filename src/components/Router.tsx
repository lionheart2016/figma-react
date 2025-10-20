import React from 'react';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';
import Authentication from './auth-module/Authentication';
import InvestmentTypeSelection from './auth-module/InvestmentTypeSelection';
import Register from './auth-module/Register';
import EmailVerification from './auth-module/EmailVerification';
import Dashboard from './core/dashboard/Dashboard';
import TradeMain from './core/trading/TradeMain';

const Router: React.FC = () => {
  const { currentRoute, ROUTES } = useRouter();
  const { isAuthenticated, user } = useAuth();

  // 根据当前路由渲染对应的组件
  const renderRoute = (): React.ReactNode => {
    switch (currentRoute) {
      case ROUTES.AUTHENTICATION:
        return <Authentication />;
      
      case ROUTES.INVESTMENT_SELECTION:
        return <InvestmentTypeSelection />;
      
      case ROUTES.REGISTER:
        return <Register />;
      
      case ROUTES.EMAIL_VERIFICATION:
        return <EmailVerification />;
      
      case ROUTES.DASHBOARD:
        return <Dashboard />;
      
      case ROUTES.TRADE:
        return <TradeMain />;
      
      case ROUTES.HOME:
      default:
        // 根据认证状态决定默认页面
        if (isAuthenticated && user) {
          return <TradeMain />;
        } else {
          return <InvestmentTypeSelection />;
        }
    }
  };

  return (
    <div className="router-container">
      {renderRoute()}
    </div>
  );
};

export default Router;