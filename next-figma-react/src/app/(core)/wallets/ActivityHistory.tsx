import React, { useState, useEffect, useMemo } from 'react';
import { Wallet } from '@/services/UserStateService';
import './styles.css';

// 网络配置
export const NETWORK_CONFIGS = {
  sepolia: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: '9PSMBDMECJ1R8K3ZNVNUWBT9V9TQK8RBB9',
    chainId: 11155111,
    explorer: 'https://sepolia.etherscan.io'
  },
  mainnet: {
    baseUrl: 'https://api.etherscan.io/v2/api',
    apiKey: '9PSMBDMECJ1R8K3ZNVNUWBT9V9TQK8RBB9',
    chainId: 1,
    explorer: 'https://etherscan.io'
  }
} as const;

/**
 * 区块链交易类型定义
 */
export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  gasUsed: number;
  gasPrice: number;
  txFee: string;
  blockNumber: number;
  method: string;
  isError: boolean;
  type: 'sent' | 'received';
}

/**
 * 活动历史组件属性
 */
interface ActivityHistoryProps {
  activeWallet?: Wallet | null;
  activeNetwork?: keyof typeof NETWORK_CONFIGS;
}

/**
 * 检查网络连接状态
 */
const checkNetworkConnection = async (network: keyof typeof NETWORK_CONFIGS = 'sepolia'): Promise<boolean> => {
  try {
    const networkConfig = NETWORK_CONFIGS[network];
    if (!networkConfig) {
      throw new Error(`不支持的网络: ${network}`);
    }

    let url = `${networkConfig.baseUrl}?module=proxy&action=eth_blockNumber&apikey=${networkConfig.apiKey}&chainid=${networkConfig.chainId}`;
    console.log('检查网络连接:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.status === '1' || data.result !== undefined;
    }
    return false;
  } catch (error) {
    console.error('网络连接检查失败:', error);
    return false;
  }
};

/**
 * 获取交易历史
 */
const getTransactionHistory = async (
  address: string,
  network: keyof typeof NETWORK_CONFIGS = 'sepolia',
  retryCount = 3
): Promise<BlockchainTransaction[]> => {
  try {
    const networkConfig = NETWORK_CONFIGS[network];
    if (!networkConfig) {
      throw new Error(`不支持的网络: ${network}`);
    }

    // 检查网络连接
    const isNetworkConnected = await checkNetworkConnection(network);
    if (!isNetworkConnected) {
      throw new Error('网络连接失败，请检查网络状态');
    }

    // 构建Etherscan API请求URL
    const params = new URLSearchParams({
      module: 'account',
      action: 'txlist',
      address: address,
      startblock: '0',
      endblock: '99999999',
      page: '1',
      offset: '20',
      sort: 'desc',
      apikey: networkConfig.apiKey,
      chainid: networkConfig.chainId.toString()
    });

    const url = `${networkConfig.baseUrl}?${params.toString()}`;
    console.log('调用区块链接口:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      const errorMessage = `HTTP错误! 状态码: ${response.status}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // 检查API响应状态
    if (data.status === '1') {
      if (data.result && Array.isArray(data.result)) {
        // 优化数据解析和格式化
        const formattedTransactions = data.result.map(tx => {
          try {
            // 安全地解析数值，避免NaN
            const value = parseInt(tx.value) || 0;
            const gasUsed = parseInt(tx.gasUsed) || 0;
            const gasPrice = parseInt(tx.gasPrice) || 0;
            const timestamp = parseInt(tx.timeStamp) || 0;
            const blockNumber = parseInt(tx.blockNumber) || 0;
            
            // 计算交易费用
            const txFee = (gasUsed * gasPrice) / 1e18;
            
            // 判断交易方法类型
            let method = 'Transfer';
            if (tx.input && tx.input !== '0x' && tx.input.length > 10) {
              method = 'Execute';
            }
            
            // 格式化数据
            const formattedTx: BlockchainTransaction = {
              hash: tx.hash || '',
              from: tx.from || '',
              to: tx.to || '',
              value: (value / 1e18).toFixed(8), // 转换为ETH，保留8位小数
              timestamp: timestamp * 1000, // 转换为毫秒
              gasUsed: gasUsed,
              gasPrice: gasPrice / 1e9, // 转换为Gwei
              txFee: txFee.toFixed(8), // 交易费用（ETH）
              blockNumber: blockNumber,
              method: method,
              isError: tx.isError === '1',
              type: tx.from && address && tx.from.toLowerCase() === address.toLowerCase() ? 'sent' : 'received'
            };
            
            // 验证必要字段
            if (!formattedTx.hash || !formattedTx.from) {
              console.warn('交易数据不完整:', formattedTx);
              return null;
            }
            
            return formattedTx;
          } catch (parseError) {
            console.error('解析交易数据失败:', parseError, tx);
            return null;
          }
        }).filter((tx): tx is BlockchainTransaction => tx !== null); // 过滤掉解析失败的数据
        
        console.log(`成功解析 ${formattedTransactions.length} 笔交易`);
        return formattedTransactions;
      } else {
        // 没有交易记录，返回空数组
        console.log('API返回成功状态，但无交易记录');
        return [];
      }
    } else if (data.status === '0' && data.message === 'No transactions found') {
      // 没有找到交易记录，返回空数组
      console.log('API返回：未找到交易记录');
      return [];
    } else {
      const apiError = `API错误: ${data.message || '未知错误'}`;
      console.error(apiError);
      throw new Error(apiError);
    }
  } catch (error) {
    console.error('获取交易历史失败:', error);
    
    // 根据错误类型提供更详细的错误信息
    let errorMessage = '获取交易历史失败';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = '请求超时，请检查网络连接';
      } else if (error.message.includes('HTTP错误')) {
        errorMessage = `区块链接口错误: ${error.message}`;
      } else if (error.message.includes('网络连接失败')) {
        errorMessage = error.message;
      }
    }
    
    // 重试逻辑
    if (retryCount > 0) {
      console.log(`重试获取交易历史，剩余重试次数: ${retryCount}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
      return getTransactionHistory(address, network, retryCount - 1);
    }
    
    // 所有重试失败，抛出错误
    throw new Error(`获取交易历史失败: ${errorMessage}`);
  }
};

/**
 * 格式化时间
 */
const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return `${Math.floor(diff / 1000)}秒前`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 格式化金额
 */
const formatAmount = (amount: string): string => {
  const num = parseFloat(amount);
  if (num === 0) return '0';
  if (num < 0.000001) return num.toExponential(6);
  if (num > 1000) return num.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
  return num.toFixed(6);
};

/**
 * 格式化哈希
 */
const formatHash = (hash: string): string => {
  if (!hash || hash.length < 10) return hash;
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};

/**
 * 格式化地址
 */
const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * 活动历史组件
 * 展示用户钱包的交易历史记录
 */
const ActivityHistory: React.FC<ActivityHistoryProps> = ({ 
  activeWallet, 
  activeNetwork = 'sepolia' 
}) => {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'amount' | 'fee' | 'block'>('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  /**
   * 刷新交易历史
   */
  const refreshHistory = async () => {
    if (!activeWallet || !activeWallet.address) {
      setTransactions([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`正在获取钱包 ${activeWallet.address} 的交易历史...`);
      const txHistory = await getTransactionHistory(activeWallet.address, activeNetwork);
      setTransactions(txHistory);
      console.log('交易历史获取成功');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取交易历史失败';
      setError(errorMessage);
      console.error('刷新交易历史失败:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 当活跃钱包或网络改变时重新获取交易历史
   */
  useEffect(() => {
    refreshHistory();
  }, [activeWallet, activeNetwork]);

  /**
   * 过滤和排序交易
   */
  const filteredAndSortedTransactions = useMemo(() => {
    // 先过滤
    let filtered = transactions.filter(tx => {
      if (filter === 'all') return true;
      return tx.type === filter;
    });
    
    // 再排序
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'time':
          comparison = a.timestamp - b.timestamp;
          break;
        case 'amount':
          comparison = parseFloat(a.value) - parseFloat(b.value);
          break;
        case 'fee':
          comparison = parseFloat(a.txFee) - parseFloat(b.txFee);
          break;
        case 'block':
          comparison = a.blockNumber - b.blockNumber;
          break;
        default:
          comparison = a.timestamp - b.timestamp;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [transactions, filter, sortBy, sortDirection]);
  
  /**
   * 处理排序
   */
  const handleSort = (field: 'time' | 'amount' | 'fee' | 'block') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  /**
   * 获取排序图标
   */
  const getSortIcon = (field: 'time' | 'amount' | 'fee' | 'block'): string => {
    if (sortBy !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  /**
   * 渲染空钱包状态
   */
  const renderNoWalletState = () => (
    <div className="activity-history">
      <div className="no-wallet-message">
        <p>🔍 请先激活一个钱包查看交易历史</p>
      </div>
    </div>
  );

  /**
   * 渲染加载状态
   */
  const renderLoadingState = () => (
    <div className="loading-state">
      <p>⏳ 加载交易历史中...</p>
    </div>
  );

  /**
   * 渲染错误状态
   */
  const renderErrorState = () => (
    <div className="error-state">
      <p>❌ {error}</p>
      <button onClick={refreshHistory} className="error-retry-button">重试</button>
    </div>
  );

  /**
   * 渲染空状态
   */
  const renderEmptyState = () => (
    <div className="empty-state">
      <p>📭 暂无交易记录</p>
      <small>完成第一笔交易后，记录将显示在这里</small>
    </div>
  );

  /**
   * 渲染交易表格
   */
  const renderTransactionTable = () => (
    <div className="transactions-table-container">
      {/* 表头 */}
      <div className="transactions-table-header">
        <div className="table-cell hash-col">
          <button onClick={() => handleSort('hash' as any)} className="sortable-header">
            交易哈希 {getSortIcon('time')}
          </button>
        </div>
        <div className="table-cell method-col">
          方法
        </div>
        <div className="table-cell block-col">
          <button onClick={() => handleSort('block')} className="sortable-header">
            区块 {getSortIcon('block')}
          </button>
        </div>
        <div className="table-cell age-col">
          <button onClick={() => handleSort('time')} className="sortable-header">
            时间 {getSortIcon('time')}
          </button>
        </div>
        <div className="table-cell from-col">
          发送方
        </div>
        <div className="table-cell to-col">
          接收方
        </div>
        <div className="table-cell amount-col">
          <button onClick={() => handleSort('amount')} className="sortable-header">
            金额 {getSortIcon('amount')}
          </button>
        </div>
        <div className="table-cell fee-col">
          <button onClick={() => handleSort('fee')} className="sortable-header">
            交易费 {getSortIcon('fee')}
          </button>
        </div>
      </div>
      
      {/* 交易列表 */}
      <div className="transactions-list">
        {filteredAndSortedTransactions.map((tx, index) => (
          <div key={`${tx.hash}-${index}`} className="transaction-item">
            <div className="table-cell hash-col">
              <a 
                href={`${NETWORK_CONFIGS[activeNetwork].explorer}/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hash-link"
                title={tx.hash}
              >
                {formatHash(tx.hash)}
              </a>
            </div>
            
            <div className="table-cell method-col">
              <span className={`method-badge ${tx.method.toLowerCase()}`}>
                {tx.method}
              </span>
            </div>
            
            <div className="table-cell block-col">
              <a 
                href={`${NETWORK_CONFIGS[activeNetwork].explorer}/block/${tx.blockNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block-link"
              >
                {tx.blockNumber}
              </a>
            </div>
            
            <div className="table-cell age-col">
              <span title={new Date(tx.timestamp).toLocaleString()}>
                {formatTime(tx.timestamp)}
              </span>
            </div>
            
            <div className="table-cell from-col">
              <div className="address-container">
                {tx.type === 'sent' && <span className="direction-indicator out">OUT</span>}
                <a 
                  href={`${NETWORK_CONFIGS[activeNetwork].explorer}/address/${tx.from}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`address-link ${tx.type === 'sent' ? 'outgoing' : ''}`}
                  title={tx.from}
                >
                  {formatAddress(tx.from)}
                </a>
              </div>
            </div>
            
            <div className="table-cell to-col">
              <div className="address-container">
                {tx.type === 'received' && <span className="direction-indicator in">IN</span>}
                <a 
                  href={`${NETWORK_CONFIGS[activeNetwork].explorer}/address/${tx.to}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`address-link ${tx.type === 'received' ? 'incoming' : ''}`}
                  title={tx.to}
                >
                  {formatAddress(tx.to)}
                </a>
              </div>
            </div>
            
            <div className="table-cell amount-col">
              <span className={`amount-value ${tx.type} ${tx.isError ? 'error' : ''}`}>
                {tx.isError && '❌ '}
                {tx.type === 'sent' ? '-' : '+'} {formatAmount(tx.value)} ETH
              </span>
            </div>
            
            <div className="table-cell fee-col">
              <span className="fee-value">
                {formatAmount(tx.txFee)} ETH
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredAndSortedTransactions.length > 0 && (
        <div className="table-footer">
          <small>显示 {filteredAndSortedTransactions.length} / {transactions.length} 笔交易</small>
        </div>
      )}
    </div>
  );

  if (!activeWallet || !activeWallet.address) {
    return renderNoWalletState();
  }

  return (
    <div className="activity-history">
      <div className="history-header">
        <div className="header-left">
          <h3>📊 交易历史</h3>
          <span className="transaction-count">
            共 {transactions.length} 笔交易
          </span>
        </div>
        
        <div className="header-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              全部
            </button>
            <button 
              className={`filter-btn ${filter === 'sent' ? 'active' : ''}`}
              onClick={() => setFilter('sent')}
            >
              发送
            </button>
            <button 
              className={`filter-btn ${filter === 'received' ? 'active' : ''}`}
              onClick={() => setFilter('received')}
            >
              接收
            </button>
          </div>
          <button 
            className="refresh-btn" 
            onClick={refreshHistory}
            disabled={loading}
            title="刷新交易历史"
          >
            {loading ? '⏳' : '🔄'}
          </button>
        </div>
      </div>

      {loading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : filteredAndSortedTransactions.length === 0 ? (
        renderEmptyState()
      ) : (
        renderTransactionTable()
      )}
    </div>
  );
};

export default ActivityHistory;