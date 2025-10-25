import React from 'react';
import { useTranslation } from 'react-i18next';

interface GlobalLoadingProps {
  message?: string;
  showTimeoutWarning?: boolean;
  timeoutMessage?: string;
}

const GlobalLoading: React.FC<GlobalLoadingProps> = ({ 
  message, 
  showTimeoutWarning = false,
  timeoutMessage
}) => {
  const { t } = useTranslation();
  
  const defaultMessage = message || t('common.loadingInitializing');
   const defaultTimeoutMessage = timeoutMessage || t('common.loadingTakingLonger');

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
      {/* 主加载指示器 */}
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* 加载动画 */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* 加载文本 */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {defaultMessage}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('common.loadingPleaseWait')}
          </p>
        </div>
      </div>

      {/* 超时警告 */}
      {showTimeoutWarning && (
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg max-w-md">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {defaultTimeoutMessage}
            </p>
          </div>
        </div>
      )}

      {/* 进度指示器 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
          <span>{t('common.loadingInitializingPrivy')}</span>
          <div className="flex space-x-1">
            {[1, 2, 3].map((dot) => (
              <div 
                key={dot}
                className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: `${dot * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoading;