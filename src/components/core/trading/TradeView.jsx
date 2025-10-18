import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../Layout';
import './TradeView.css';

const TradeView = () => {
  const { t } = useTranslation();

  return (
    <Layout activeMenu="trade" pageTitle="sidebar.trade" breadcrumbItems={['sidebar.dashboard', 'sidebar.trade']}>
      {/* Trade Cards */}
      <div className="trade-cards">
        <div className="trade-card">
          <div className="card-header">
            <h3 className="card-title">{t('trade.buyCrypto')}</h3>
            <span className="card-subtitle">{t('trade.buyCryptoSubtitle')}</span>
          </div>
          <div className="card-content">
            <p>{t('trade.buyCryptoDescription')}</p>
          </div>
        </div>

        <div className="trade-card">
          <div className="card-header">
            <h3 className="card-title">{t('trade.sellCrypto')}</h3>
            <span className="card-subtitle">{t('trade.sellCryptoSubtitle')}</span>
          </div>
          <div className="card-content">
            <p>{t('trade.sellCryptoDescription')}</p>
          </div>
        </div>

        <div className="trade-card">
          <div className="card-header">
            <h3 className="card-title">{t('trade.swap')}</h3>
            <span className="card-subtitle">{t('trade.swapSubtitle')}</span>
          </div>
          <div className="card-content">
            <p>{t('trade.swapDescription')}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TradeView;