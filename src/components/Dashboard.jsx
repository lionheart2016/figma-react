import React, { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useTranslation } from 'react-i18next'
import Sidebar from './Sidebar'
import WalletCard from './WalletCard'
import TradingPanel from './TradingPanel'
import TransactionHistory from './TransactionHistory'
import InvestmentTypeSelection from './auth-module/InvestmentTypeSelection'
import Register from './auth-module/Register'

function Dashboard() {
  const { t } = useTranslation()
  const { authenticated, user, login, logout } = usePrivy()
  const [investmentTypeSelected, setInvestmentTypeSelected] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [selectedInvestmentType, setSelectedInvestmentType] = useState(null)
  const [forceShowInvestmentSelection, setForceShowInvestmentSelection] = useState(false)
  const [activeMenu, setActiveMenu] = useState('dashboard')

  // 检查本地存储，看用户是否已经完成投资类型选择
  useEffect(() => {
    const savedInvestmentType = localStorage.getItem('investmentTypeSelected')
    if (savedInvestmentType === 'true') {
      setInvestmentTypeSelected(true)
    }
  }, [])

  // 处理注册流程
  const handleRegister = (type) => {
    console.log('Starting registration for:', type)
    setSelectedInvestmentType(type)
    setShowRegister(true)
  }

  const handleRegistrationComplete = () => {
    console.log('Registration completed')
    setShowRegister(false)
    setInvestmentTypeSelected(true)
    // 保存到本地存储
    localStorage.setItem('investmentTypeSelected', 'true')
    // 注册完成后进行Privy认证
    login()
  }

  // 处理返回投资类型选择
  const handleBackToInvestmentSelection = () => {
    setShowRegister(false)
    setForceShowInvestmentSelection(true)
  }

  const handleMenuClick = (menuLabel) => {
    setActiveMenu(menuLabel)
  }

  // 如果显示注册界面
  if (showRegister) {
    return (
      <Register 
        investmentType={selectedInvestmentType}
        onComplete={handleRegistrationComplete}
        onBack={handleBackToInvestmentSelection}
      />
    )
  }

  // 如果用户未认证且未选择投资类型，或者强制显示投资类型选择界面
  if ((!authenticated && !investmentTypeSelected) || forceShowInvestmentSelection) {
    return (
      <InvestmentTypeSelection onRegister={handleRegister} />
    )
  }

  // 如果用户已认证且已选择投资类型，显示主界面
  if (authenticated && investmentTypeSelected) {
    return (
      <div className="trade-view">
        {/* Sidebar - Fixed on left */}
        <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
        
        {/* Main Content Area */}
        <div className="main-layout">
          {/* Header - Positioned at top right */}
          <header className="header-menu">
            <div className="header-left">
              <div className="admin-section">
                <div className="admin-info">
                  <img src="/profile-icon.svg" alt="Profile" className="profile-icon" />
                  <span className="admin-name">{user?.email || t('trade.admin')}</span>
                  <img src="/chevron-down.svg" alt="Dropdown" className="chevron-down" />
                </div>
              </div>
            </div>
            
            <div className="header-right">
              <img src="/notification-icon.svg" alt="Notifications" className="notification-icon" />
              <img src="/setting-icon.svg" alt="Settings" className="setting-icon" />
            </div>
          </header>

          {/* Content Area */}
          <main className="main-content">
            {/* Breadcrumb */}
            <div className="breadcrumb">
              <span className="breadcrumb-item active">{t('sidebar.dashboard')}</span>
            </div>

            {/* Page Title */}
            <h1 className="page-title">{t('sidebar.dashboard')}</h1>

            {/* Dashboard Content */}
            <div className="dashboard-content">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {/* 左侧：钱包信息和交易面板 */}
                <div className="xl:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
                  <WalletCard />
                  <TradingPanel />
                </div>
                
                {/* 右侧：交易历史 */}
                <div className="xl:col-span-1">
                  <TransactionHistory />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // 默认显示投资类型选择界面
  return (
    <InvestmentTypeSelection onRegister={handleRegister} />
  )
}

export default Dashboard