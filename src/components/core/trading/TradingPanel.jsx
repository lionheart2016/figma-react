import React, { useState } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { useTranslation } from 'react-i18next'

function TradingPanel() {
  const { t } = useTranslation()
  const { wallets } = useWallets()
  const isConnected = !!wallets[0]
  const [activeTab, setActiveTab] = useState('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [selectedToken, setSelectedToken] = useState('ETH')

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', price: '2,800.50' },
    { symbol: 'BTC', name: 'Bitcoin', price: '42,150.75' },
    { symbol: 'USDT', name: 'Tether', price: '1.00' },
    { symbol: 'BNB', name: 'Binance Coin', price: '320.25' },
  ]

  const handleTrade = () => {
    if (!isConnected) {
      alert(t('trade.connectWalletFirst'))
      return
    }
    
    if (!amount || !price) {
      alert(t('trade.enterAmountAndPrice'))
      return
    }

    const tradeType = activeTab === 'buy' ? t('trade.buy') : t('trade.sell')
    alert(`${tradeType} ${amount} ${selectedToken}，${t('trade.price')} ${price} USD`)
    
    // 这里应该调用实际的交易合约
    setAmount('')
    setPrice('')
  }

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-base sm:text-lg font-semibold text-[#1c1c1c]">{t('trade.tradingPanel')}</h2>
        <div className="flex space-x-1 bg-[#F8FAFF] rounded-xl p-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('buy')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex-1 sm:flex-none ${
              activeTab === 'buy' 
                ? 'bg-white text-[#4B5EF5] shadow-sm' 
                : 'text-[#73798B] hover:text-[#1c1c1c]'
            }`}
          >
            {t('trade.buy')}
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex-1 sm:flex-none ${
              activeTab === 'sell' 
                ? 'bg-white text-[#4B5EF5] shadow-sm' 
                : 'text-[#73798B] hover:text-[#1c1c1c]'
            }`}
          >
            {t('trade.sell')}
          </button>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* 代币选择 */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-[#73798B] mb-1 sm:mb-2 block">{t('trade.selectToken')}</label>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
            {tokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => setSelectedToken(token.symbol)}
                className={`p-2 sm:p-3 rounded-xl border transition-all duration-200 ${
                  selectedToken === token.symbol
                    ? 'border-[#4B5EF5] bg-[#4B5EF5]/10'
                    : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="icon-container icon-container-primary w-6 h-6 sm:w-8 sm:h-8">
                    <span className="text-xs font-medium">{token.symbol[0]}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-[#1c1c1c] text-xs sm:text-sm">{token.symbol}</div>
                    <div className="text-[#73798B] text-xs">{token.name}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 交易数量 */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-[#73798B] mb-1 sm:mb-2 block">
            {activeTab === 'buy' ? `${t('trade.buy')} ${t('trade.amount')}` : `${t('trade.sell')} ${t('trade.amount')}`}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input-field pr-16 sm:pr-20 text-sm sm:text-base"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs sm:text-sm font-medium text-[#73798B]">{selectedToken}</span>
            </div>
          </div>
        </div>

        {/* 价格 */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-[#73798B] mb-1 sm:mb-2 block">{t('trade.price')} (USD)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="input-field text-sm sm:text-base"
          />
        </div>

        {/* 交易信息 */}
        {amount && price && (
          <div className="p-3 sm:p-4 bg-[#F8FAFF] rounded-xl border border-[#F0F2F5]">
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-[#73798B]">{t('trade.tradeType')}</span>
                <span className="font-medium text-[#1c1c1c]">
                  {activeTab === 'buy' ? t('trade.buy') : t('trade.sell')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#73798B]">{t('trade.amount')}</span>
                <span className="font-medium text-[#1c1c1c]">{amount} {selectedToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#73798B]">{t('trade.price')}</span>
                <span className="font-medium text-[#1c1c1c]">{price} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#73798B]">{t('trade.totalAmount')}</span>
                <span className="font-medium text-[#1c1c1c]">
                  {(parseFloat(amount) * parseFloat(price) || 0).toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 交易按钮 */}
        <button
          onClick={handleTrade}
          disabled={!isConnected}
          className={`w-full py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
            isConnected
              ? activeTab === 'buy'
                ? 'bg-[#10b981] hover:bg-[#059669] text-white'
                : 'bg-[#ef4444] hover:bg-[#dc2626] text-white'
              : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
          }`}
        >
          {!isConnected ? t('trade.connectWalletFirst') : activeTab === 'buy' ? t('trade.confirmBuy') : t('trade.confirmSell')}
        </button>
      </div>
    </div>
  )
}

export default TradingPanel