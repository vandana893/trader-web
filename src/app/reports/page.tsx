'use client';
import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RefreshCw, Download, Search, FileText, ChevronRight, X, ExternalLink, TrendingUp, Calendar, Box, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { KpiCard } from '@/components/dashboard/KpiCard';

import reportsDataRaw from '@/data/mock/reports.json';
import { DailyPnlReport, MonthlyPnlReport, StrategyPerformanceReport, ExecutionReport, SubscriptionReport, ReportType } from '@/types/reports';

const mockData = {
  dailyPnl: reportsDataRaw.dailyPnl as DailyPnlReport[],
  monthlyPnl: reportsDataRaw.monthlyPnl as MonthlyPnlReport[],
  strategyPerformance: reportsDataRaw.strategyPerformance as StrategyPerformanceReport[],
  execution: reportsDataRaw.execution as ExecutionReport[],
  subscriptions: reportsDataRaw.subscriptions as SubscriptionReport[]
};

function ReportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams?.get('type') as ReportType) || 'daily-pnl';

  const [search, setSearch] = useState('');

  const handleTabChange = (type: ReportType) => {
    setSearch('');
    router.push(`/reports?type=${type}`);
  };

  const handleRefresh = () => {
    alert('FRONTEND SIMULATION: Report data refreshed.');
  };

  // Switch rendering based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'daily-pnl': return <DailyPnlTab search={search} />;
      case 'monthly-pnl': return <MonthlyPnlTab search={search} />;
      case 'strategy-performance': return <StrategyPerformanceTab search={search} router={router} />;
      case 'execution': return <ExecutionTab search={search} router={router} />;
      case 'subscriptions': return <SubscriptionsTab search={search} router={router} />;
      default: return <DailyPnlTab search={search} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4) var(--spacing-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Reports</h1>
            <Badge variant="warning" style={{ fontSize: 'var(--font-size-xs)' }}>SIMULATED DATA</Badge>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            View daily and monthly P&L, strategy performance, execution and subscription reports.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Last updated: Just now</span>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw size={16} style={{ marginRight: '8px' }} /> Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', overflowX: 'auto', gap: 'var(--spacing-6)' }}>
        <TabButton active={activeTab === 'daily-pnl'} onClick={() => handleTabChange('daily-pnl')} icon={<Calendar size={16} />}>Daily P&L</TabButton>
        <TabButton active={activeTab === 'monthly-pnl'} onClick={() => handleTabChange('monthly-pnl')} icon={<Box size={16} />}>Monthly P&L</TabButton>
        <TabButton active={activeTab === 'strategy-performance'} onClick={() => handleTabChange('strategy-performance')} icon={<TrendingUp size={16} />}>Strategy Performance</TabButton>
        <TabButton active={activeTab === 'execution'} onClick={() => handleTabChange('execution')} icon={<Activity size={16} />}>Execution</TabButton>
        <TabButton active={activeTab === 'subscriptions'} onClick={() => handleTabChange('subscriptions')} icon={<FileText size={16} />}>Subscriptions</TabButton>
      </div>

      {/* Toolbar & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: '250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search report..." 
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', outline: 'none' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {renderTabContent()}

    </div>
  );
}

function TabButton({ active, onClick, children, icon }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: 'var(--spacing-3) 0',
        backgroundColor: 'transparent', border: 'none', borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent',
        color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        fontWeight: active ? 600 : 500, fontSize: 'var(--font-size-sm)', cursor: 'pointer', whiteSpace: 'nowrap'
      }}
    >
      {icon} {children}
    </button>
  );
}

// -------------------------------------------------------------
// Daily P&L Tab
// -------------------------------------------------------------
function DailyPnlTab({ search }: { search: string }) {
  const filtered = useMemo(() => {
    return mockData.dailyPnl.filter(r => r.date.includes(search));
  }, [search]);

  const totalPnl = filtered.reduce((s, r) => s + r.totalPnl, 0);
  const winDays = filtered.filter(r => r.totalPnl >= 0).length;

  const handleExport = () => {
    if (filtered.length === 0) return;
    const headers = ['Date,Opening Value,Closing Value,Invested Capital,Realized PnL,Unrealized PnL,Total PnL,PnL %,Trades,Wins,Losses'];
    const rows = filtered.map(r => `${r.date},${r.openingPortfolioValue},${r.closingPortfolioValue},${r.investedCapital},${r.realizedPnl},${r.unrealizedPnl},${r.totalPnl},${r.pnlPercentage},${r.numberOfTrades},${r.winningTrades},${r.losingTrades}`);
    const csv = headers.concat(rows).join('\n');
    downloadCSV(csv, 'daily_pnl.csv');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outline" size="sm" onClick={handleExport}><Download size={16} style={{ marginRight: '8px' }} /> Export CSV</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
        <KpiCard title="Total Selected P&L" value={`₹${totalPnl.toLocaleString()}`} theme="strategy" changeType={totalPnl >= 0 ? 'positive':'negative'} />
        <KpiCard title="Winning Days" value={winDays.toString()} theme="strategy" />
        <KpiCard title="Losing Days" value={(filtered.length - winDays).toString()} theme="strategy" />
      </div>
      <Card style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Date</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Invested</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Realized</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Unrealized</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Total P&L</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>{r.date}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>₹{r.investedCapital.toLocaleString()}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: r.realizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.realizedPnl >= 0 ? '+' : ''}₹{r.realizedPnl.toLocaleString()}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: r.unrealizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.unrealizedPnl >= 0 ? '+' : ''}₹{r.unrealizedPnl.toLocaleString()}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ fontWeight: 600, color: r.totalPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.totalPnl >= 0 ? '+' : ''}₹{r.totalPnl.toLocaleString()}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: r.totalPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.pnlPercentage.toFixed(2)}%</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>
                  {r.numberOfTrades > 0 ? ((r.winningTrades / r.numberOfTrades) * 100).toFixed(1) + '%' : '0%'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No reports match your filters.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------
// Monthly P&L Tab
// -------------------------------------------------------------
function MonthlyPnlTab({ search }: { search: string }) {
  const filtered = useMemo(() => mockData.monthlyPnl.filter(r => r.month.toLowerCase().includes(search.toLowerCase())), [search]);
  const totalPnl = filtered.reduce((s, r) => s + r.totalPnl, 0);

  const handleExport = () => {
    if (filtered.length === 0) return;
    const headers = ['Month,Invested Capital,Total PnL,PnL %,Trades,Wins'];
    const rows = filtered.map(r => `${r.month},${r.investedCapital},${r.totalPnl},${r.pnlPercentage},${r.numberOfTrades},${r.winningTrades}`);
    const csv = headers.concat(rows).join('\n');
    downloadCSV(csv, 'monthly_pnl.csv');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outline" size="sm" onClick={handleExport}><Download size={16} style={{ marginRight: '8px' }} /> Export CSV</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
        <KpiCard title="YTD P&L" value={`₹${totalPnl.toLocaleString()}`} theme="strategy" changeType={totalPnl >= 0 ? 'positive':'negative'} />
        <KpiCard title="Avg Win Rate" value={(filtered.reduce((s, r) => s + r.winRate, 0) / (filtered.length || 1)).toFixed(2) + '%'} theme="strategy" />
      </div>
      <Card style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Month</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Opening Value</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Closing Value</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Total P&L</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>{r.month}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>₹{r.openingPortfolioValue.toLocaleString()}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>₹{r.closingPortfolioValue.toLocaleString()}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ fontWeight: 600, color: r.totalPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.totalPnl >= 0 ? '+' : ''}₹{r.totalPnl.toLocaleString()}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: r.totalPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.pnlPercentage.toFixed(2)}%</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>{r.winRate.toFixed(2)}%</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No reports match your filters.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------
// Strategy Performance Tab
// -------------------------------------------------------------
function StrategyPerformanceTab({ search, router }: { search: string, router: any }) {
  const filtered = useMemo(() => mockData.strategyPerformance.filter(r => r.strategyName.toLowerCase().includes(search.toLowerCase()) || r.strategyId.toLowerCase().includes(search.toLowerCase())), [search]);
  
  const handleExport = () => {
    if (filtered.length === 0) return;
    const headers = ['Strategy,ID,Trades,WinRate,Realized PnL,Unrealized PnL,Total PnL,Avg Trade,ExecutionMode'];
    const rows = filtered.map(r => `${r.strategyName},${r.strategyId},${r.totalTrades},${r.winRate},${r.realizedPnl},${r.unrealizedPnl},${r.totalPnl},${r.averageTradePnl},${r.executionMode}`);
    const csv = headers.concat(rows).join('\n');
    downloadCSV(csv, 'strategy_performance.csv');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outline" size="sm" onClick={handleExport}><Download size={16} style={{ marginRight: '8px' }} /> Export CSV</Button>
      </div>
      <Card style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Strategy</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Trades (Win %)</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Avg Trade</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Total P&L</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.strategyId} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.strategyName}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{r.strategyId}</div>
                  <Badge variant="default" style={{ fontSize: '10px', marginTop: '4px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>{r.executionMode}</Badge>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>
                  <div>{r.totalTrades} Total</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{r.winRate.toFixed(2)}% Win</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: r.averageTradePnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.averageTradePnl >= 0 ? '+' : ''}₹{r.averageTradePnl.toLocaleString()}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ fontWeight: 600, color: r.totalPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.totalPnl >= 0 ? '+' : ''}₹{r.totalPnl.toLocaleString()}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: r.totalPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.pnlPercentage.toFixed(2)}%</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/strategies/${r.strategyId}`)}>View Strategy</Button>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/positions?strategyId=${r.strategyId}`)}>View Positions</Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No reports match your filters.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------
// Execution Report Tab
// -------------------------------------------------------------
function ExecutionTab({ search, router }: { search: string, router: any }) {
  const filtered = useMemo(() => mockData.execution.filter(r => r.orderId.toLowerCase().includes(search.toLowerCase()) || r.instrument.toLowerCase().includes(search.toLowerCase()) || r.strategyName.toLowerCase().includes(search.toLowerCase())), [search]);
  
  const handleExport = () => {
    if (filtered.length === 0) return;
    const headers = ['OrderID,PositionID,Strategy,Instrument,Side,Type,Qty,Price,Status,ExecutionMode,Submitted,Result'];
    const rows = filtered.map(r => `${r.orderId},${r.positionId},${r.strategyName},${r.instrument},${r.side},${r.orderType},${r.quantity},${r.price},${r.status},${r.executionMode},${r.submittedAt},${r.executionResult}`);
    const csv = headers.concat(rows).join('\n');
    downloadCSV(csv, 'execution_report.csv');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outline" size="sm" onClick={handleExport}><Download size={16} style={{ marginRight: '8px' }} /> Export CSV</Button>
      </div>
      <Card style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Order ID / Time</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Instrument</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Side / Qty</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Price</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.orderId} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.orderId}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{new Date(r.submittedAt).toLocaleString()}</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.instrument}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{r.strategyName}</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ fontWeight: 600, color: r.side === 'BUY' ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.side}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{r.quantity} ({r.orderType})</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>₹{r.price.toLocaleString()}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <Badge variant={r.status === 'FILLED' ? 'success' : r.status === 'CANCELLED' ? 'danger' : 'default'} style={{ fontSize: '10px' }}>{r.status}</Badge>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/orders?orderId=${r.orderId}`)}>View Order <ExternalLink size={14} style={{ marginLeft: '6px' }} /></Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No reports match your filters.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------
// Subscriptions Report Tab
// -------------------------------------------------------------
function SubscriptionsTab({ search, router }: { search: string, router: any }) {
  const filtered = useMemo(() => mockData.subscriptions.filter(r => r.subscriptionId.toLowerCase().includes(search.toLowerCase()) || r.strategyName.toLowerCase().includes(search.toLowerCase()) || r.paymentReference.toLowerCase().includes(search.toLowerCase())), [search]);
  
  const handleExport = () => {
    if (filtered.length === 0) return;
    const headers = ['SubscriptionID,Strategy,SubscriberRef,Plan,PaymentRef,Status,Start,End,Amount,Currency'];
    const rows = filtered.map(r => `${r.subscriptionId},${r.strategyName},${r.subscriberReference},${r.plan},${r.paymentReference},${r.status},${r.startDate},${r.endDate},${r.amount},${r.currency}`);
    const csv = headers.concat(rows).join('\n');
    downloadCSV(csv, 'subscriptions_report.csv');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outline" size="sm" onClick={handleExport}><Download size={16} style={{ marginRight: '8px' }} /> Export CSV</Button>
      </div>
      <Card style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Subscription ID</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Strategy / Plan</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Amount</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Period</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.subscriptionId} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.subscriptionId}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Ref: {r.paymentReference}</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.strategyName}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{r.plan} Plan</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>{r.amount} {r.currency}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ color: 'var(--color-text-primary)' }}>{r.startDate} to</div>
                  <div style={{ color: 'var(--color-text-primary)' }}>{r.endDate}</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <Badge variant={r.status === 'ACTIVE' ? 'success' : r.status === 'EXPIRED' ? 'warning' : 'default'} style={{ fontSize: '10px' }}>{r.status}</Badge>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/strategies/${r.strategyId}`)}>View Strategy <ExternalLink size={14} style={{ marginLeft: '6px' }} /></Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No reports match your filters.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------
// Utils
// -------------------------------------------------------------
function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

export default function ReportsPage() {
  return (
    <div style={{ height: '100%' }}>
      <Suspense fallback={<div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading Reports...</div>}>
        <ReportsContent />
      </Suspense>
    </div>
  );
}