'use client';
import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KpiGrid } from '@/components/dashboard/KpiGrid';
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { ActiveStrategies } from '@/components/dashboard/ActiveStrategies';
import { OpenPositions } from '@/components/dashboard/OpenPositions';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { BrokerStatus } from '@/components/dashboard/BrokerStatus';
import { DashboardAlerts } from '@/components/dashboard/DashboardAlerts';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

// In a real app, this would be fetched via an API call
import mockData from '@/data/mock/dashboard.json';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadData = () => {
    setData(mockData);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <DashboardHeader onRefresh={loadData} lastUpdated={lastUpdated} />
      
      <KpiGrid summary={data.summary} />
      
      <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap' }}>
        <PortfolioOverview summary={data.summary} />
        <PerformanceChart data={data.performance} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-6)' }}>
        <ActiveStrategies strategies={data.strategies} />
        <OpenPositions positions={data.positions} />
      </div>

      <RecentOrders orders={data.orders} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
        <BrokerStatus brokers={data.brokers} />
        <DashboardAlerts initialAlerts={data.alerts} />
      </div>
    </div>
  );
}