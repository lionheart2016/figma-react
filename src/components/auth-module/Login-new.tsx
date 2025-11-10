import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/routes';
import Layout from './Layout';
import { useTheme } from '../../contexts/ThemeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import EmailNotRegisteredModal from './EmailNotRegisteredModal';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

const Login_new: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [loginFailCount, setLoginFailCount] = useState<number>(0);
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [showEmailNotRegisteredModal, setShowEmailNotRegisteredModal] = useState<boolean>(false);
  const navigate = useNavigate();

  // 处理邮箱输入变化
  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    
    // 清除对应字段的错误
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  // 处理邮箱校验状态变化
  const handleEmailValidationChange = (isValid: boolean) => {
    setIsEmailValid(isValid);
  };

  // 处理密码输入变化
  const handlePasswordChange = (value: string) => {
    setFormData(prev => ({ ...prev, password: value }));
    
    // 清除对应字段的错误
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  // 处理密码校验状态变化
  const handlePasswordValidationChange = (isValid: boolean) => {
    setIsPasswordValid(isValid);
  };

  // 处理邮箱失去焦点时的验证
  const handleEmailBlur = () => {
    if (formData.email) {
      validateForm();
    }
  };

  // 处理登录失败计数
  const handleLoginFailure = () => {
    const newCount = loginFailCount + 1;
    setLoginFailCount(newCount);
    
    // 当失败次数达到5次时，显示CAPTCHA
    if (newCount >= 5) {
      setShowCaptcha(true);
      toast.warning(t('auth.login.captchaRequired'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // 处理登录成功，重置失败计数
  const handleLoginSuccess = () => {
    if (loginFailCount > 0) {
      setLoginFailCount(0);
      setShowCaptcha(false);
      setCaptchaToken('');
    }
  };

  // 处理CAPTCHA验证通过
  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    toast.success(t('auth.login.captchaVerified'), {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // 模拟后端登录验证（包含各种失败场景）
  const simulateBackendLogin = async (email: string, password: string, captchaToken?: string): Promise<boolean> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟各种失败场景
    const random = Math.random();
    
    // 邮箱未注册校验（20%概率）
    if (random < 0.2) {
      throw new Error('EMAIL_NOT_REGISTERED');
    }
    
    // 账号密码错误校验（30%概率）
    if (random >= 0.2 && random < 0.5) {
      throw new Error('INVALID_CREDENTIALS');
    }
    
    // 账户状态异常校验（10%概率）
    if (random >= 0.5 && random < 0.6) {
      throw new Error('ACCOUNT_SUSPENDED');
    }
    
    // 需要CAPTCHA验证但未提供（当失败次数>=5时）
    if (loginFailCount >= 5 && !captchaToken) {
      throw new Error('CAPTCHA_REQUIRED');
    }
    
    // CAPTCHA验证失败（当提供token但验证失败时）
    if (captchaToken && captchaToken !== 'valid_captcha_token') {
      throw new Error('CAPTCHA_INVALID');
    }
    
    // 登录成功（剩余概率）
    return true;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = t('auth.login.validation.emailRequired');
    } else {
      const email = formData.email;
      
      // 规则1: 整个邮箱地址必须包含且仅包含一个@字符
      if ((email.match(/@/g) || []).length !== 1) {
        newErrors.email = t('auth.login.validation.invalidEmail');
      }
      // 规则2: 邮箱地址中不得包含任何emoji符号
      else if (/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1F170}-\u{1F251}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}]/gu.test(email)) {
        newErrors.email = t('auth.login.validation.invalidEmail');
      }
      // 规则3: @字符不能位于邮箱地址的开头或结尾位置
      else if (email.startsWith('@') || email.endsWith('@')) {
        newErrors.email = t('auth.login.validation.invalidEmail');
      }
      // 规则4: 邮箱地址中不允许出现连续的两个.，且每个.之间必须存在有效内容
      else if (email.includes('..')) {
        newErrors.email = t('auth.login.validation.invalidEmail');
      }
      // 规则5: 邮箱地址不能以.开头或结尾
      else if (email.startsWith('.') || email.endsWith('.')) {
        newErrors.email = t('auth.login.validation.invalidEmail');
      }
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = t('auth.login.validation.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.login.validation.passwordTooShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 进行表单验证
    const isValid = validateForm();
    
    if (!isValid) {
      // 显示第一个错误
      const firstError = Object.values(errors).find(error => error);
      if (firstError) {
        toast.error(firstError, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      return;
    }

    // 如果失败次数>=5次且未显示CAPTCHA，强制显示CAPTCHA
    if (loginFailCount >= 5 && !showCaptcha) {
      setShowCaptcha(true);
      toast.warning(t('auth.login.captchaRequiredMessage'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    // 如果显示CAPTCHA但未验证通过，阻止提交
    if (showCaptcha && !captchaToken) {
      toast.error(t('auth.login.captchaRequired'), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setIsLoading(true);

    try {
      // 使用模拟后端登录验证
      const loginSuccess = await simulateBackendLogin(formData.email, formData.password, captchaToken);
      
      if (loginSuccess) {
        // 登录成功
        handleLoginSuccess();
        
        // 保存用户信息到localStorage
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('isLoggedIn', 'true');
        
        // 登录成功后导航到仪表盘或首页
        navigate(ROUTES.DASHBOARD);
        
        toast.success(t('auth.login.loginSuccess'), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      // 处理登录失败
      handleLoginFailure();
      
      let errorMessage = t('auth.login.loginFailed');
      
      // 根据错误类型显示不同的错误消息
      if (error instanceof Error) {
        switch (error.message) {
          case 'EMAIL_NOT_REGISTERED':
            // 显示邮箱未注册模态框，不显示toast错误
            setShowEmailNotRegisteredModal(true);
            errorMessage = t('auth.login.errors.emailNotRegistered');
            break;
          case 'INVALID_CREDENTIALS':
            errorMessage = t('auth.login.errors.invalidCredentials');
            break;
          case 'ACCOUNT_SUSPENDED':
            errorMessage = t('auth.login.errors.accountSuspended');
            break;
          case 'CAPTCHA_REQUIRED':
            errorMessage = t('auth.login.errors.captchaRequired');
            break;
          case 'CAPTCHA_INVALID':
            errorMessage = t('auth.login.errors.captchaInvalid');
            break;
        }
      }
      
      console.error(t('auth.login.loginError'), error);
      setErrors({ submit: errorMessage });
      
      // 只有当错误不是EMAIL_NOT_REGISTERED时才显示toast错误
      if (!(error instanceof Error) || error.message !== 'EMAIL_NOT_REGISTERED') {
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // 导航到重置密码页面
    navigate(ROUTES.RESET_PASSWORD);
  };

  const handleRegister = () => {
    navigate(ROUTES.REGISTER);
  };

  // 处理邮箱未注册模态框关闭
  const handleEmailNotRegisteredModalClose = () => {
    setShowEmailNotRegisteredModal(false);
  };

  // 处理邮箱未注册模态框注册按钮点击
  const handleEmailNotRegisteredModalRegister = () => {
    setShowEmailNotRegisteredModal(false);
    navigate('/register_new');
  };



  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // 模拟社交登录API调用
    setTimeout(() => {
      setIsLoading(false);
      toast.info(`${provider} 登录功能正在开发中`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }, 1000);
  };

  return (
    <>
    <Layout>
        <div className="w-full max-w-md">
          {/* 页面标题 */}
          <h1 
            className={`text-[36px] font-semibold mb-6 ${isDarkMode ? 'text-[#F8F9FC]' : 'text-[#1C1C1C]'}`}
          >
            {t('auth.login.welcomeBack')}
          </h1>
          
          {/* 副标题 */}
          <p 
            className={`text-[16px] mb-10 ${isDarkMode ? 'text-[#B9BCC5]' : 'text-[#73798B]'}`}
          >
            {t('auth.login.signInToAccount')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 邮箱输入 */}
            <EmailInput
              value={formData.email}
              onChange={handleEmailChange}
              error={errors.email}
              onBlur={handleEmailBlur}
              validateOnChange={true}
              validateOnBlur={true}
              onValidationChange={handleEmailValidationChange}
            />

            {/* 密码输入 */}
            <PasswordInput
              value={formData.password}
              onChange={handlePasswordChange}
              error={errors.password}
              placeholder={t('auth.password')}
              validateOnChange={true}
              validateOnBlur={true}
              onValidationChange={handlePasswordValidationChange}
            />

            {/* 忘记密码链接 */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className={`text-sm font-medium ${isDarkMode ? 'text-[#4B5EF5]' : 'text-[#4B5EF5]'} hover:underline transition-colors`}
              >
                {t('auth.login.forgotPassword')}
              </button>
            </div>

            {/* CAPTCHA验证区域 */}
            {showCaptcha && (
              <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t('auth.login.captchaVerification')}
                  </h3>
                  <span className="text-xs text-red-500">
                    {t('common.required')}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {/* 模拟Cloudflare CAPTCHA组件 */}
                  <div className="p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cloudflare CAPTCHA
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {t('auth.login.failCount')}: {loginFailCount}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('auth.login.captchaVerificationDesc')}
                      </p>
                      
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleCaptchaVerify('valid_captcha_token')}
                          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                          {t('auth.login.captchaVerify')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCaptchaVerify('invalid_token')}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                        >
                          {t('auth.login.captchaFailed')}
                        </button>
                      </div>
                      
                      {captchaToken && (
                        <div className="p-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 rounded">
                          ✓ {t('auth.login.captchaVerified')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('auth.login.captchaHelp')}
                  </p>
                </div>
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading || !isEmailValid || !isPasswordValid}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-[16px] transition-all duration-200 text-white
                ${isLoading || !isEmailValid || !isPasswordValid
                  ? 'bg-[#73798B] bg-opacity-70 cursor-not-allowed'
                  : 'bg-[#1F32D6] hover:bg-[#1A2BB8] active:bg-[#152496]'
                }`}
              style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common.loading')}
                </>
              ) : (
                t('auth.login.signIn')
              )}
            </button>

            {/* 提交错误 */}
            {errors.submit && (
              <p className="text-sm text-red-500 text-center">{errors.submit}</p>
            )}
          </form>

          {/* 注册链接 */}
          <div className="text-center">
            <p className={`text-sm pt-2 ${isDarkMode ? 'text-[#B9BCC5]' : 'text-[#73798B]'}`}>
              {t('auth.login.dontHaveAccount')} {' '}
              <button
                type="button"
                onClick={handleRegister}
                className="text-[#4B5EF5] hover:text-[#3D4FD0] font-medium focus:outline-none focus:underline transition-colors"
              >
                {t('auth.register')}
              </button>
            </p>
          </div>
        </div>
        
        <ToastContainer />
      </Layout>
      
      {/* 邮箱未注册模态框 */}
      {showEmailNotRegisteredModal && (
        <EmailNotRegisteredModal
          isOpen={showEmailNotRegisteredModal}
          onClose={handleEmailNotRegisteredModalClose}
          onRegister={handleEmailNotRegisteredModalRegister}
        />
      )}
      </>
  );
};

export default Login_new;