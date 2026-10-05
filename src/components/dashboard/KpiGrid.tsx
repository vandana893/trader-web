import React from 'react';
import { KpiCard } from './KpiCard';

interface KpiGridProps {
  summary: any;
}

export function KpiGrid({ summary }: KpiGridProps) {
  if (!summary) return null;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
      gap: 'var(--spacing-4)', 
      marginBottom: 'var(--spacing-6)' 
    }}>
      <KpiCard
        title="Total Portfolio Value"
        value={`$${summary.portfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
        change={`${summary.overallPnlPercent}%`}
        changeType={summary.overallPnlPercent >= 0 ? 'positive' : 'negative'}
      />
      <KpiCard
        title="Today's P&L"
        value={`${summary.todayPnl >= 0 ? '+' : ''}$${summary.todayPnl.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
        change={`${summary.todayPnlPercent}%`}
        changeType={summary.todayPnlPercent >= 0 ? 'positive' : 'negative'}
      />
      <KpiCard
        title="Active Strategies"
        value={summary.activeStrategies}
        subtitle={`${summary.runningStrategies} Running · ${summary.pausedStrategies} Paused`}
      />
      <KpiCard
        title="Open Positions"
        value={summary.openPositions}
        subtitle={`${summary.profitablePositions} Profitable · ${summary.negativePositions} Negative`}
      />
    </div>
  );
}
