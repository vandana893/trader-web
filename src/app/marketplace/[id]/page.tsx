'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MarketplaceStrategy } from '@/types/marketplace';
import mockData from '@/data/mock/marketplace.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, Star, Users, Info, ShieldAlert } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function MarketplaceStrategyDetails() {
  const { id } = useParams();
  const router = useRouter();
  
  const strategy = (mockData.strategies as MarketplaceStrategy[]).find(s => s.id === id);
  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    // Load subscription status from local state
    const subscriptions = JSON.parse(localStorage.getItem('marketplace-subscriptions') || '[]');
    setIsSubscribed(subscriptions.includes(id));
  }, [id]);

  if (!strategy) {
    return (
      <div style={{ padding: 'var(--spacing-12)', textAlign: 'center' }}>
        <h2>Strategy not found</h2>
        <Button variant="outline" onClick={() => router.push('/marketplace')} style={{ marginTop: 'var(--spacing-4)' }}>Back to Marketplace</Button>
      </div>
    );
  }

  const isPaid = strategy.pricing.type === 'paid';

  const handleSubscribe = () => {
    const subscriptions = JSON.parse(localStorage.getItem('marketplace-subscriptions') || '[]');
    if (!subscriptions.includes(id)) {
      subscriptions.push(id);
      localStorage.setItem('marketplace-subscriptions', JSON.stringify(subscriptions));
    }
    setIsSubscribed(true);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 'var(--spacing-4) var(--spacing-8)' }}>
      <Button variant="ghost" onClick={() => router.push('/marketplace')} style={{ marginBottom: 'var(--spacing-6)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <ChevronLeft size={20} /> Back to Marketplace
      </Button>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-8)' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <Card tinted>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{strategy.name}</h1>
                <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>Version {strategy.version} • Published on {new Date(strategy.publishedAt).toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Badge variant="primary">{strategy.category}</Badge>
                <Badge variant={strategy.riskLevel === 'high' ? 'danger' : strategy.riskLevel === 'medium' ? 'warning' : 'success'}>
                  {strategy.riskLevel.charAt(0).toUpperCase() + strategy.riskLevel.slice(1)} Risk
                </Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-6)', lineHeight: 1.6 }}>
              {strategy.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
              {strategy.tags.map(tag => (
                <span key={tag} style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-6)' }}>
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Supported Instruments</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
                {strategy.supportedInstruments.map(inst => (
                  <div key={inst} style={{ padding: 'var(--spacing-2) var(--spacing-4)', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                    {inst}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card tinted>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600 }}>Performance Metrics</h3>
              <Badge variant={strategy.performance.type === 'live' ? 'success' : strategy.performance.type === 'paper' ? 'warning' : 'neutral'}>
                {strategy.performance.type.toUpperCase()} RESULTS
              </Badge>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-6)' }}>
              <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-1)' }}>Return</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: strategy.performance.returnPercent >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {strategy.performance.returnPercent >= 0 ? '+' : ''}{strategy.performance.returnPercent}%
                </div>
              </div>
              <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-1)' }}>Win Rate</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {strategy.performance.winRate}%
                </div>
              </div>
              <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-1)' }}>Max Drawdown</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-danger)' }}>
                  {strategy.performance.maxDrawdown}%
                </div>
              </div>
              <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-1)' }}>Total Trades</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {strategy.performance.totalTrades}
                </div>
              </div>
            </div>
            
            {strategy.performance.chartData && (
              <div style={{ marginTop: 'var(--spacing-6)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                [ Chart Visualization Prototype ]
                {/* A real implementation would use recharts or similar here mapped to strategy.performance.chartData */}
              </div>
            )}

          </Card>
          
          <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: 'var(--spacing-3)' }}>
            <ShieldAlert color="var(--color-danger)" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-danger)', marginBottom: '4px' }}>Risk Disclosure</h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Past {strategy.performance.type} performance does not guarantee future results. Trading involves significant risk and losses can occur. The metrics displayed are simulated and should be evaluated carefully before deploying capital.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <Card tinted>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-border)', margin: '0 auto var(--spacing-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                {strategy.creator.name.charAt(0)}
              </div>
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{strategy.creator.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={16} color="#f59e0b" fill="#f59e0b" /> {strategy.rating}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={16} /> {strategy.subscribers}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', margin: 'var(--spacing-4) 0' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Access</span>
              <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                {isPaid ? `₹${strategy.pricing.amount} / ${strategy.pricing.period}` : 'Free'}
              </span>
            </div>

            {isSubscribed ? (
              <Button variant="outline" style={{ width: '100%', pointerEvents: 'none' }}>
                ✓ Subscribed
              </Button>
            ) : (
              <Button variant="primary" style={{ width: '100%' }} onClick={() => setModalOpen(true)}>
                {isPaid ? 'Subscribe Now' : 'Add to My Strategies'}
              </Button>
            )}
            
            {isSubscribed && (
              <Button variant="ghost" href="/strategies" style={{ width: '100%', marginTop: 'var(--spacing-2)' }}>
                View in My Strategies
              </Button>
            )}
          </Card>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isPaid ? `Subscribe to ${strategy.name}` : `Add ${strategy.name}`}
        description="Review strategy access details before proceeding."
        confirmLabel={isPaid ? 'Confirm Subscription' : 'Add to Portfolio'}
        onConfirm={handleSubscribe}
      >
        <div style={{ marginTop: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-2)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Plan</span>
            <span style={{ fontWeight: 600 }}>{isPaid ? strategy.pricing.period : 'Lifetime'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-2)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Price</span>
            <span style={{ fontWeight: 600 }}>{isPaid ? `₹${strategy.pricing.amount}` : 'Free'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Performance Type</span>
            <span style={{ fontWeight: 600 }}>{strategy.performance.type}</span>
          </div>
          <p style={{ marginTop: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            This is a frontend simulated prototype. No actual charges will be made.
          </p>
        </div>
      </Modal>
    </div>
  );
}
