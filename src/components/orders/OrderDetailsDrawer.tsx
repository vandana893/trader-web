'use client';
import React from 'react';
import { X, ExternalLink, Activity, Info, Clock, CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { Order } from '@/types/orders';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface OrderDetailsDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onViewPosition: (positionId: string) => void;
}

export function OrderDetailsDrawer({ order, isOpen, onClose, onViewPosition }: OrderDetailsDrawerProps) {
  if (!isOpen || !order) return null;

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '450px', backgroundColor: 'var(--color-surface)', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', zIndex: 100, display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease-in-out', transform: isOpen ? 'translateX(0)' : 'translateX(100%)', borderLeft: '1px solid var(--color-border)' }}>
      {/* Header */}
      <div style={{ padding: 'var(--spacing-4) var(--spacing-6)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface-tinted)' }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Order Details</h2>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ padding: 'var(--spacing-6)', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        
        {/* Top Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{order.id}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <Badge variant={order.status === 'FILLED' ? 'success' : order.status === 'CANCELLED' || order.status === 'REJECTED' || order.status === 'FAILED' ? 'danger' : 'warning'}>{order.status}</Badge>
        </div>

        {/* Action / Simulation Warning */}
        <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-warning-bg)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)' }}>
          <AlertTriangle size={18} style={{ color: 'var(--color-warning)', marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-warning)' }}>Frontend Simulation</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)' }}>This order is part of a simulated execution environment ({order.executionMode}). No real funds or broker APIs were used.</div>
          </div>
        </div>

        {/* Instrument Info */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)' }}>Instrument Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Symbol</div>
              <div style={{ fontWeight: 600 }}>{order.instrument}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Exchange</div>
              <div style={{ fontWeight: 600 }}>{order.exchange}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Type</div>
              <div style={{ fontWeight: 600 }}>{order.instrumentType || '-'}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Side</div>
              <div><Badge variant={order.side === 'BUY' ? 'success' : 'danger'}>{order.side}</Badge></div>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)' }}>Order Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Order Type</div>
              <div style={{ fontWeight: 600 }}>{order.orderType}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Total Quantity</div>
              <div style={{ fontWeight: 600 }}>{order.quantity}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Filled / Remaining</div>
              <div style={{ fontWeight: 600 }}>{order.filledQuantity} / {order.quantity - order.filledQuantity}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Requested Price</div>
              <div style={{ fontWeight: 600 }}>{order.price ? `₹${order.price}` : 'MARKET'}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Avg Fill Price</div>
              <div style={{ fontWeight: 600 }}>{order.averageFillPrice ? `₹${order.averageFillPrice}` : '-'}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Updated At</div>
              <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{new Date(order.updatedAt).toLocaleTimeString()}</div>
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
                {order.strategyName || '-'}
                {order.strategyId && <a href={`/strategies/${order.strategyId}`} style={{ color: 'var(--color-primary)' }}><ExternalLink size={12} /></a>}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Version</span>
              <span style={{ fontWeight: 600 }}>{order.strategyVersion || '-'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Deployment</span>
              <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {order.deploymentId || '-'}
                {order.deploymentId && <a href={`/live-trading/${order.deploymentId}`} style={{ color: 'var(--color-primary)' }}><ExternalLink size={12} /></a>}
              </span>
            </div>
          </div>
        </div>

        {/* Related Position */}
        {order.relatedPositionId && (
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)' }}>Related Position</h3>
            <Button variant="outline" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }} onClick={() => onViewPosition(order.relatedPositionId!)}>
              <span>{order.relatedPositionId}</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)' }}>Execution Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            {order.events.map((e, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 'var(--spacing-3)', position: 'relative' }}>
                {idx !== order.events.length - 1 && <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-20px', width: '2px', backgroundColor: 'var(--color-border)' }} />}
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: e.status === 'FILLED' ? 'var(--color-success-bg)' : e.status === 'CANCELLED' || e.status === 'REJECTED' ? 'var(--color-danger-bg)' : 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                  {e.status === 'FILLED' ? <CheckCircle size={12} style={{ color: 'var(--color-success)' }} /> : e.status === 'CANCELLED' || e.status === 'REJECTED' ? <XCircle size={12} style={{ color: 'var(--color-danger)' }} /> : <Clock size={12} style={{ color: 'var(--color-info)' }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{e.status}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{new Date(e.timestamp).toLocaleString()}</div>
                  {e.message && <div style={{ fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>{e.message}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
