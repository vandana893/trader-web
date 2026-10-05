'use client';
import React from 'react';
import { X, ExternalLink, ArrowRight, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Position } from '@/types/positions';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface PositionDetailsDrawerProps {
  position: Position | null;
  isOpen: boolean;
  onClose: () => void;
  onViewOrder: (orderId: string) => void;
}

export function PositionDetailsDrawer({ position, isOpen, onClose, onViewOrder }: PositionDetailsDrawerProps) {
  if (!isOpen || !position) return null;

  const isProfit = position.unrealizedPnl >= 0 || position.realizedPnl >= 0;

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '450px', backgroundColor: 'var(--color-surface)', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', zIndex: 100, display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease-in-out', transform: isOpen ? 'translateX(0)' : 'translateX(100%)', borderLeft: '1px solid var(--color-border)' }}>
      {/* Header */}
      <div style={{ padding: 'var(--spacing-4) var(--spacing-6)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface-tinted)' }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Position Details</h2>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ padding: 'var(--spacing-6)', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        
        {/* Top Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{position.instrument}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{position.id}</div>
          </div>
          <Badge variant={position.status === 'OPEN' ? 'success' : 'neutral'}>{position.status}</Badge>
        </div>

        {/* P&L Snapshot */}
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: `1px solid ${isProfit ? 'var(--color-success)' : 'var(--color-danger)'}` }}>
           <div style={{ flex: 1 }}>
             <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Unrealized P&L</div>
             <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: position.unrealizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)', display: 'flex', alignItems: 'center' }}>
               {position.unrealizedPnl >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
               ₹{Math.abs(position.unrealizedPnl).toLocaleString()}
             </div>
           </div>
           <div style={{ width: '1px', backgroundColor: 'var(--color-border)' }} />
           <div style={{ flex: 1 }}>
             <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Realized P&L</div>
             <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: position.realizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
               {position.realizedPnl >= 0 ? '+' : '-'}₹{Math.abs(position.realizedPnl).toLocaleString()}
             </div>
           </div>
        </div>

        {/* Mock Chart Area */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)' }}>Simulated P&L Visualization</h3>
          <div style={{ width: '100%', height: '120px', backgroundColor: 'var(--color-surface-tinted)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Mock Price Path</span>
          </div>
        </div>

        {/* Summary */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)' }}>Position Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Side</div>
              <div><Badge variant={position.side === 'LONG' ? 'success' : 'danger'}>{position.side}</Badge></div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Quantity</div>
              <div style={{ fontWeight: 600 }}>{position.quantity}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Avg Entry Price</div>
              <div style={{ fontWeight: 600 }}>₹{position.averageEntryPrice}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Current Price</div>
              <div style={{ fontWeight: 600 }}>₹{position.currentPrice}</div>
            </div>
            {position.status === 'CLOSED' && (
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Exit Price</div>
                <div style={{ fontWeight: 600 }}>₹{position.exitPrice}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Invested Value</div>
              <div style={{ fontWeight: 600 }}>₹{position.investedValue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Strategy Info */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)' }}>Strategy Attribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Strategy</span>
              <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {position.strategyName || '-'}
                {position.strategyId && <a href={`/strategies/${position.strategyId}`} style={{ color: 'var(--color-primary)' }}><ExternalLink size={12} /></a>}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Deployment</span>
              <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {position.deploymentId || '-'}
                {position.deploymentId && <a href={`/live-trading/${position.deploymentId}`} style={{ color: 'var(--color-primary)' }}><ExternalLink size={12} /></a>}
              </span>
            </div>
          </div>
        </div>

        {/* Related Orders */}
        {position.relatedOrderIds.length > 0 && (
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)' }}>Related Orders</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {position.relatedOrderIds.map(oid => (
                <Button key={oid} variant="outline" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }} onClick={() => onViewOrder(oid)}>
                  <span>{oid}</span>
                  <ArrowRight size={16} />
                </Button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
