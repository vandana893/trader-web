'use client';
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, AlertTriangle, ShieldAlert, Activity, RefreshCw, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { DeploymentWizard } from '@/components/live-trading/DeploymentWizard';
import { LiveDeployment } from '@/types/liveTrading';
import mockDeployments from '@/data/mock/live-trading/deployments.json';
import { useRouter, useSearchParams } from 'next/navigation';

function LiveTradingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillStrategyId = searchParams?.get('strategyId') || undefined;
  const prefillVersion = searchParams?.get('version') || undefined;

  const [deployments, setDeployments] = useState<LiveDeployment[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(!!prefillStrategyId);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('live_deployments');
    if (saved) {
      setDeployments(JSON.parse(saved));
    } else {
      setDeployments(mockDeployments as LiveDeployment[]);
      localStorage.setItem('live_deployments', JSON.stringify(mockDeployments));
    }
  }, []);

  const activeStrategies = deployments.filter(d => ['RUNNING', 'PAUSED'].includes(d.status));
  const historyStrategies = deployments.filter(d => d.status === 'STOPPED');

  const filteredHistory = historyStrategies.filter(d => 
    d.strategyName.toLowerCase().includes(search.toLowerCase()) || 
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  const handlePause = (id: string) => {
    if (confirm("Pause Live Strategy?\nPausing will prevent the strategy from generating new orders until resumed.")) {
      const updated = deployments.map(d => d.id === id ? { ...d, status: 'PAUSED' as const } : d);
      setDeployments(updated);
      localStorage.setItem('live_deployments', JSON.stringify(updated));
    }
  };

  const handleResume = (id: string) => {
    if (confirm("Resume Live Strategy?\nEnsure broker and risk settings are correct.")) {
      const updated = deployments.map(d => d.id === id ? { ...d, status: 'RUNNING' as const } : d);
      setDeployments(updated);
      localStorage.setItem('live_deployments', JSON.stringify(updated));
    }
  };

  const handleStop = (id: string) => {
    if (confirm("Stop Live Strategy?\nStopping this deployment will stop the strategy from generating new orders.")) {
      const updated = deployments.map(d => d.id === id ? { ...d, status: 'STOPPED' as const } : d);
      setDeployments(updated);
      localStorage.setItem('live_deployments', JSON.stringify(updated));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4) var(--spacing-8)' }}>
      
      {/* Safety Banner */}
      <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
        <ShieldAlert size={20} style={{ color: 'var(--color-warning)' }} />
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-warning)' }}>
          <strong>Live Trading:</strong> Strategies in this section are configured for live execution. Always verify broker, capital and risk settings before deployment. Note: This is currently a simulated frontend representation.
        </p>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Live Trading
            </h1>
            <Badge variant="danger" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={12} /> LIVE TRADING
            </Badge>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Manage deployed strategies and monitor live execution. Live execution requires a connected broker and valid deployment configuration.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw size={16} style={{ marginRight: '8px' }} /> Refresh
          </Button>
          <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
            Deploy Strategy
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
        <KpiCard title="Live Deployments" value={deployments.length.toString()} theme="strategy" />
        <KpiCard title="Active Strategies" value={activeStrategies.length.toString()} theme="strategy" />
        <KpiCard title="Today's P&L" value="+₹1,250" changeType="positive" theme="strategy" />
        <KpiCard title="Overall P&L" value="+₹17,780" changeType="positive" theme="strategy" />
        <KpiCard title="Open Positions" value="2" theme="strategy" />
        <KpiCard title="Orders Today" value="18" theme="strategy" />
        <KpiCard title="Broker Status" value="1 Connected" theme="strategy" />
        <KpiCard title="Risk Status" value="Normal" theme="strategy" />
      </div>

      {/* Active Live Strategies */}
      <div>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-4)' }}>Active Live Strategies</h2>
        
        {activeStrategies.length === 0 ? (
          <Card style={{ padding: 'var(--spacing-12)', textAlign: 'center' }}>
            <Activity size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto var(--spacing-4)' }} />
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>No active live strategies</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>Deploy a validated strategy to start monitoring live execution.</p>
            <Button variant="primary" onClick={() => setIsWizardOpen(true)}>Deploy Strategy</Button>
          </Card>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-tinted)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase' }}>
                  <th style={{ padding: 'var(--spacing-4)' }}>Strategy</th>
                  <th style={{ padding: 'var(--spacing-4)' }}>Broker</th>
                  <th style={{ padding: 'var(--spacing-4)' }}>Capital</th>
                  <th style={{ padding: 'var(--spacing-4)' }}>Today P&L</th>
                  <th style={{ padding: 'var(--spacing-4)' }}>Status</th>
                  <th style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeStrategies.map(dep => (
                  <tr key={dep.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--spacing-4)' }}>
                      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{dep.strategyName}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{dep.id} • {dep.version}</div>
                    </td>
                    <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                      <div style={{ fontWeight: 500 }}>{dep.brokerName}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{dep.accountId}</div>
                    </td>
                    <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>₹{dep.initialCapital.toLocaleString()}</td>
                    <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', fontWeight: 700, color: dep.todayPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {dep.todayPnl >= 0 ? '+' : ''}₹{Math.abs(dep.todayPnl).toLocaleString()}
                    </td>
                    <td style={{ padding: 'var(--spacing-4)' }}>
                      <Badge variant={dep.status === 'RUNNING' ? 'success' : 'warning'}>{dep.status}</Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'flex-end' }}>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/live-trading/${dep.id}`)}>View</Button>
                        {dep.status === 'RUNNING' && <Button variant="outline" size="sm" onClick={() => handlePause(dep.id)} style={{ color: 'var(--color-warning)', borderColor: 'var(--color-warning)' }}>Pause</Button>}
                        {dep.status === 'PAUSED' && <Button variant="outline" size="sm" onClick={() => handleResume(dep.id)} style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)' }}>Resume</Button>}
                        <Button variant="outline" size="sm" onClick={() => handleStop(dep.id)} style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>Stop</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deployment History */}
      <div style={{ marginTop: 'var(--spacing-4)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-4)' }}>Deployment History</h2>
        <Card style={{ padding: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)' }}>
             <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-background)', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-md)' }}>
               <Search size={16} style={{ color: 'var(--color-text-muted)', marginRight: '8px' }} />
               <input type="text" placeholder="Search history..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }} />
             </div>
             <Button variant="outline" size="sm">
               <Filter size={14} style={{ marginRight: '6px' }} /> Filters
             </Button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface-tinted)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase' }}>
                  <th style={{ padding: 'var(--spacing-4)' }}>Deployment ID</th>
                  <th style={{ padding: 'var(--spacing-4)' }}>Strategy</th>
                  <th style={{ padding: 'var(--spacing-4)' }}>Broker</th>
                  <th style={{ padding: 'var(--spacing-4)' }}>Start Date</th>
                  <th style={{ padding: 'var(--spacing-4)' }}>End Date</th>
                  <th style={{ padding: 'var(--spacing-4)' }}>P&L</th>
                  <th style={{ padding: 'var(--spacing-4)' }}>Status</th>
                  <th style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                   <tr>
                     <td colSpan={8} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No historical deployments found.</td>
                   </tr>
                ) : filteredHistory.map(dep => (
                  <tr key={dep.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{dep.id}</td>
                    <td style={{ padding: 'var(--spacing-4)' }}>
                      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{dep.strategyName}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{dep.version}</div>
                    </td>
                    <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>{dep.brokerName}</td>
                    <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>{new Date(dep.startedAt).toLocaleDateString()}</td>
                    <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>{dep.endedAt ? new Date(dep.endedAt).toLocaleDateString() : '-'}</td>
                    <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', fontWeight: 700, color: dep.totalPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {dep.totalPnl >= 0 ? '+' : ''}₹{Math.abs(dep.totalPnl).toLocaleString()}
                    </td>
                    <td style={{ padding: 'var(--spacing-4)' }}>
                      <Badge variant="neutral">{dep.status}</Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/live-trading/${dep.id}`)}>View</Button>
                        <Button variant="outline" size="sm" onClick={() => setIsWizardOpen(true)}>Redeploy</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <DeploymentWizard 
        isOpen={isWizardOpen} 
        onClose={() => {
          setIsWizardOpen(false);
          if (prefillStrategyId) {
             router.replace('/live-trading');
          }
        }} 
        initialStrategyId={prefillStrategyId}
        initialVersion={prefillVersion}
        onDeploy={(dep) => {
          const updated = [dep, ...deployments];
          setDeployments(updated);
          localStorage.setItem('live_deployments', JSON.stringify(updated));
          router.push(`/live-trading/${dep.id}`);
        }} 
      />

    </div>
  );
}

export default function LiveTradingPage() {
  return (
    <React.Suspense fallback={<div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>Loading Live Trading...</div>}>
      <LiveTradingContent />
    </React.Suspense>
  );
}