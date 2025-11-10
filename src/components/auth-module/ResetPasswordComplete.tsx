import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes';
import LanguageSwitcher from '../global/LanguageSwitcher';

const ResetPasswordComplete: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // 密码强度验证规则
    const passwordRules = {
        hasLowercase: /[a-z]/.test(newPassword),
        hasUppercase: /[A-Z]/.test(newPassword),
        hasNumber: /\d/.test(newPassword),
        hasMinLength: newPassword.length >= 8
    };

    const handleBack = () => {
        navigate(-1); // 返回上一页
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 验证密码
        if (!passwordRules.hasLowercase || !passwordRules.hasUppercase ||
            !passwordRules.hasNumber || !passwordRules.hasMinLength) {
            return;
        }

        if (newPassword !== confirmPassword) {
            return;
        }

        setIsLoading(true);

        try {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 重置成功
            setIsSuccess(true);

            // 3秒后跳转到登录页面
            setTimeout(() => {
                navigate(ROUTES.TRADE);
            }, 3000);

        } catch (error) {
            console.error('重置密码失败:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = passwordRules.hasLowercase &&
        passwordRules.hasUppercase &&
        passwordRules.hasNumber &&
        passwordRules.hasMinLength &&
        newPassword === confirmPassword &&
        newPassword.length > 0;

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex">
                {/* 背景装饰 - 左侧品牌图案 */}
                <div
                    className="w-[475px] h-[1000px] bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/src/assets/brand-delivery-bg.png')"
                    }}
                />

                <div className="relative z-10 w-full max-w-[1440px] h-[900px] flex items-center justify-center">
                    {/* 语言选择器 */}
                    <div className="absolute top-10 right-40">
                        <LanguageSwitcher />
                    </div>

                    {/* 返回按钮 */}
                    <div
                        className="absolute top-8 left-8 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleBack}
                    >
                        <div className="w-8 h-8 flex items-center justify-center bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20">
                            <img src="/src/assets/back-arrow.svg" alt="back" className="w-4 h-4" />
                        </div>
                        <span className="ml-3 text-base font-medium text-white font-poppins">
              {t('common.back')}
            </span>
                    </div>

                    {/* 主内容区域 */}
                    <div className="flex flex-col items-center">
                        {/* 页面标题 */}
                        <h1 className="text-[36px] font-semibold text-white font-poppins mb-6 text-center"
                            style={{ width: '388px', height: '44px', marginTop: '230px' }}>
                            {t('auth.resetPassword.title')}
                        </h1>

                        {/* 成功提示 */}
                        <div className="w-[249px] p-3 bg-[#2FE776] bg-opacity-20 border border-[#2FE776] border-opacity-60 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <img src="/src/assets/success-icon.svg" alt="success" className="w-4 h-4" />
                                </div>
                                <span className="text-[14px] font-medium text-[#2FE776] font-poppins">
                  {t('auth.resetPassword.successMessage')}
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex">
            {/* 背景装饰 - 左侧品牌图案 */}
            <div
                className="w-[475px] h-[1300px] bg-cover bg-center"
                style={{
                    backgroundImage: "url('/src/assets/brand-delivery-bg.png')"
                }}
            />

            <div className="relative z-10 w-full max-w-[1440px] h-[900px] flex items-center justify-center">
                {/* 语言选择器 */}
                <div className="absolute top-10 right-40">
                    <LanguageSwitcher />
                </div>

                {/* 返回按钮 */}
                <div
                    className="absolute top-8 left-8 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleBack}
                >
                    <div className="w-8 h-8 flex items-center justify-center bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20">
                        <img src="/src/assets/back-arrow.svg" alt="back" className="w-4 h-4" />
                    </div>
                    <span className="ml-3 text-base font-medium text-white font-poppins">
            {t('common.back')}
          </span>
                </div>

                {/* 主内容区域 */}
                <div className="flex flex-col items-center">
                    {/* 页面标题 */}
                    <h1 className="text-[36px] font-semibold text-white font-poppins mb-6 text-center"
                        style={{ width: '388px', height: '44px', marginTop: '230px' }}>
                        {t('auth.resetPassword.title')}
                    </h1>

                    {/* 表单区域 */}
                    <form onSubmit={handleSubmit} className="relative space-y-8">
                        {/* 新密码输入 */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="newPassword" className="text-[14px] font-normal text-white font-poppins">
                                {t('auth.resetPassword.newPasswordLabel')}
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full h-[40px] px-3 py-2 bg-white border border-[#73798B] rounded-[6px] text-[14px] font-normal font-poppins placeholder-[#73798B] focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <img src="/src/assets/eye-icon.svg" alt="toggle visibility" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* 确认密码输入 */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="confirmPassword" className="text-[14px] font-normal text-white font-poppins">
                                {t('auth.resetPassword.confirmPasswordLabel')}
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full h-[40px] px-3 py-2 bg-white border border-[#73798B] rounded-[6px] text-[14px] font-normal font-poppins placeholder-[#73798B] focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <img src="/src/assets/eye-icon.svg" alt="toggle visibility" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* 密码强度验证 */}
                        <div className="flex space-x-16">
                            {/* 左侧验证规则 */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${passwordRules.hasLowercase ? 'bg-[#2FE776]' : 'bg-[#EDEEF3]'}`}></div>
                                    <span className={`text-[12px] font-normal font-poppins ${passwordRules.hasLowercase ? 'text-[#2FE776]' : 'text-[#73798B]'}`}>
                    {t('auth.resetPassword.passwordRuleLowercase')}
                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${passwordRules.hasNumber ? 'bg-[#2FE776]' : 'bg-[#EDEEF3]'}`}></div>
                                    <span className={`text-[12px] font-normal font-poppins ${passwordRules.hasNumber ? 'text-[#2FE776]' : 'text-[#73798B]'}`}>
                    {t('auth.resetPassword.passwordRuleNumber')}
                  </span>
                                </div>
                            </div>

                            {/* 右侧验证规则 */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${passwordRules.hasUppercase ? 'bg-[#2FE776]' : 'bg-[#EDEEF3]'}`}></div>
                                    <span className={`text-[12px] font-normal font-poppins ${passwordRules.hasUppercase ? 'text-[#2FE776]' : 'text-[#73798B]'}`}>
                    {t('auth.resetPassword.passwordRuleUppercase')}
                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${passwordRules.hasMinLength ? 'bg-[#2FE776]' : 'bg-[#EDEEF3]'}`}></div>
                                    <span className={`text-[12px] font-normal font-poppins ${passwordRules.hasMinLength ? 'text-[#2FE776]' : 'text-[#73798B]'}`}>
                    {t('auth.resetPassword.passwordRuleLength')}
                  </span>
                                </div>
                            </div>
                        </div>

                        {/* 提交按钮 */}
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className={`absolute left-1/2 transform -translate-x-1/2 w-[390px] h-[40px] text-white text-[14px] font-semibold font-poppins rounded-[6px] transition-all duration-200 flex items-center justify-center ${
                                isFormValid && !isLoading
                                    ? 'bg-[#4B5EF5] hover:bg-[#3D4FD0] cursor-pointer'
                                    : 'bg-[#73798B] bg-opacity-70 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                t('auth.resetPassword.resetButton')
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordComplete;