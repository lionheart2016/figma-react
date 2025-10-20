import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../Layout';

type BreadcrumbItem = {
  key: string;
  label: string;
};

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  
  const breadcrumbItems: BreadcrumbItem[] = [
    { key: 'dashboard', label: t('sidebar.dashboard') }
  ];

  return (
    <Layout activeMenu="dashboard" pageTitle="dashboard.title" breadcrumbItems={breadcrumbItems}>
      {/* Dashboard Content - 空白页面只显示logo */}
      <div className="dashboard-content min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img 
            src="/alphatoken-logo.svg" 
            alt="Alphatoken Logo" 
            className="w-32 h-32 mx-auto mb-4 opacity-60"
          />
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard