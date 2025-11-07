import React from 'react';
import { useTranslation } from 'react-i18next';

interface TermsAcceptanceModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * 用户协议接受提示弹窗组件
 * 用于提示用户需要接受协议和隐私政策以继续注册
 */
const TermsAcceptanceModal: React.FC<TermsAcceptanceModalProps> = ({ onAccept, onDecline }) => {
  const { t } = useTranslation();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '640px',
        borderRadius: '10px',
        backgroundColor: '#1F2023',
        border: 'none',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        {/* 弹窗头部 */}
        <div style={{
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #575757'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 600,
            margin: 0,
            color: '#F8F9FC',
            fontFamily: 'Poppins, sans-serif'
          }}>
            {t('auth.register.termsAcceptanceTitle') || 'Terms Acceptance Required'}
          </h1>
          <button
            onClick={onDecline}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D8D8D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 弹窗内容 */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #575757'
        }}>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.5',
            margin: 0,
            color: '#F8F9FC',
            fontFamily: 'Poppins, sans-serif'
          }}>
            {t('auth.register.termsAcceptanceMessage') || '您需要接受用户协议和隐私政策以继续账户注册'}
          </p>
        </div>

        {/* 弹窗底部按钮 */}
        <div style={{
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onDecline}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: '1px solid #EDEEF3',
              backgroundColor: 'transparent',
              color: '#F8F9FC',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer'
            }}
          >
            {t('auth.register.declineButton') || 'Decline'}
          </button>
          <button
            onClick={onAccept}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#4B5EF5',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer'
            }}
          >
            {t('auth.register.acceptButton') || 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAcceptanceModal;