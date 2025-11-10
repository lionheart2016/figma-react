import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onResend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  value,
  onChange,
  onResend,
  disabled = false,
  placeholder
}) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(0);

  // 处理重新发送验证码
  const handleResend = () => {
    if (countdown === 0) {
      onResend();
      setCountdown(30); // 设置30秒倒计时
    }
  };

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor="verificationCode" className="text-[14px] font-normal text-white font-poppins">
          {t('auth.resetPassword.verificationCodeLabel')}
        </label>
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || disabled}
          className="text-[12px] font-semibold text-[#4B5EF5] font-poppins hover:text-[#3D4FD0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {countdown > 0 ? `${countdown}s` : t('auth.resetPassword.resendCode')}
        </button>
      </div>
      <div className="relative">
        <input
          id="verificationCode"
          type="text"
          placeholder={placeholder || t('auth.resetPassword.verificationCodePlaceholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required
          className="w-[390px] h-[40px] px-3 py-2 bg-white border border-[#73798B] rounded-[6px] text-[14px] font-normal font-poppins placeholder-[#73798B] focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default VerificationCodeInput;