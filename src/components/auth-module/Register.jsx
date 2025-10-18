import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/routes';
import Layout from './Layout';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = t('auth.register.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.register.emailInvalid');
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = t('auth.register.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.register.passwordMinLength');
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.register.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.register.passwordsNotMatch');
    }

    // 条款同意验证
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('auth.register.agreeToTermsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 模拟注册API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 保存用户信息到localStorage
      localStorage.setItem('userEmail', formData.email);
      
      // 导航到邮箱验证页面
      navigate(ROUTES.EMAIL_VERIFICATION);
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: t('auth.register.registrationFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.INVESTMENT_TYPE_SELECTION);
  };

  return (
    <Layout
      title={t('auth.register.createAccount')}
      subtitle={t('auth.register.enterDetails')}
      showBackButton={true}
      onBack={handleBack}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 邮箱输入 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#1C1C1C] mb-2">
            {t('auth.register.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-[#EDEEF3]'
            }`}
            placeholder={t('auth.register.email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* 密码输入 */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#1C1C1C] mb-2">
            {t('auth.register.password')}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] focus:border-transparent ${
              errors.password ? 'border-red-500' : 'border-[#EDEEF3]'
            }`}
            placeholder={t('auth.register.createPassword')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* 确认密码输入 */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1C1C1C] mb-2">
            {t('auth.register.confirmPassword')}
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] focus:border-transparent ${
              errors.confirmPassword ? 'border-red-500' : 'border-[#EDEEF3]'
            }`}
            placeholder={t('auth.register.confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* 条款同意 */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4 text-[#4B5EF5] bg-gray-100 border-gray-300 rounded focus:ring-[#4B5EF5] focus:ring-2"
          />
          <label htmlFor="agreeToTerms" className="text-sm text-[#73798B] leading-5">
            {t('auth.register.agreeToTerms')}{' '}
            <a href="#" className="text-[#4B5EF5] hover:underline">{t('auth.register.termsOfService')}</a>
            {' '}{t('auth.register.and')}{' '}
            <a href="#" className="text-[#4B5EF5] hover:underline">{t('auth.register.privacyPolicy')}</a>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${
            isLoading
              ? 'bg-[#D9D9D9] text-[#73798B] cursor-not-allowed'
              : 'bg-[#4B5EF5] text-white hover:bg-[#3A4BD4] active:bg-[#2A3AB3]'
          }`}
        >
          {isLoading ? t('auth.register.creatingAccount') : t('auth.register.createAccount')}
        </button>

        {/* 提交错误 */}
        {errors.submit && (
          <p className="text-sm text-red-500 text-center">{errors.submit}</p>
        )}
      </form>
    </Layout>
  );
};

export default Register;