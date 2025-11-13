import React from 'react';
import { useTranslation } from 'react-i18next';

interface EmailNotRegisteredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
  email?: string;
}

const EmailNotRegisteredModal: React.FC<EmailNotRegisteredModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  email
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* 模态框头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('auth.emailNotRegistered') || '邮箱未注册'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={t('common.close') || '关闭'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 模态框内容 */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-2">
              {email ? (
                <>
                  {t('auth.emailNotRegisteredMessage', { email }) || `邮箱 ${email} 尚未注册`}
                </>
              ) : (
                t('auth.emailNotRegisteredGeneric') || '该邮箱地址尚未注册'
              )}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {t('auth.wouldYouLikeToRegister') || '是否立即注册新账户？'}
            </p>
          </div>
        </div>

        {/* 模态框底部 */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('common.cancel') || '取消'}
          </button>
          <button
            onClick={onRegister}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('auth.registerNow') || '立即注册'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailNotRegisteredModal;