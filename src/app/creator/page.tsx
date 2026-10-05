'use client';
import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RefreshCw, Download, Search, Settings, Users, BarChart2, DollarSign, LifeBuoy, FileCode2, ExternalLink, Activity, Target, Plus, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { KpiCard } from '@/components/dashboard/KpiCard';

import creatorDataRaw from '@/data/mock/creator.json';
import { CreatorStrategy, CreatorSubscriber, CreatorPerformance, CreatorRevenue, SupportTicket, CreatorTab, StrategyVersion } from '@/types/creator';

const mockData = {
  strategies: creatorDataRaw.strategies as CreatorStrategy[],
  subscribers: creatorDataRaw.subscribers as CreatorSubscriber[],
  performance: creatorDataRaw.performance as CreatorPerformance[],
  revenue: creatorDataRaw.revenue as CreatorRevenue[],
  support: creatorDataRaw.support as SupportTicket[]
};

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

function CreatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams?.get('tab') as CreatorTab) || 'overview';

  const [search, setSearch] = useState('');

  const handleTabChange = (tab: CreatorTab) => {
    setSearch('');
    router.push(`/creator?tab=${tab}`);
  };

  const handleRefresh = () => {
    alert('FRONTEND SIMULATION: Creator data refreshed.');
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview': return <OverviewTab />;
      case 'strategies': return <MyStrategiesTab search={search} router={router} />;
      case 'subscribers': return <SubscribersTab search={search} router={router} />;
      case 'performance': return <PerformanceTab search={search} router={router} />;
      case 'revenue': return <RevenueTab search={search} router={router} />;
      case 'support': return <SupportTab search={search} router={router} />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4) var(--spacing-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Creator Console</h1>
            <Badge variant="warning" style={{ fontSize: 'var(--font-size-xs)' }}>SIMULATED DATA</Badge>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Create, publish and manage your trading strategies, subscribers and creator performance.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Last updated: Just now</span>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw size={16} style={{ marginRight: '8px' }} /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => router.push('/builder')}>
            <Plus size={16} style={{ marginRight: '8px' }} /> Create Strategy
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', overflowX: 'auto', gap: 'var(--spacing-6)' }}>
        <TabButton active={activeTab === 'overview'} onClick={() => handleTabChange('overview')} icon={<Activity size={16} />}>Overview</TabButton>
        <TabButton active={activeTab === 'strategies'} onClick={() => handleTabChange('strategies')} icon={<FileCode2 size={16} />}>My Strategies</TabButton>
        <TabButton active={activeTab === 'subscribers'} onClick={() => handleTabChange('subscribers')} icon={<Users size={16} />}>Subscribers</TabButton>
        <TabButton active={activeTab === 'performance'} onClick={() => handleTabChange('performance')} icon={<Target size={16} />}>Performance</TabButton>
        <TabButton active={activeTab === 'revenue'} onClick={() => handleTabChange('revenue')} icon={<DollarSign size={16} />}>Revenue</TabButton>
        <TabButton active={activeTab === 'support'} onClick={() => handleTabChange('support')} icon={<LifeBuoy size={16} />}>Support</TabButton>
      </div>

      {/* Search Toolbar (except overview) */}
      {activeTab !== 'overview' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', outline: 'none' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

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

// ----------------------------------------------------------------------
// 1. Overview Tab
// ----------------------------------------------------------------------
function OverviewTab() {
  const totalStrats = mockData.strategies.length;
  const published = mockData.strategies.filter(s => s.status === 'PUBLISHED').length;
  const draft = mockData.strategies.filter(s => s.status === 'DRAFT').length;
  const activeSubs = mockData.subscribers.filter(s => s.subscriptionStatus === 'ACTIVE').length;
  const totalRev = mockData.revenue.filter(r => r.status === 'SUCCESS').reduce((sum, r) => sum + r.amount, 0);

  const recentSubs = [...mockData.subscribers].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).slice(0, 3);
  const recentRev = [...mockData.revenue].filter(r => r.status === 'SUCCESS').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
        <KpiCard title="Total Revenue" value={`₹${totalRev.toLocaleString()}`} theme="strategy" />
        <KpiCard title="Active Subscribers" value={activeSubs.toString()} theme="strategy" />
        <KpiCard title="Total Strategies" value={totalStrats.toString()} theme="strategy" />
        <KpiCard title="Published Strategies" value={published.toString()} theme="strategy" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-6)' }}>
        {/* Recent Subscribers Section */}
        <Card style={{ padding: 'var(--spacing-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Recent Subscribers</h3>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {recentSubs.map((sub, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-tinted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{sub.subscriberReference}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{sub.strategyName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{sub.plan}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{sub.startDate}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Revenue Section */}
        <Card style={{ padding: 'var(--spacing-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Recent Revenue</h3>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {recentRev.map((rev, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-tinted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{rev.paymentReference}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{rev.strategyName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-success)' }}>+₹{rev.amount}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{new Date(rev.date).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. My Strategies Tab
// ----------------------------------------------------------------------
function MyStrategiesTab({ search, router }: { search: string, router: any }) {
  const filtered = useMemo(() => {
    return mockData.strategies.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const handleExport = () => {
    if (filtered.length === 0) return;
    const headers = ['ID,Name,Category,Status,Price,Subscribers'];
    const rows = filtered.map(s => `${s.id},${s.name},${s.category},${s.status},${s.price},${s.subscribers}`);
    const csv = headers.concat(rows).join('\n');
    downloadCSV(csv, 'creator_strategies.csv');
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
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Strategy / ID</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Category</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Status / Version</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Pricing</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Subscribers</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.name}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{s.id}</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>{s.category}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <Badge variant={s.status === 'PUBLISHED' ? 'success' : s.status === 'DRAFT' ? 'default' : 'warning'} style={{ fontSize: '10px' }}>{s.status}</Badge>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>Version {s.currentVersion}</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>₹{s.price}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{s.pricingModel}</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>{s.subscribers}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/strategies/${s.id}`)}>View</Button>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/builder`)}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => alert('FRONTEND SIMULATION: Version drawer opened.')}>Versions</Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No strategies found.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. Subscribers Tab
// ----------------------------------------------------------------------
function SubscribersTab({ search, router }: { search: string, router: any }) {
  const filtered = useMemo(() => {
    return mockData.subscribers.filter(s => s.subscriberReference.toLowerCase().includes(search.toLowerCase()) || s.strategyName.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const handleExport = () => {
    if (filtered.length === 0) return;
    const headers = ['SubscriberRef,Strategy,AssignedVersion,PublishedVersion,Status,Plan'];
    const rows = filtered.map(s => `${s.subscriberReference},${s.strategyName},${s.assignedVersion},${s.publishedVersion},${s.subscriptionStatus},${s.plan}`);
    const csv = headers.concat(rows).join('\n');
    downloadCSV(csv, 'subscribers.csv');
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
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Subscriber Ref</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Strategy</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Version Match</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Plan / Amount</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const versionMismatch = s.assignedVersion !== s.publishedVersion;
              return (
                <tr key={s.subscriberReference} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.subscriberReference}</td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                    <div style={{ color: 'var(--color-text-primary)' }}>{s.strategyName}</div>
                  </td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                    <div style={{ color: 'var(--color-text-primary)' }}>Assigned: {s.assignedVersion}</div>
                    {versionMismatch && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)' }}>Published: {s.publishedVersion}</div>}
                  </td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                    <div style={{ color: 'var(--color-text-primary)' }}>{s.plan}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>₹{s.amount}</div>
                  </td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                    <Badge variant={s.subscriptionStatus === 'ACTIVE' ? 'success' : s.subscriptionStatus === 'EXPIRED' ? 'warning' : 'default'} style={{ fontSize: '10px' }}>{s.subscriptionStatus}</Badge>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No subscribers found.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. Performance Tab
// ----------------------------------------------------------------------
function PerformanceTab({ search }: { search: string, router: any }) {
  const filtered = useMemo(() => {
    return mockData.performance.filter(p => p.strategyName.toLowerCase().includes(search.toLowerCase()) || p.strategyId.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-tinted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          <strong>DISCLAIMER:</strong> Past simulated performance does not guarantee future results. Backtests and paper trades are hypothetical.
        </p>
      </div>

      <Card style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Strategy</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Source</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Total P&L</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Win Rate</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Max DD</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{p.strategyName}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{p.version} | {p.dateRange}</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <Badge variant={p.performanceType === 'LIVE_SIMULATION' ? 'success' : 'default'} style={{ fontSize: '10px' }}>{p.performanceType}</Badge>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ fontWeight: 600, color: p.totalPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{p.totalPnl >= 0 ? '+' : ''}₹{p.totalPnl.toLocaleString()}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: p.totalPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{p.pnlPercentage.toFixed(2)}%</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>
                  {p.winRate.toFixed(2)}% ({p.winningTrades}/{p.totalTrades})
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-danger)' }}>
                  {p.maxDrawdown}%
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No performance data available.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. Revenue Tab
// ----------------------------------------------------------------------
function RevenueTab({ search }: { search: string, router: any }) {
  const filtered = useMemo(() => {
    return mockData.revenue.filter(r => r.paymentReference.toLowerCase().includes(search.toLowerCase()) || r.strategyName.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <Card style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Payment Ref</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Date</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Strategy</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Amount</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.paymentReference} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.paymentReference}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>{new Date(r.date).toLocaleDateString()}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ color: 'var(--color-text-primary)' }}>{r.strategyName}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{r.plan}</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>{r.amount} {r.currency}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <Badge variant={r.status === 'SUCCESS' ? 'success' : r.status === 'REFUNDED' ? 'warning' : 'danger'} style={{ fontSize: '10px' }}>{r.status}</Badge>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No revenue records found.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ----------------------------------------------------------------------
// 6. Support Tab
// ----------------------------------------------------------------------
function SupportTab({ search }: { search: string, router: any }) {
  const filtered = useMemo(() => {
    return mockData.support.filter(t => t.ticketId.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()) || t.strategyName.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <Card style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Ticket ID</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Subject / Strategy</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Subscriber</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Priority</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.ticketId} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{t.ticketId}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ color: 'var(--color-text-primary)' }}>{t.subject}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{t.strategyName}</div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>{t.subscriberReference}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <Badge variant={t.priority === 'HIGH' ? 'danger' : 'default'} style={{ fontSize: '10px' }}>{t.priority}</Badge>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <Badge variant={t.status === 'RESOLVED' ? 'success' : t.status === 'OPEN' ? 'warning' : 'default'} style={{ fontSize: '10px' }}>{t.status}</Badge>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                  <Button variant="outline" size="sm" onClick={() => alert('FRONTEND SIMULATION: Support ticket drawer opened.')}>View Ticket</Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No support tickets found.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function CreatorPage() {
  return (
    <div style={{ height: '100%' }}>
      <Suspense fallback={<div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading Creator Console...</div>}>
        <CreatorContent />
      </Suspense>
    </div>
  );
}