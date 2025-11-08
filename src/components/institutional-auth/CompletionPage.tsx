import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface CompletionPageProps {
  onComplete: () => void;
  estimatedTime?: string;
}

const CompletionPage: React.FC<CompletionPageProps> = ({ 
  onComplete, 
  estimatedTime = '3-5个工作日' 
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <div className="completion-page">
      <div className="text-center space-y-6">
        {/* 成功图标 */}
        <div className="flex justify-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-green-900/20' : 'bg-green-100'
          }`}>
            <svg 
              className="w-10 h-10 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* 标题 */}
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.completion.title')}
        </h2>

        {/* 描述 */}
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('institutionalAuth.completion.description')}
        </p>

        {/* 预计时间 */}
        <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
          isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100'
        }`}>
          <svg 
            className="w-5 h-5 text-blue-500 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <span className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            {t('institutionalAuth.completion.estimatedTime')}: {estimatedTime}
          </span>
        </div>

        {/* 下一步说明 */}
        <div className={`p-6 rounded-lg text-left ${
          isDarkMode ? 'bg-[#2C2C2C]' : 'bg-gray-50'
        }`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
            {t('institutionalAuth.completion.nextSteps')}
          </h3>
          <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              {t('institutionalAuth.completion.step1')}
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              {t('institutionalAuth.completion.step2')}
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              {t('institutionalAuth.completion.step3')}
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              {t('institutionalAuth.completion.step4')}
            </li>
          </ul>
        </div>

        {/* 联系信息 */}
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-[#2C2C2C]' : 'bg-gray-50'
        }`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('institutionalAuth.completion.contactInfo')}
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a 
              href="mailto:support@example.com" 
              className={`text-sm hover:underline ${
                isDarkMode ? 'text-blue-300' : 'text-blue-600'
              }`}
            >
              📧 support@example.com
            </a>
            <a 
              href="tel:+1234567890" 
              className={`text-sm hover:underline ${
                isDarkMode ? 'text-blue-300' : 'text-blue-600'
              }`}
            >
              📞 +1 234 567 890
            </a>
          </div>
        </div>

        {/* 完成按钮 */}
        <div className="pt-6">
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-[#4B5EF5] text-white rounded-lg font-medium hover:bg-[#3A4BD4] transition-colors"
          >
            {t('institutionalAuth.completion.finishButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;