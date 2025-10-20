import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../Layout';
import TradeMain from './TradeMain';
import TradeDetail from './TradeDetail';

const TradeView = () => {
  return (
    <Routes>
      <Route 
        index 
        element={
          <Layout activeMenu="trade" pageTitle="tradeMain.title" breadcrumbItems={['sidebar.dashboard', 'sidebar.trade']}>
            <TradeMain />
          </Layout>
        } 
      />
      <Route 
        path=":id" 
        element={
          <Layout activeMenu="trade" pageTitle="tradeDetail.title" breadcrumbItems={['sidebar.dashboard', 'sidebar.trade', 'tradeDetail.product']}>
            <TradeDetail />
          </Layout>
        } 
      />
      <Route path="*" element={<Navigate to="/trade" replace />} />
    </Routes>
  );
};

export default TradeView;