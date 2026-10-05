import React from 'react';
import { MarketplaceStrategy } from '@/types/marketplace';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, Users, Activity, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function FavHeart({ id }: { id: string }) {
  const [isFav, setIsFav] = useState(false);
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('marketplace-favorites') || '[]');
    setIsFav(favs.includes(id));
    
    // Setup listener to sync favorites across cards on the same page
    const handleStorage = () => {
      const f = JSON.parse(localStorage.getItem('marketplace-favorites') || '[]');
      setIsFav(f.includes(id));
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('marketplace-fav-update', handleStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('marketplace-fav-update', handleStorage);
    };
  }, [id]);

  return <Heart size={18} color={isFav ? "var(--color-danger)" : "var(--color-text-muted)"} fill={isFav ? "var(--color-danger)" : "transparent"} />;
}

interface MarketplaceStrategyCardProps {
  strategy: MarketplaceStrategy;
}

export function MarketplaceStrategyCard({ strategy }: MarketplaceStrategyCardProps) {
  const isPaid = strategy.pricing.type === 'paid';
  
  // Format performance type text nicely
  const getPerfTypeColor = (type: string) => {
    switch(type) {
      case 'live': return 'success';
      case 'paper': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <Card tinted style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 'var(--spacing-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
            {strategy.name}
          </h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
            By {strategy.creator.name}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
          <Badge variant="primary">{strategy.category}</Badge>
          <Badge variant={strategy.riskLevel === 'high' ? 'danger' : strategy.riskLevel === 'medium' ? 'warning' : 'success'}>
            {strategy.riskLevel.charAt(0).toUpperCase() + strategy.riskLevel.slice(1)} Risk
          </Badge>
          <button 
            onClick={(e) => {
              e.preventDefault();
              const favs = JSON.parse(localStorage.getItem('marketplace-favorites') || '[]');
              const isFav = favs.includes(strategy.id);
              if (isFav) {
                localStorage.setItem('marketplace-favorites', JSON.stringify(favs.filter((id: string) => id !== strategy.id)));
              } else {
                localStorage.setItem('marketplace-favorites', JSON.stringify([...favs, strategy.id]));
              }
              window.dispatchEvent(new Event('marketplace-fav-update'));
            }}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0
            }}
          >
            <FavHeart id={strategy.id} />
          </button>
        </div>
      </div>

      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', flex: 1 }}>
        {strategy.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
        {strategy.supportedInstruments.slice(0, 3).map(inst => (
          <span key={inst} style={{ fontSize: 'var(--font-size-xs)', padding: '2px 6px', backgroundColor: 'var(--color-background)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
            {inst}
          </span>
        ))}
        {strategy.supportedInstruments.length > 3 && (
          <span style={{ fontSize: 'var(--font-size-xs)', padding: '2px 6px', backgroundColor: 'var(--color-background)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
            +{strategy.supportedInstruments.length - 3}
          </span>
        )}
      </div>

      <div style={{ backgroundColor: 'var(--color-background)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Performance
          </span>
          <Badge variant={getPerfTypeColor(strategy.performance.type)}>
            {strategy.performance.type.toUpperCase()}
          </Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-2)' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Return</div>
            <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: strategy.performance.returnPercent >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {strategy.performance.returnPercent >= 0 ? '+' : ''}{strategy.performance.returnPercent}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Win Rate</div>
            <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {strategy.performance.winRate}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Max DD</div>
            <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--color-danger)' }}>
              {strategy.performance.maxDrawdown}%
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} color="#f59e0b" fill="#f59e0b" /> {strategy.rating}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {strategy.subscribers}</span>
        </div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {isPaid ? `₹${strategy.pricing.amount} / ${strategy.pricing.period}` : 'Free'}
        </div>
      </div>

      <div style={{ marginTop: 'var(--spacing-2)' }}>
        <Link href={`/marketplace/${strategy.id}`} style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ width: '100%' }}>View Strategy</Button>
        </Link>
      </div>
    </Card>
  );
}
