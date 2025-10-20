import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/routes';
import Layout from './Layout';

const InvestmentTypeSelection = ({ onRegister }) => {
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const investmentTypes = [
    {
      id: 'individual',
      name: t('auth.investmentTypes.individual'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" fill="#4B5EF5"/>
          <path d="M15.5 18H4.5C3.94772 18 3.5 17.5523 3.5 17C3.5 13.6863 6.18629 11 9.5 11H10.5C13.8137 11 16.5 13.6863 16.5 17C16.5 17.5523 16.0523 18 15.5 18Z" fill="#4B5EF5"/>
        </svg>
      )
    },
    {
      id: 'corporate',
      name: t('auth.investmentTypes.corporate'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4H14C15.1046 4 16 4.89543 16 6V14C16 15.1046 15.1046 16 14 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4Z" fill="#4B5EF5"/>
          <path d="M8 8H12V12H8V8Z" fill="white"/>
        </svg>
      )
    }
  ];

  const handleSelect = (type) => {
    setSelectedType(type);
  };

  const handleRegister = () => {
    if (selectedType) {
      console.log(t('auth.investmentSelection.selectedType'), selectedType);
      
      // 保存投资类型到localStorage
      localStorage.setItem('selectedInvestmentType', selectedType);
      
      // 导航到注册页面
      navigate(ROUTES.REGISTER);
      
      // 如果提供了onRegister回调，也调用它
      if (onRegister) {
        onRegister(selectedType);
      }
    }
  };

  return (
    <Layout
      title={t('auth.investmentSelection.title')}
      subtitle={t('auth.investmentSelection.subtitle')}
    >
      {/* 投资类型选择 */}
      <div className="space-y-4">
        {investmentTypes.map((type) => (
          <div
            key={type.id}
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedType === type.id
                ? 'border-2 border-[#4B5EF5]'
                : 'border border-[#EDEEF3]'
            } bg-white rounded-lg p-4 hover:shadow-md`}
            onClick={() => handleSelect(type.id)}
          >
            {/* 选中状态指示器 */}
            <div className="absolute top-4 right-4">
              {selectedType === type.id ? (
                <img src="/radio-on.svg" alt="Selected" className="w-4 h-4" />
              ) : (
                <img src="/radio-off.svg" alt="Not selected" className="w-4 h-4" />
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* 图标容器 */}
              <div className="w-10 h-10 bg-[#4B5EF5]/10 rounded-lg flex items-center justify-center">
                {type.icon}
              </div>

              {/* 类型名称 */}
              <span className="text-base lg:text-lg font-semibold text-[#1C1C1C]">
                {type.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 注册按钮 */}
      <button
        onClick={handleRegister}
        disabled={!selectedType}
        className={`w-full mt-8 py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${
          selectedType
            ? 'bg-[#4B5EF5] text-white hover:bg-[#3A4BD4] active:bg-[#2A3AB3]'
            : 'bg-[#D9D9D9] text-[#73798B] cursor-not-allowed'
        }`}
      >
        {t('auth.register.registerButton')}
      </button>
    </Layout>
  );
};

export default InvestmentTypeSelection;