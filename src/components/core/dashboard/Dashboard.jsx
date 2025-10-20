import React from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useTranslation } from 'react-i18next'
import Layout from '../Layout'

function Dashboard() {
  const { t } = useTranslation()
  const { user } = usePrivy()

  return (
    <Layout activeMenu="dashboard" pageTitle="sidebar.dashboard" breadcrumbItems={['sidebar.dashboard']}>
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