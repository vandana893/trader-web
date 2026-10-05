import React from 'react';
import { BacktestChartDataPoint } from '@/types/backtesting';
import { Card } from '@/components/ui/Card';

interface DrawdownChartProps {
  data: BacktestChartDataPoint[];
}

export function DrawdownChart({ data }: DrawdownChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <Card tinted style={{ minHeight: '250px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Drawdown</h3>
      <div style={{ flex: 1, backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden', padding: 'var(--spacing-4)' }}>
        
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2px', paddingTop: '20px' }}>
          {data.map((pt, i) => {
            const minDrawdown = Math.min(...data.map(d => d.drawdown));
            const range = Math.abs(minDrawdown);
            const safeRange = range === 0 ? 1 : range;
            const heightPercent = (Math.abs(pt.drawdown) / safeRange) * 100;
            
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-start', position: 'relative' }}>
                <div style={{ 
                  width: '100%', 
                  height: `${Math.max(2, heightPercent)}%`, 
                  backgroundColor: 'var(--color-danger)', 
                  opacity: 0.6,
                  borderBottomLeftRadius: '2px',
                  borderBottomRightRadius: '2px',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }} 
                title={`${pt.date}\nDrawdown: ${pt.drawdown.toFixed(2)}%`}
                />
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', top: '5px', left: '10px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>0% (Peak)</div>
        <div style={{ position: 'absolute', bottom: '5px', left: '10px', fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>Max: {Math.min(...data.map(d => d.drawdown)).toFixed(2)}%</div>
      </div>
    </Card>
  );
}
