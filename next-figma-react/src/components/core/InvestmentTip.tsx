import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const InvestmentTip: React.FC = () => {
  const { t } = useTranslation();
  const [isClosed, setIsClosed] = useState(false);

  // 如果用户已经关闭了提示，则不显示
  if (isClosed) {
    return null;
  }

  const handleClose = (): void => {
    setIsClosed(true);
  };

  const handleCompleteProfile = (): void => {
    // 这里可以添加跳转到个人资料页面的逻辑
    console.log('跳转到个人资料页面');
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 relative">
      {/* 关闭按钮 */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors"
        aria-label={t('common.close')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">{t('tradeMain.completeProfile')}</h3>
          <p className="text-blue-700 mb-4">{t('tradeMain.completeProfileDesc')}</p>
          <button 
            onClick={handleCompleteProfile}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('tradeMain.complete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentTip;