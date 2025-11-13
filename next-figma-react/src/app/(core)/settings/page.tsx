'use client';


import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';


type NotificationSettings = {
  email: boolean;
  push: boolean;
  sms: boolean;
};

type UserSettings = {
  language: string;
  currency: string;
  timezone: string;
  notifications: NotificationSettings;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  loginAlerts: boolean;
  defaultInvestment: string;
  autoConfirm: boolean;
  priceAlerts: boolean;
  dataSharing: boolean;
  analytics: boolean;
  marketing: boolean;
};

type Tab = {
  id: string;
  label: string;
  icon: string;
};

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('general');
  
  // 面包屑功能已移除
  
  const [settings, setSettings] = useState<UserSettings>({
    // 通用设置
    language: 'English',
    currency: 'USD',
    timezone: 'UTC+8',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    
    // 安全设置
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
    
    // 交易设置
    defaultInvestment: '1000',
    autoConfirm: false,
    priceAlerts: true,
    
    // 隐私设置
    dataSharing: false,
    analytics: true,
    marketing: false
  });

  const handleSettingChange = (category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof UserSettings] as Record<string, any>,
        [field]: value
      }
    }));
  };

  const handleDirectSettingChange = (field: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs: Tab[] = [
    { id: 'general', label: t('settings.general'), icon: '⚙️' },
    { id: 'security', label: t('settings.security'), icon: '🔒' },
    { id: 'trading', label: t('settings.trading'), icon: '💹' },
    { id: 'privacy', label: t('settings.privacy'), icon: '👁️' }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[#1c1c1c] mb-4">{t('settings.languageAndRegion')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#73798B] mb-2">{t('settings.language')}</label>
            <select 
              value={settings.language}
              onChange={(e) => handleDirectSettingChange('language', e.target.value)}
              className="w-full p-3 border border-[#E8EAED] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">{t('language.english')}</option>
              <option value="zh-CN">{t('language.simplifiedChinese')}</option>
              <option value="zh-TW">{t('language.traditionalChinese')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#73798B] mb-2">{t('settings.currency')}</label>
            <select 
              value={settings.currency}
              onChange={(e) => handleDirectSettingChange('currency', e.target.value)}
              className="w-full p-3 border border-[#E8EAED] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">{t('currency.USD')}</option>
              <option value="CNY">{t('currency.CNY')}</option>
              <option value="EUR">{t('currency.EUR')}</option>
              <option value="GBP">{t('currency.GBP')}</option>
              <option value="JPY">{t('currency.JPY')}</option>
              <option value="AUD">{t('currency.AUD')}</option>
              <option value="CAD">{t('currency.CAD')}</option>
              <option value="CHF">{t('currency.CHF')}</option>
              <option value="HKD">{t('currency.HKD')}</option>
              <option value="SGD">{t('currency.SGD')}</option>
              <option value="KRW">{t('currency.KRW')}</option>
              <option value="INR">{t('currency.INR')}</option>
              <option value="RUB">{t('currency.RUB')}</option>
              <option value="BRL">{t('currency.BRL')}</option>
              <option value="MXN">{t('currency.MXN')}</option>
              <option value="ZAR">{t('currency.ZAR')}</option>
              <option value="NZD">{t('currency.NZD')}</option>
              <option value="SEK">{t('currency.SEK')}</option>
              <option value="NOK">{t('currency.NOK')}</option>
              <option value="DKK">{t('currency.DKK')}</option>
              <option value="PLN">{t('currency.PLN')}</option>
              <option value="CZK">{t('currency.CZK')}</option>
              <option value="HUF">{t('currency.HUF')}</option>
              <option value="RON">{t('currency.RON')}</option>
              <option value="TRY">{t('currency.TRY')}</option>
              <option value="IDR">{t('currency.IDR')}</option>
              <option value="THB">{t('currency.THB')}</option>
              <option value="MYR">{t('currency.MYR')}</option>
              <option value="PHP">{t('currency.PHP')}</option>
              <option value="VND">{t('currency.VND')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#73798B] mb-2">{t('settings.timezone')}</label>
            <select 
              value={settings.timezone}
              onChange={(e) => handleDirectSettingChange('timezone', e.target.value)}
              className="w-full p-3 border border-[#E8EAED] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC-12">{t('timezone.UTC-12')}</option>
              <option value="UTC-11">{t('timezone.UTC-11')}</option>
              <option value="UTC-10">{t('timezone.UTC-10')}</option>
              <option value="UTC-9">{t('timezone.UTC-9')}</option>
              <option value="UTC-8">{t('timezone.UTC-8')}</option>
              <option value="UTC-7">{t('timezone.UTC-7')}</option>
              <option value="UTC-6">{t('timezone.UTC-6')}</option>
              <option value="UTC-5">{t('timezone.UTC-5')}</option>
              <option value="UTC-4">{t('timezone.UTC-4')}</option>
              <option value="UTC-3">{t('timezone.UTC-3')}</option>
              <option value="UTC-2">{t('timezone.UTC-2')}</option>
              <option value="UTC-1">{t('timezone.UTC-1')}</option>
              <option value="UTC+0">{t('timezone.UTC+0')}</option>
              <option value="UTC+1">{t('timezone.UTC+1')}</option>
              <option value="UTC+2">{t('timezone.UTC+2')}</option>
              <option value="UTC+3">{t('timezone.UTC+3')}</option>
              <option value="UTC+4">{t('timezone.UTC+4')}</option>
              <option value="UTC+5">{t('timezone.UTC+5')}</option>
              <option value="UTC+6">{t('timezone.UTC+6')}</option>
              <option value="UTC+7">{t('timezone.UTC+7')}</option>
              <option value="UTC+8">{t('timezone.UTC+8')}</option>
              <option value="UTC+9">{t('timezone.UTC+9')}</option>
              <option value="UTC+10">{t('timezone.UTC+10')}</option>
              <option value="UTC+11">{t('timezone.UTC+11')}</option>
              <option value="UTC+12">{t('timezone.UTC+12')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[#1c1c1c] mb-4">{t('settings.notifications')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1c1c1c]">{t('settings.emailNotifications')}</p>
              <p className="text-sm text-[#73798B]">{t('settings.emailNotificationsDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.notifications.email}
                onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1c1c1c]">{t('settings.pushNotifications')}</p>
              <p className="text-sm text-[#73798B]">{t('settings.pushNotificationsDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.notifications.push}
                onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[#1c1c1c] mb-4">{t('settings.accountSecurity')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1c1c1c]">{t('settings.twoFactorAuth')}</p>
              <p className="text-sm text-[#73798B]">{t('settings.twoFactorAuthDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.twoFactorAuth}
                onChange={(e) => handleDirectSettingChange('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1c1c1c]">{t('settings.loginAlerts')}</p>
              <p className="text-sm text-[#73798B]">{t('settings.loginAlertsDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.loginAlerts}
                onChange={(e) => handleDirectSettingChange('loginAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#73798B] mb-2">{t('settings.sessionTimeout')}</label>
            <select 
              value={settings.sessionTimeout}
              onChange={(e) => handleDirectSettingChange('sessionTimeout', parseInt(e.target.value))}
              className="w-full p-3 border border-[#E8EAED] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>{t('settings.minutes', { count: 15 })}</option>
              <option value={30}>{t('settings.minutes', { count: 30 })}</option>
              <option value={60}>{t('settings.hours', { count: 1 })}</option>
              <option value={120}>{t('settings.hours', { count: 2 })}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[#1c1c1c] mb-4">{t('settings.securityActions')}</h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 border border-[#E8EAED] rounded-lg hover:bg-[#F8FAFF]">
            <p className="font-medium text-[#1c1c1c]">{t('settings.changePassword')}</p>
            <p className="text-sm text-[#73798B]">{t('settings.changePasswordDesc')}</p>
          </button>
          
          <button className="w-full text-left p-3 border border-[#E8EAED] rounded-lg hover:bg-[#F8FAFF]">
            <p className="font-medium text-[#1c1c1c]">{t('settings.viewLoginDevices')}</p>
            <p className="text-sm text-[#73798B]">{t('settings.viewLoginDevicesDesc')}</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTradingSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[#1c1c1c] mb-4">{t('settings.tradingPreferences')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#73798B] mb-2">{t('settings.defaultInvestment')}</label>
            <input 
              type="text" 
              value={settings.defaultInvestment}
              onChange={(e) => handleDirectSettingChange('defaultInvestment', e.target.value)}
              className="w-full p-3 border border-[#E8EAED] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('settings.defaultInvestmentPlaceholder')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1c1c1c]">{t('settings.autoConfirm')}</p>
              <p className="text-sm text-[#73798B]">{t('settings.autoConfirmDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.autoConfirm}
                onChange={(e) => handleDirectSettingChange('autoConfirm', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1c1c1c]">{t('settings.priceAlerts')}</p>
              <p className="text-sm text-[#73798B]">{t('settings.priceAlertsDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.priceAlerts}
                onChange={(e) => handleDirectSettingChange('priceAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[#1c1c1c] mb-4">{t('settings.dataPrivacy')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1c1c1c]">{t('settings.dataSharing')}</p>
              <p className="text-sm text-[#73798B]">{t('settings.dataSharingDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.dataSharing}
                onChange={(e) => handleDirectSettingChange('dataSharing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1c1c1c]">{t('settings.analytics')}</p>
              <p className="text-sm text-[#73798B]">{t('settings.analyticsDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.analytics}
                onChange={(e) => handleDirectSettingChange('analytics', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1c1c1c]">{t('settings.marketing')}</p>
              <p className="text-sm text-[#73798B]">{t('settings.marketingDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.marketing}
                onChange={(e) => handleDirectSettingChange('marketing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[#1c1c1c] mb-4">{t('settings.privacyActions')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1c1c1c]">{t('settings.downloadData')}</p>
              <p className="text-sm text-[#73798B]">{t('settings.downloadDataDesc')}</p>
            </div>
            <button className="btn btn-outline">{t('settings.download')}</button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1c1c1c]">{t('settings.deleteAccount')}</p>
              <p className="text-sm text-[#73798B]">{t('settings.deleteAccountDesc')}</p>
            </div>
            <button className="btn btn-danger">{t('settings.delete')}</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'trading':
        return renderTradingSettings();
      case 'privacy':
        return renderPrivacySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (

      <div className="settings-container">
        <div className="mb-6 sm:mb-8">
          <p className="text-sm sm:text-base text-[#73798B]">
            {t('settings.description')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏导航 */}
          <div className="lg:w-64">
            <div className="card p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-[#73798B] hover:text-[#1c1c1c] hover:bg-[#F8FAFF]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 主内容区域 */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>

  );
};

export default Settings;