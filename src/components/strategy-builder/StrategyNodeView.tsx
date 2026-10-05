import React from 'react';
import { StrategyNode } from '@/types/strategy-builder';
import { Card } from '@/components/ui/Card';
import { Copy, Trash2, Edit2 } from 'lucide-react';

interface StrategyNodeViewProps {
  node: StrategyNode;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function StrategyNodeView({ node, isSelected, onSelect, onDuplicate, onDelete }: StrategyNodeViewProps) {
  
  const getSummary = () => {
    switch (node.type) {
      case 'indicator':
        return `${node.config.indicator || 'Unknown'} (${node.config.period || '-'}, ${node.config.timeframe || '-'})`;
      case 'comparison':
        return `${node.config.left || '?'} ${node.config.operator || '>'} ${node.config.right || '?'}`;
      case 'entry':
      case 'exit':
        return `${node.config.orderType || 'Market'}`;
      default:
        return 'Configured';
    }
  };

  return (
    <Card 
      onClick={onSelect}
      style={{ 
        width: '100%', 
        maxWidth: '300px', 
        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
        boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <span style={{ 
            fontSize: '10px', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            color: 'var(--color-primary)', 
            backgroundColor: 'var(--color-primary-light)', 
            padding: '2px 6px', 
            borderRadius: '4px' 
          }}>
            {node.type}
          </span>
          <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
            {node.name}
          </span>
        </div>
      </div>
      
      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>
        {getSummary()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-2)' }}>
        <button 
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
          title="Edit"
        ><Edit2 size={14} /></button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
          title="Duplicate"
        ><Copy size={14} /></button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}
          title="Delete"
        ><Trash2 size={14} /></button>
      </div>
    </Card>
  );
}
