import { useTheme } from '../../../contexts/ThemeContext';
import './styles.css';

interface WalletOperationsProps {
  onConnectExternalWallet: (walletType?: string) => void;
  onCreateWallet: () => void;
  isConnectingExternal?: boolean;
  isCreatingWallet?: boolean;
  hasEmbeddedWallet?: boolean;
}

/**
 * 钱包操作组件
 * 提供连接外部钱包和创建钱包的功能按钮
 */
const WalletOperations: React.FC<WalletOperationsProps> = ({ 
  onConnectExternalWallet, 
  onCreateWallet, 
  isConnectingExternal = false, 
  isCreatingWallet = false,
  hasEmbeddedWallet = false
}) => {
  useTheme(); // 虽然导入但未使用，先保留调用

  return (
    <div className="wallet-operations-section">
      <h2 className="wallet-operations-title">
        <span>💼</span> 钱包操作
      </h2>
      
      <div className="wallet-buttons-container">
          <button 
            className={`wallet-connect-button ${isConnectingExternal ? 'wallet-button-loading' : ''}`}
            onClick={() => onConnectExternalWallet()}
            disabled={isConnectingExternal}
          >
          <span className="wallet-button-icon">
            {isConnectingExternal ? '🔄' : '🔗'}
          </span>
          {isConnectingExternal ? '连接中...' : '连接外部钱包'}
        </button>
        
        {!hasEmbeddedWallet && (
            <button 
              className={`wallet-create-button ${isCreatingWallet ? 'wallet-button-loading' : ''}`}
              onClick={onCreateWallet}
              disabled={isCreatingWallet}
            >
            <span className="wallet-button-icon">💳</span>
            {isCreatingWallet ? '创建中...' : '创建钱包'}
          </button>
        )}
      </div>
    </div>
  );
};

export default WalletOperations;