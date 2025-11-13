import React from 'react';
import { Wallet, WalletState } from '@/services/UserStateService';

interface WalletAssetsProps {
  walletState: WalletState;
}

/**
 * 钱包资产组件
 * 显示钱包资产总览和资产分布
 */
const WalletAssets: React.FC<WalletAssetsProps> = ({ walletState }) => {
  return (
    <div className="wallet-tab-content">
      <div className="wallet-assets-overview">
        <h3>资产总览</h3>
        <div className="total-assets">
          <div className="total-assets-value">
            {walletState.activeWallet ? 
              '$0.00' : // 模拟数据，后续会接入真实数据
              '$0.00'
            }
          </div>
          <div className="total-assets-label">总资产价值</div>
        </div>
        
        <div className="assets-distribution">
          <h4>资产分布</h4>
          <div className="assets-empty-state">
            <p>暂无资产数据</p>
            <small>连接钱包后即可查看资产信息</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletAssets;