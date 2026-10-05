import React from 'react';
import { Card } from '../ui/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/Table';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export function OpenPositions({ positions }: { positions: any[] }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>Open Positions</h3>
        <Button variant="ghost" size="sm" href="/positions">View All</Button>
      </div>
      
      {!positions || positions.length === 0 ? (
        <EmptyState 
          title="No open positions" 
          description="You don't have any open positions right now." 
        />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Instrument</Th>
              <Th style={{ textAlign: 'right' }}>Qty</Th>
              <Th style={{ textAlign: 'right' }}>Avg Price</Th>
              <Th style={{ textAlign: 'right' }}>LTP</Th>
              <Th style={{ textAlign: 'right' }}>P&L</Th>
              <Th style={{ textAlign: 'right' }}>%</Th>
            </Tr>
          </Thead>
          <Tbody>
            {positions.map((p, idx) => (
              <Tr key={p.id || idx}>
                <Td style={{ fontWeight: 600 }}>{p.instrument}</Td>
                <Td style={{ textAlign: 'right' }}>{p.qty}</Td>
                <Td style={{ textAlign: 'right' }}>${p.avgPrice.toFixed(2)}</Td>
                <Td style={{ textAlign: 'right' }}>${p.currentPrice.toFixed(2)}</Td>
                <Td style={{ textAlign: 'right', color: p.pnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 500 }}>
                  {p.pnl >= 0 ? '+' : ''}${p.pnl.toLocaleString()}
                </Td>
                <Td style={{ textAlign: 'right', color: p.pnlPercent >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 500 }}>
                  {p.pnlPercent >= 0 ? '+' : ''}{p.pnlPercent}%
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Card>
  );
}
