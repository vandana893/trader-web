'use client';
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export function ActiveStrategies({ strategies }: { strategies: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = strategies?.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  const getStatusVariant = (status: string) => {
    switch(status.toLowerCase()) {
      case 'running': return 'success';
      case 'paused': return 'warning';
      case 'stopped': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>Active Strategies</h3>
        <input 
          type="text" 
          placeholder="Search strategies..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            padding: 'var(--spacing-2) var(--spacing-3)', 
            border: '1px solid var(--color-border)', 
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)'
          }}
        />
      </div>
      
      {filtered.length === 0 ? (
        <EmptyState 
          title="No strategies found" 
          description={searchTerm ? "Try a different search term" : "You have no active strategies"} 
          actionLabel="Explore Strategies"
          actionHref="/strategies"
        />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Mode</Th>
              <Th>Today's P&L</Th>
              <Th>Last Activity</Th>
              <Th style={{ textAlign: 'right' }}>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((s, idx) => (
              <Tr key={s.id || idx}>
                <Td style={{ fontWeight: 500 }}>{s.name}</Td>
                <Td><Badge variant={getStatusVariant(s.status)}>{s.status}</Badge></Td>
                <Td>{s.mode}</Td>
                <Td style={{ color: s.todayPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 500 }}>
                  {s.todayPnl >= 0 ? '+' : ''}${s.todayPnl.toLocaleString()}
                </Td>
                <Td style={{ color: 'var(--color-text-secondary)' }}>{s.lastActivity}</Td>
                <Td style={{ textAlign: 'right' }}>
                  <Button variant="ghost" size="sm" href={`/strategies`}>View</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Card>
  );
}
