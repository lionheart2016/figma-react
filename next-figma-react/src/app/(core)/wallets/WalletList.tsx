import WalletCard from './WalletCard';
import { useTheme } from '../../../contexts/ThemeContext';
import { Wallet } from './types';
import './styles.css';

interface WalletListProps {
  wallets: Wallet[];
  activeWallet: Wallet | null;
  onActivateWallet: (wallet: Wallet) => void;
  onCopyAddress?: (address: string) => void;
}

/**
 * 钱包列表组件
 * 显示用户所有钱包的卡片列表
 */
const WalletList: React.FC<WalletListProps> = ({ 
  wallets, 
  activeWallet, 
  onActivateWallet, 
  onCopyAddress
}) => {
  useTheme(); // 虽然导入但未使用，先保留调用
  /**
   * 默认的复制地址处理函数
   */
  const handleCopyAddress = (address: string): void => {
    navigator.clipboard.writeText(address)
      .then(() => {
        // 这里可以使用更友好的提示方式，如通知组件
        console.log('地址已复制到剪贴板');
      })
      .catch((error) => {
        console.error('复制地址失败:', error);
      });
  };
  
  const handleWalletClick = (wallet: Wallet) => {
    onActivateWallet(wallet);
  };

  // 如果没有钱包数据，显示空状态
  if (!wallets || wallets.length === 0) {
    return (
      <div className="wallet-list-container">
        <div className="wallet-list-empty">
          <div className="wallet-empty-icon">💼</div>
          <h3 className="wallet-empty-title">暂无钱包</h3>
          <p className="wallet-empty-text">请连接或创建一个新的钱包</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-list-container">
      <div className="wallet-list-header">
        <h2 className="wallet-list-title">
          我的钱包
        </h2>
        <span className="wallet-list-count">{wallets.length} 个钱包</span>
      </div>
      
      <div className="wallet-grid">
        {wallets.map((wallet, index) => (
          <WalletCard
            key={`${wallet.address}-${index}`}
            wallet={{
              ...wallet,
              balance: wallet.balance || '0.00' // 默认余额为0.00
            }}
            isActive={activeWallet?.address.toLowerCase() === wallet.address.toLowerCase()}
            onClick={() => handleWalletClick(wallet)}
            onActivate={onActivateWallet}
            onCopyAddress={onCopyAddress || handleCopyAddress}
          />
        ))}
      </div>
    </div>
  );
};

export default WalletList;