'use client';
import React, { useState } from 'react';
import { Card } from '../ui/Card';

interface PerformanceChartProps {
  data: Record<string, number[]>;
}

const RANGES = ['1D', '1W', '1M', '3M', '1Y'];

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [activeRange, setActiveRange] = useState('1M');

  const chartData = data[activeRange] || [];
  
  // Very basic mock SVG chart line rendering
  const max = Math.max(...chartData, 1);
  const min = Math.min(...chartData, 0);
  const range = max - min;
  
  const points = chartData.map((val, i) => {
    const x = (i / (Math.max(chartData.length - 1, 1))) * 100;
    const y = 100 - (((val - min) / range) * 100);
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>Portfolio Performance</h3>
        
        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-tinted)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
          {RANGES.map(r => (
            <button 
              key={r}
              onClick={() => setActiveRange(r)}
              style={{
                background: activeRange === r ? 'var(--color-surface)' : 'transparent',
                border: 'none',
                padding: 'var(--spacing-1) var(--spacing-3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: activeRange === r ? 600 : 400,
                color: activeRange === r ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                boxShadow: activeRange === r ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ height: '260px', position: 'relative', marginTop: 'var(--spacing-2)' }}>
        {/* Simple SVG Line Chart */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary-light)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-primary-light)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            fill="url(#chartGradient)"
            stroke="none"
            points={`0,100 ${points} 100,100`}
          />
          <polyline
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </Card>
  );
}
