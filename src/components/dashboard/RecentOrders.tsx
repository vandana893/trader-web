import React from 'react';
import { Card } from '../ui/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export function RecentOrders({ orders }: { orders: any[] }) {
  const getStatusVariant = (status: string) => {
    switch(status.toLowerCase()) {
      case 'executed': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      case 'cancelled': return 'neutral';
      default: return 'neutral';
    }
  };

  const getSideVariant = (side: string) => side.toLowerCase() === 'buy' ? 'success' : 'danger';

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>Recent Orders</h3>
        <Button variant="ghost" size="sm" href="/orders">View All</Button>
      </div>
      
      {!orders || orders.length === 0 ? (
        <EmptyState 
          title="No recent orders" 
          description="Your order history is empty." 
        />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Instrument</Th>
              <Th>Type</Th>
              <Th>Side</Th>
              <Th style={{ textAlign: 'right' }}>Qty</Th>
              <Th style={{ textAlign: 'right' }}>Price</Th>
              <Th>Status</Th>
              <Th style={{ textAlign: 'right' }}>Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((o, idx) => (
              <Tr key={o.id || idx}>
                <Td style={{ fontWeight: 600 }}>{o.instrument}</Td>
                <Td>{o.type}</Td>
                <Td><span style={{ color: o.side === 'BUY' ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>{o.side}</span></Td>
                <Td style={{ textAlign: 'right' }}>{o.qty}</Td>
                <Td style={{ textAlign: 'right' }}>${o.price.toFixed(2)}</Td>
                <Td><Badge variant={getStatusVariant(o.status)}>{o.status}</Badge></Td>
                <Td style={{ textAlign: 'right', color: 'var(--color-text-secondary)' }}>{o.time}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Card>
  );
}
