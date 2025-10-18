import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';
import Layout from '../Layout';

function Reports() {
  const { t } = useTranslation();
  const { user, logout } = usePrivy();

  // 模拟报告数据
  const reports = [
    {
      id: 1,
      title: t('reports.monthlyTradeReport'),
      period: t('reports.january2024'),
      type: t('reports.monthly'),
      status: 'completed',
      generatedAt: '2024-01-31 23:59:59',
      downloadUrl: '#'
    },
    {
      id: 2,
      title: t('reports.portfolioAnalysis'),
      period: t('reports.q12024'),
      type: t('reports.quarterly'),
      status: 'completed',
      generatedAt: '2024-03-31 23:59:59',
      downloadUrl: '#'
    },
    {
      id: 3,
      title: t('reports.riskAssessment'),
      period: t('reports.h12024'),
      type: t('reports.semiAnnual'),
      status: 'inProgress',
      generatedAt: '2024-06-30 23:59:59',
      downloadUrl: '#'
    },
    {
      id: 4,
      title: t('reports.taxReport'),
      period: t('reports.fy2023'),
      type: t('reports.annual'),
      status: 'pending',
      generatedAt: '2024-12-31 23:59:59',
      downloadUrl: '#'
    }
  ];

  const statistics = {
    totalTrades: 156,
    totalVolume: '$245,678.90',
    profitLoss: '+$12,345.67',
    successRate: '78.2%'
  };

  return (
    <Layout activeMenu="reports" pageTitle="reports.title" breadcrumbItems={['sidebar.dashboard', 'sidebar.reports']}>
      <div className="reports-content">
        <div className="mb-6 sm:mb-8">
          <p className="text-sm sm:text-base text-[#73798B]">
            {t('reports.description')}
          </p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#73798B]">{t('reports.totalTrades')}</p>
                <p className="text-2xl font-bold text-[#1c1c1c]">{statistics.totalTrades}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#73798B]">{t('reports.totalVolume')}</p>
                <p className="text-2xl font-bold text-[#1c1c1c]">{statistics.totalVolume}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#73798B]">{t('reports.profitLoss')}</p>
                <p className="text-2xl font-bold text-green-600">{statistics.profitLoss}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#73798B]">{t('reports.successRate')}</p>
                <p className="text-2xl font-bold text-[#1c1c1c]">{statistics.successRate}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 报告列表 */}
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1c1c1c] mb-6">{t('reports.availableReports')}</h2>
            <button className="btn btn-primary">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {t('reports.generateNewReport')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8EAED]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#73798B]">{t('reports.reportName')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#73798B]">{t('reports.period')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#73798B]">{t('reports.type')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#73798B]">{t('reports.status')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#73798B]">{t('reports.generatedAt')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#73798B]">{t('reports.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-[#E8EAED] hover:bg-[#F8FAFF]">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-[#1c1c1c]">{report.title}</p>
                        <p className="text-xs text-[#73798B]">ID: {report.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#1c1c1c]">{report.period}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {report.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'completed' ? 'bg-green-100 text-green-800' :
                        report.status === 'inProgress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status === 'completed' ? t('reports.statusCompleted') :
                         report.status === 'inProgress' ? t('reports.statusInProgress') :
                         t('reports.statusPending')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#73798B]">{report.generatedAt}</td>
                    <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {report.status === 'completed' && (
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              {t('reports.download')}
                            </button>
                          )}
                          <button className="text-[#73798B] hover:text-[#1c1c1c] text-sm">
                            {t('reports.preview')}
                          </button>
                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 报告类型说明 */}
        <div className="mt-6 sm:mt-8">
          <div className="card p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-[#1c1c1c] mb-4">{t('reports.reportTypes')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-[#1c1c1c] mb-2">{t('reports.monthlyReport')}</h4>
                <p className="text-sm text-[#73798B]">
                  {t('reports.monthlyReportDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-[#1c1c1c] mb-2">{t('reports.quarterlyReport')}</h4>
                <p className="text-sm text-[#73798B]">
                  {t('reports.quarterlyReportDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-[#1c1c1c] mb-2">{t('reports.annualReport')}</h4>
                <p className="text-sm text-[#73798B]">
                  {t('reports.annualReportDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-[#1c1c1c] mb-2">{t('reports.customReport')}</h4>
                <p className="text-sm text-[#73798B]">
                  {t('reports.customReportDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Reports;