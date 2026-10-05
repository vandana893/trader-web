import React from 'react';
import { Card } from '../ui/Card';

export function PortfolioOverview({ summary }: { summary: any }) {
  if (!summary) return null;

  return (
    <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)', color: 'var(--color-text-primary)' }}>Portfolio Overview</h3>
      
      <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-1)' }}>Total Value</div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, marginBottom: 'var(--spacing-4)' }}>
            ${summary.portfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>Today's change</div>
              <div style={{ color: summary.todayPnlPercent >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                {summary.todayPnlPercent >= 0 ? '+' : ''}{summary.todayPnlPercent}%
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>Overall return</div>
              <div style={{ color: summary.overallPnlPercent >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                {summary.overallPnlPercent >= 0 ? '+' : ''}{summary.overallPnlPercent}%
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: '1px', backgroundColor: 'var(--color-border)', alignSelf: 'stretch' }} />

        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>Asset Allocation</div>
          
          {/* Mock allocation bar */}
          <div style={{ display: 'flex', height: '12px', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 'var(--spacing-3)' }}>
            <div style={{ width: '45%', backgroundColor: 'var(--color-primary)' }} title="Equity: 45%" />
            <div style={{ width: '25%', backgroundColor: 'var(--color-blue-light)' }} title="Crypto: 25%" />
            <div style={{ width: '20%', backgroundColor: 'var(--color-info)' }} title="Cash: 20%" />
            <div style={{ width: '10%', backgroundColor: 'var(--color-neutral)' }} title="Other: 10%" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}/> Equity 45%</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-blue-light)' }}/> Crypto 25%</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-info)' }}/> Cash 20%</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-neutral)' }}/> Other 10%</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
