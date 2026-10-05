import React from 'react';
import { useRouter } from 'next/navigation';
import { BacktestResult } from '@/types/backtesting';
import { Strategy } from '@/types/strategy';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { History, Play } from 'lucide-react';

interface BacktestHistoryProps {
  history: BacktestResult[];
  strategies: Strategy[];
}

export function BacktestHistory({ history, strategies }: BacktestHistoryProps) {
  const router = useRouter();

  return (
    <Card tinted style={{ flex: 1, minHeight: '500px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)' }}>
        <History size={24} color="var(--color-primary)" />
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600 }}>Recent Backtests</h2>
      </div>

      {history.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--color-text-muted)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
          <Play size={48} style={{ opacity: 0.2, marginBottom: 'var(--spacing-4)' }} />
          <p>No recent backtests.</p>
          <p style={{ fontSize: 'var(--font-size-sm)' }}>Run your first simulation to see results here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {history.map(item => (
            <div 
              key={item.id} 
              onClick={() => router.push(`/backtesting/${item.id}`)}
              style={{ 
                padding: 'var(--spacing-4)', 
                backgroundColor: 'var(--color-background)', 
                border: '1px solid var(--color-border)', 
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                <span style={{ fontWeight: 600 }}>{strategies.find(s => s.id === item.config.strategyId)?.name || 'Strategy'}</span>
                <Badge variant={item.status === 'Completed' ? 'success' : 'warning'}>{item.status}</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>
                <span>{new Date(item.runDate).toLocaleString()}</span>
                <span>v{item.config.version}</span>
              </div>
              {item.performance && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-2)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-border)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Net P&L</div>
                    <div style={{ fontWeight: 600, color: item.performance.netPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      ₹{item.performance.netPnl.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Win Rate</div>
                    <div style={{ fontWeight: 600 }}>{item.performance.winRate}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Trades</div>
                    <div style={{ fontWeight: 600 }}>{item.performance.totalTrades}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
