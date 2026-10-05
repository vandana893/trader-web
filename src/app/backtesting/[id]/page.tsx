'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BacktestResult, BacktestTrade } from '@/types/backtesting';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, RefreshCw, Download, Info } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { TradeLog } from '@/components/backtesting/TradeLog';
import { DrawdownChart } from '@/components/backtesting/DrawdownChart';

export default function BacktestResultPage() {
  const { id } = useParams();
  const router = useRouter();

  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Trade log state
  const [tradeFilter, setTradeFilter] = useState('All');

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('backtest-history') || '[]');
    const found = history.find((r: BacktestResult) => r.id === id);
    setResult(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div style={{ padding: 'var(--spacing-12)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading simulation results...</div>;
  }

  if (!result) {
    return (
      <div style={{ padding: 'var(--spacing-12)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-4)' }}>Result Not Found</h2>
        <Button variant="primary" onClick={() => router.push('/backtesting')}>Back to Backtesting</Button>
      </div>
    );
  }

  const perf = result.performance!;
  const filteredTrades = result.trades?.filter(t => {
    if (tradeFilter === 'All') return true;
    if (tradeFilter === 'Profit') return t.netPnl > 0;
    if (tradeFilter === 'Loss') return t.netPnl <= 0;
    return true;
  }) || [];

  return (
    <div style={{ padding: 'var(--spacing-4) var(--spacing-8)', maxWidth: '1400px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={() => router.push('/backtesting')} style={{ marginBottom: 'var(--spacing-6)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <ChevronLeft size={20} /> Back to Backtesting
      </Button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-8)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Backtest Results
            </h1>
            <Badge variant="primary">Historical Simulation</Badge>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)' }}>
            Strategy: {result.config.strategyId} • Version: {result.config.version}
          </p>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-1)' }}>
            {result.config.startDate} to {result.config.endDate} • {result.config.instruments.length} Instruments
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="outline" onClick={() => router.push(`/paper-trading?strategyId=${result.config.strategyId}&version=${result.config.version}`)} style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
            Paper Trade This Strategy
          </Button>
          <Button variant="outline" onClick={() => alert('Exporting report... (Mock)')}>
            <Download size={16} style={{ marginRight: '8px' }} /> Export Report
          </Button>
          <Button variant="primary" onClick={() => router.push(`/backtesting?strategyId=${result.config.strategyId}`)}>
            <RefreshCw size={16} style={{ marginRight: '8px' }} /> Run Again
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)', padding: 'var(--spacing-3)', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary-dark)' }}>
        <Info size={16} />
        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
          Past performance is simulated and does not guarantee future results. Slippage and fees are approximated.
        </span>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
        <KpiCard title="Net P&L" value={`₹${perf.netPnl.toLocaleString()}`} change="" changeType={perf.netPnl >= 0 ? 'positive' : 'negative'} />
        <KpiCard title="Win Rate" value={`${perf.winRate}%`} change={`${perf.winningTrades} Wins / ${perf.losingTrades} Losses`} changeType={perf.winRate > 50 ? 'positive' : 'negative'} />
        <KpiCard title="Max Drawdown" value={`${perf.maxDrawdown}%`} change="Peak to trough" changeType="negative" />
        <KpiCard title="Profit Factor" value={perf.profitFactor.toString()} change="Gross Win / Gross Loss" changeType={perf.profitFactor > 1 ? 'positive' : 'negative'} />
        <KpiCard title="Total Trades" value={perf.totalTrades} change="" changeType="neutral" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-8)' }}>
        {/* Equity Curve Mock */}
        <Card tinted style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Equity Curve</h3>
          <div style={{ flex: 1, backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden', padding: 'var(--spacing-4)' }}>
            
            {/* CSS mock line chart */}
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2px', paddingBottom: '20px' }}>
              {result.chartData?.map((pt, i) => {
                const maxVal = Math.max(...(result.chartData?.map(d => d.portfolioValue) || [1]));
                const minVal = Math.min(...(result.chartData?.map(d => d.portfolioValue) || [0]), result.config.startingCapital);
                const range = maxVal - minVal;
                // Avoid divide by zero if range is 0
                const safeRange = range === 0 ? 1 : range;
                const heightPercent = ((pt.portfolioValue - minVal) / safeRange) * 100;
                
                return (
                  <div key={i} className="group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
                    <div style={{ 
                      width: '100%', 
                      height: `${Math.max(5, heightPercent)}%`, 
                      backgroundColor: pt.portfolioValue >= result.config.startingCapital ? 'var(--color-success)' : 'var(--color-danger)', 
                      opacity: 0.6,
                      borderTopLeftRadius: '2px',
                      borderTopRightRadius: '2px',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }} 
                    title={`${pt.date}\nValue: ₹${pt.portfolioValue.toLocaleString()}\nPnL: ₹${pt.pnl}`}
                    />
                  </div>
                );
              })}
            </div>
            <div style={{ position: 'absolute', bottom: '5px', left: '10px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Start: {result.config.startDate}</div>
            <div style={{ position: 'absolute', bottom: '5px', right: '10px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>End: {result.config.endDate}</div>
          </div>
        </Card>

        {/* Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <Card tinted>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-2)', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Gross Profit</span>
                <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>₹{perf.grossPnl > 0 ? perf.grossPnl.toLocaleString() : 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-2)', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Gross Loss</span>
                <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>₹{perf.grossPnl < 0 ? Math.abs(perf.grossPnl).toLocaleString() : 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-2)', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Average Win</span>
                <span style={{ fontWeight: 600 }}>₹{perf.averageWin.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-2)', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Average Loss</span>
                <span style={{ fontWeight: 600 }}>₹{perf.averageLoss.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-2)', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Total Exposure</span>
                <span style={{ fontWeight: 600 }}>₹{perf.totalExposure.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--spacing-2)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Starting Capital</span>
                <span style={{ fontWeight: 600 }}>₹{result.config.startingCapital.toLocaleString()}</span>
              </div>
            </div>
          </Card>
          
          <DrawdownChart data={result.chartData || []} />
        </div>
      </div>

      <TradeLog trades={result.trades || []} />
    </div>
  );
}
