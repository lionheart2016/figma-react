import React from 'react'
import { useTranslation } from 'react-i18next'

function TransactionHistory() {
  const { t } = useTranslation()
  // 模拟交易历史数据
  const transactions = [
    {
      id: 1,
      type: 'buy',
      token: 'ETH',
      amount: '0.5',
      price: '2800.00',
      total: '1400.00',
      status: 'completed',
      timestamp: '2024-01-15 14:30:25',
      txHash: '0x1a2b3c4d5e6f...'
    },
    {
      id: 2,
      type: 'sell',
      token: 'BTC',
      amount: '0.1',
      price: '42150.00',
      total: '4215.00',
      status: 'completed',
      timestamp: '2024-01-14 09:15:42',
      txHash: '0x2b3c4d5e6f7a...'
    },
    {
      id: 3,
      type: 'buy',
      token: 'USDT',
      amount: '1000',
      price: '1.00',
      total: '1000.00',
      status: 'pending',
      timestamp: '2024-01-15 16:45:18',
      txHash: '0x3c4d5e6f7a8b...'
    },
    {
      id: 4,
      type: 'sell',
      token: 'BNB',
      amount: '5',
      price: '320.00',
      total: '1600.00',
      status: 'failed',
      timestamp: '2024-01-13 11:20:33',
      txHash: '0x4d5e6f7a8b9c...'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-[#10b981] bg-[#10b981]/10'
      case 'pending':
        return 'text-[#f59e0b] bg-[#f59e0b]/10'
      case 'failed':
        return 'text-[#ef4444] bg-[#ef4444]/10'
      default:
        return 'text-[#73798B] bg-[#73798B]/10'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return t('transactionHistory.statusCompleted')
      case 'pending':
        return t('transactionHistory.statusPending')
      case 'failed':
        return t('transactionHistory.statusFailed')
      default:
        return t('transactionHistory.statusUnknown')
    }
  }

  const getTypeText = (type) => {
    return type === 'buy' ? t('transactionHistory.typeBuy') : t('transactionHistory.typeSell')
  }

  const getTypeColor = (type) => {
    return type === 'buy' ? 'text-[#10b981]' : 'text-[#ef4444]'
  }

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-[#1c1c1c]">{t('transactionHistory.title')}</h2>
        <button className="text-[#4B5EF5] hover:text-[#3A4BE5] text-xs sm:text-sm font-medium transition-colors">
          {t('transactionHistory.viewAll')}
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-3 sm:p-4 border border-[#E5E7EB] rounded-xl hover:border-[#D1D5DB] transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className={`text-xs sm:text-sm font-medium ${getTypeColor(transaction.type)}`}>
                  {getTypeText(transaction.type)}
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#1c1c1c]">{transaction.token}</span>
              </div>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                {getStatusText(transaction.status)}
              </span>
            </div>

            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-[#73798B]">{t('transactionHistory.amount')}</span>
                <span className="font-medium text-[#1c1c1c]">{transaction.amount} {transaction.token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#73798B]">{t('transactionHistory.price')}</span>
                <span className="font-medium text-[#1c1c1c]">{transaction.price} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#73798B]">{t('transactionHistory.total')}</span>
                <span className="font-medium text-[#1c1c1c]">{transaction.total} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#73798B]">{t('transactionHistory.time')}</span>
                <span className="text-[#73798B] text-xs">{transaction.timestamp}</span>
              </div>
            </div>

            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#F0F2F5]">
              <button className="text-[#4B5EF5] hover:text-[#3A4BE5] text-xs font-medium transition-colors">
                {t('transactionHistory.viewDetails')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-6 sm:py-8">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#D1D5DB] mx-auto mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-[#73798B] text-xs sm:text-sm">{t('transactionHistory.noTransactions')}</p>
        </div>
      )}
    </div>
  )
}

export default TransactionHistory