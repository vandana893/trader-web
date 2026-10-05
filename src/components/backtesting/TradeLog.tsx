import React, { useState } from 'react';
import { BacktestTrade } from '@/types/backtesting';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface TradeLogProps {
  trades: BacktestTrade[];
}

export function TradeLog({ trades }: TradeLogProps) {
  const [tradeFilter, setTradeFilter] = useState('All');
  const [selectedTrade, setSelectedTrade] = useState<BacktestTrade | null>(null);

  const filteredTrades = trades.filter(t => {
    if (tradeFilter === 'All') return true;
    if (tradeFilter === 'Profit') return t.netPnl > 0;
    if (tradeFilter === 'Loss') return t.netPnl <= 0;
    return true;
  });

  return (
    <Card tinted>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600 }}>Trade Log</h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant={tradeFilter === 'All' ? 'primary' : 'outline'} size="sm" onClick={() => setTradeFilter('All')}>All</Button>
          <Button variant={tradeFilter === 'Profit' ? 'primary' : 'outline'} size="sm" onClick={() => setTradeFilter('Profit')}>Profit</Button>
          <Button variant={tradeFilter === 'Loss' ? 'primary' : 'outline'} size="sm" onClick={() => setTradeFilter('Loss')}>Loss</Button>
        </div>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              <th style={{ padding: 'var(--spacing-3)' }}>Trade #</th>
              <th style={{ padding: 'var(--spacing-3)' }}>Entry Time</th>
              <th style={{ padding: 'var(--spacing-3)' }}>Instrument</th>
              <th style={{ padding: 'var(--spacing-3)' }}>Side</th>
              <th style={{ padding: 'var(--spacing-3)' }}>Qty</th>
              <th style={{ padding: 'var(--spacing-3)' }}>Entry Price</th>
              <th style={{ padding: 'var(--spacing-3)' }}>Exit Price</th>
              <th style={{ padding: 'var(--spacing-3)' }}>Net P&L</th>
              <th style={{ padding: 'var(--spacing-3)' }}>Exit Reason</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map(t => (
              <tr 
                key={t.id} 
                onClick={() => setSelectedTrade(t)}
                style={{ borderBottom: '1px solid var(--color-border)', fontSize: 'var(--font-size-sm)', cursor: 'pointer' }} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'} 
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: 'var(--spacing-3)' }}>{t.tradeNumber}</td>
                <td style={{ padding: 'var(--spacing-3)' }}>{new Date(t.entryTime).toLocaleString()}</td>
                <td style={{ padding: 'var(--spacing-3)', fontWeight: 600 }}>{t.instrument}</td>
                <td style={{ padding: 'var(--spacing-3)' }}>
                  <Badge variant={t.side === 'BUY' ? 'success' : 'danger'}>{t.side}</Badge>
                </td>
                <td style={{ padding: 'var(--spacing-3)' }}>{t.quantity}</td>
                <td style={{ padding: 'var(--spacing-3)' }}>{t.entryPrice.toFixed(2)}</td>
                <td style={{ padding: 'var(--spacing-3)' }}>{t.exitPrice.toFixed(2)}</td>
                <td style={{ padding: 'var(--spacing-3)', fontWeight: 600, color: t.netPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {t.netPnl >= 0 ? '+' : ''}{t.netPnl.toFixed(2)}
                </td>
                <td style={{ padding: 'var(--spacing-3)' }}>{t.exitReason}</td>
              </tr>
            ))}
            {filteredTrades.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No trades found for selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
        title={`Trade #${selectedTrade?.tradeNumber} Details`}
        description={`Executed on ${selectedTrade?.instrument}`}
        confirmLabel="Close"
        variant="primary"
        onConfirm={() => setSelectedTrade(null)}
      >
        {selectedTrade && (
          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
              <div><span style={{ color: 'var(--color-text-secondary)' }}>Instrument:</span> <span style={{ fontWeight: 600 }}>{selectedTrade.instrument}</span></div>
              <div><span style={{ color: 'var(--color-text-secondary)' }}>Side:</span> <Badge variant={selectedTrade.side === 'BUY' ? 'success' : 'danger'}>{selectedTrade.side}</Badge></div>
              <div><span style={{ color: 'var(--color-text-secondary)' }}>Entry Time:</span> <span>{new Date(selectedTrade.entryTime).toLocaleString()}</span></div>
              <div><span style={{ color: 'var(--color-text-secondary)' }}>Exit Time:</span> <span>{new Date(selectedTrade.exitTime).toLocaleString()}</span></div>
              <div><span style={{ color: 'var(--color-text-secondary)' }}>Entry Price:</span> <span>₹{selectedTrade.entryPrice.toFixed(2)}</span></div>
              <div><span style={{ color: 'var(--color-text-secondary)' }}>Exit Price:</span> <span>₹{selectedTrade.exitPrice.toFixed(2)}</span></div>
              <div><span style={{ color: 'var(--color-text-secondary)' }}>Quantity:</span> <span>{selectedTrade.quantity}</span></div>
              <div><span style={{ color: 'var(--color-text-secondary)' }}>Fees:</span> <span>₹{selectedTrade.fees.toFixed(2)}</span></div>
              <div><span style={{ color: 'var(--color-text-secondary)' }}>Gross P&L:</span> <span>₹{selectedTrade.grossPnl.toFixed(2)}</span></div>
              <div><span style={{ color: 'var(--color-text-secondary)' }}>Net P&L:</span> <span style={{ fontWeight: 600, color: selectedTrade.netPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>₹{selectedTrade.netPnl.toFixed(2)}</span></div>
              <div><span style={{ color: 'var(--color-text-secondary)' }}>Exit Reason:</span> <span>{selectedTrade.exitReason}</span></div>
              <div><span style={{ color: 'var(--color-text-secondary)' }}>Strategy Version:</span> <span>{selectedTrade.strategyVersion}</span></div>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
}
