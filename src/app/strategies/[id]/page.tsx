'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Strategy, StrategyStatus } from '@/types/strategy';
import mockData from '@/data/mock/strategies.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StrategyStatusBadge, StrategyModeBadge } from '@/components/strategies/StrategyStatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ChevronLeft } from 'lucide-react';

export default function StrategyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    description: string;
    confirmLabel: string;
    variant: 'primary' | 'warning' | 'danger';
    onConfirm: () => void;
  }>({
    title: '', description: '', confirmLabel: '', variant: 'primary', onConfirm: () => {}
  });

  useEffect(() => {
    const saved = localStorage.getItem('my-strategies-list');
    let strategies: Strategy[] = [];
    if (saved) {
      strategies = JSON.parse(saved);
    } else {
      strategies = mockData.strategies as Strategy[];
      localStorage.setItem('my-strategies-list', JSON.stringify(strategies));
    }
    const found = strategies.find(s => s.id === id);
    setStrategy(found || null);
    setLoading(false);
  }, [id]);

  const updateStrategyStatus = (newStatus: StrategyStatus) => {
    if (!strategy) return;
    const updatedStrategy = { ...strategy, status: newStatus, lastUpdated: new Date().toISOString() };
    setStrategy(updatedStrategy);
    
    // Sync with local storage list
    const saved = JSON.parse(localStorage.getItem('my-strategies-list') || '[]');
    const updatedList = saved.map((s: Strategy) => s.id === id ? updatedStrategy : s);
    localStorage.setItem('my-strategies-list', JSON.stringify(updatedList));
  };

  const handleDuplicate = () => {
    if (!strategy) return;
    const newStrategy: Strategy = {
      ...strategy,
      id: `strategy-${Date.now()}`,
      name: `${strategy.name} Copy`,
      status: 'draft',
      pnl: 0,
      pnlPercent: 0,
      totalTrades: 0,
      winRate: 0,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    const saved = JSON.parse(localStorage.getItem('my-strategies-list') || '[]');
    localStorage.setItem('my-strategies-list', JSON.stringify([newStrategy, ...saved]));
    router.push(`/strategies/${newStrategy.id}`);
  };

  const handleAction = (action: string) => {
    switch(action) {
      case 'edit':
        router.push(`/strategies/builder?strategyId=${strategy?.id}`);
        break;
      case 'duplicate':
        handleDuplicate();
        break;
      case 'pause':
        setModalConfig({
          title: 'Pause Strategy',
          description: `Are you sure you want to pause "${strategy?.name}"? It will stop executing trades immediately.`,
          confirmLabel: 'Pause Strategy',
          variant: 'warning',
          onConfirm: () => { updateStrategyStatus('paused'); setModalOpen(false); }
        });
        setModalOpen(true);
        break;
      case 'resume':
        setModalConfig({
          title: 'Resume Strategy',
          description: `Are you sure you want to resume "${strategy?.name}"? It will start executing trades according to its mode.`,
          confirmLabel: 'Resume Strategy',
          variant: 'primary',
          onConfirm: () => { updateStrategyStatus('running'); setModalOpen(false); }
        });
        setModalOpen(true);
        break;
      case 'stop':
        setModalConfig({
          title: 'Stop Strategy',
          description: `Are you sure you want to stop the simulated strategy "${strategy?.name}"? This action cannot be easily undone.`,
          confirmLabel: 'Stop Strategy',
          variant: 'danger',
          onConfirm: () => { updateStrategyStatus('stopped'); setModalOpen(false); }
        });
        setModalOpen(true);
        break;
      case 'deployLive':
        router.push(`/live-trading?strategyId=${strategy?.id}`);
        break;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-8)' }}>
        <div style={{ width: '150px', height: '24px', backgroundColor: 'var(--color-surface)', borderRadius: '4px', marginBottom: 'var(--spacing-8)' }} />
        <Card tinted style={{ height: '300px' }} />
      </div>
    );
  }

  if (!strategy) {
    return (
      <div style={{ padding: 'var(--spacing-12)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-2)' }}>Strategy not found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>
          The requested strategy could not be found.
        </p>
        <Button variant="primary" onClick={() => router.push('/strategies')}>Back to Strategies</Button>
      </div>
    );
  }

  // Determine available actions based on BRD
  const getActionButtons = () => {
    switch (strategy.status) {
      case 'draft':
        return (
          <>
            <Button variant="primary" onClick={() => handleAction('edit')}>Edit Strategy</Button>
            <Button variant="outline" onClick={() => handleAction('duplicate')}>Duplicate</Button>
            <Button variant="outline" onClick={() => handleAction('deployLive')}>Deploy Live</Button>
          </>
        );
      case 'running':
        return (
          <>
            <Button variant="outline" onClick={() => handleAction('deployLive')}>Deploy Live</Button>
            <Button variant="outline" onClick={() => handleAction('pause')}>Pause</Button>
            <Button variant="outline" onClick={() => handleAction('duplicate')}>Duplicate</Button>
            <Button variant="outline" onClick={() => handleAction('stop')} style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>Stop</Button>
          </>
        );
      case 'paused':
        return (
          <>
            <Button variant="outline" onClick={() => handleAction('deployLive')}>Deploy Live</Button>
            <Button variant="primary" onClick={() => handleAction('resume')}>Resume</Button>
            <Button variant="outline" onClick={() => handleAction('duplicate')}>Duplicate</Button>
            <Button variant="outline" onClick={() => handleAction('stop')} style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>Stop</Button>
          </>
        );
      case 'stopped':
        return (
          <>
            <Button variant="outline" onClick={() => handleAction('deployLive')}>Deploy Live</Button>
            <Button variant="outline" onClick={() => handleAction('duplicate')}>Duplicate</Button>
          </>
        );
      default:
        return null;
    }
  };

  const getLinks = () => (
    <>
      <Button variant="outline" onClick={() => router.push(`/orders?strategyId=${strategy.id}`)}>View Orders</Button>
      <Button variant="outline" onClick={() => router.push(`/positions?strategyId=${strategy.id}`)}>View Positions</Button>
    </>
  );

  return (
    <div style={{ padding: 'var(--spacing-4) var(--spacing-8)' }}>
      <Button variant="ghost" onClick={() => router.push('/strategies')} style={{ marginBottom: 'var(--spacing-6)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <ChevronLeft size={20} /> Back to Strategies
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-8)' }}>
        <div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
            Strategies / {strategy.name}
          </div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            {strategy.name}
            <StrategyStatusBadge status={strategy.status} />
            <StrategyModeBadge mode={strategy.mode} />
          </h1>
          <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)' }}>
            {strategy.description}
          </p>
          <div style={{ marginTop: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            Version v{strategy.version}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '600px' }}>
          <Button variant="outline" onClick={() => router.push(`/paper-trading?strategyId=${strategy.id}`)} style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
            Start Paper Trading
          </Button>
          <Button variant="primary" onClick={() => router.push(`/backtesting?strategyId=${strategy.id}`)}>
            Run Backtest
          </Button>
          {getLinks()}
          <div style={{ width: '1px', backgroundColor: 'var(--color-border)', margin: '0 var(--spacing-2)' }} />
          {getActionButtons()}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-6)' }}>
        {strategy.status !== 'draft' && (
          <Card tinted>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>P&L</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: strategy.pnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {strategy.pnl >= 0 ? '+' : ''}₹{strategy.pnl.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>P&L %</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: strategy.pnlPercent >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {strategy.pnlPercent >= 0 ? '+' : ''}{strategy.pnlPercent}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Win Rate</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {strategy.winRate}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Total Trades</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {strategy.totalTrades}
                </div>
              </div>
            </div>
          </Card>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
          <Card tinted>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Strategy Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Category</span>
                <span style={{ fontWeight: 500 }}>{strategy.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Status</span>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{strategy.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Mode</span>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{strategy.mode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Version</span>
                <span style={{ fontWeight: 500 }}>v{strategy.version}</span>
              </div>
            </div>
          </Card>

          <Card tinted>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Created On</span>
                <span style={{ fontWeight: 500 }}>{new Date(strategy.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Last Updated</span>
                <span style={{ fontWeight: 500 }}>{new Date(strategy.lastUpdated).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card tinted>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Configured Instruments</h3>
          {strategy.instruments.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>No instruments configured.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
              {strategy.instruments.map(inst => (
                <div key={inst} style={{ padding: 'var(--spacing-2) var(--spacing-4)', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                  {inst}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalConfig.title}
        description={modalConfig.description}
        confirmLabel={modalConfig.confirmLabel}
        variant={modalConfig.variant}
        onConfirm={modalConfig.onConfirm}
      />
    </div>
  );
}
