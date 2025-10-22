import React from 'react';
import Layout from '../Layout';

const Dashboard: React.FC = () => {

  return (
    <Layout activeMenu="dashboard">
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