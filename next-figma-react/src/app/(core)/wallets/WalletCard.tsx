import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Wallet } from './types';
import './styles.css';

interface WalletCardProps {
  wallet: Wallet;
  isActive: boolean;
  onClick?: (wallet: Wallet) => void;
  onActivate: (wallet: Wallet) => void;
  onCopyAddress: (address: string) => void;
}

/**
 * 钱包卡片组件
 * 显示单个钱包的详细信息和操作按钮
 */
const WalletCard: React.FC<WalletCardProps> = ({ 
  wallet, 
  isActive, 
  onClick,
  onActivate, 
  onCopyAddress 
}) => {
  useTheme(); // 虽然导入但未使用，先保留调用
  /**
   * 处理复制地址功能
   */
  const handleCopyAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onCopyAddress(wallet.address);
  };

  /**
   * 处理激活钱包功能
   */
  const handleActivate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onActivate(wallet);
  };

  /**
   * 格式化钱包地址显示
   */
  const formatAddress = (address: string): string => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  /**
   * 获取钱包类型文本
   */
  const getWalletTypeText = (type: string): string => {
    return type === 'embedded' ? '嵌入式' : '外部';
  };

  /**
   * 获取钱包类型对应的图标
   */
  const getWalletTypeIcon = (type: string): string => {
    return type === 'embedded' ? '🏠' : '🔗';
  };

  return (
    <div 
      className={`wallet-card ${isActive ? 'wallet-card-active' : ''}`}
      onClick={() => {
        if (onClick) {
          onClick(wallet);
        } else {
          onActivate(wallet);
        }
      }}
    >
      <div className="wallet-card-header">
        <div className="wallet-type-badge">
          {getWalletTypeIcon(wallet.type)}
        </div>
        <div className="wallet-status">
          {isActive ? (
            <span className="wallet-active-indicator">✅ 已激活</span>
          ) : (
            <span className="wallet-inactive-indicator">⚪ 未激活</span>
          )}
        </div>
      </div>
      
      <div className="wallet-card-body">
        <div className="wallet-name">
          <h5 className="wallet-name-text">{wallet.name}</h5>
        </div>
        
        <div className="wallet-address">
          <span className="wallet-address-label">地址</span>
          <div className="wallet-address-container">
            <span className="wallet-address-text">
              {formatAddress(wallet.address)}
            </span>
            <button 
              className="wallet-copy-button"
              onClick={handleCopyAddress}
              title="复制地址"
              aria-label="复制地址"
            >
              📋
            </button>
          </div>
        </div>
        
        <div className="wallet-details">
          <div className="wallet-details-row">
            <div className="wallet-detail-item">
              <span className="wallet-detail-label">链类型:</span>
              <span className="wallet-detail-value wallet-chain">
                {wallet.chain}
              </span>
            </div>
            <div className="wallet-detail-item">
              <span className="wallet-detail-label">钱包类型:</span>
              <span className={`wallet-detail-value ${wallet.type === 'embedded' ? 'wallet-type-embedded' : 'wallet-type-external'}`}>
                {getWalletTypeText(wallet.type)}
              </span>
            </div>
          </div>
          <div className="wallet-balance">
            <span className="wallet-balance-text">
              {wallet.balance || '⏳ 加载中...'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="wallet-card-footer">
        <button 
          className={`wallet-action-button ${isActive ? 'wallet-action-button-active' : 'wallet-action-button-inactive'}`}
          onClick={handleActivate}
        >
          {isActive ? '取消激活' : '激活钱包'}
        </button>
      </div>
    </div>
  );
};

export default WalletCard;