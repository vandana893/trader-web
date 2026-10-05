import React from 'react';
import { BlockDefinition, NodeType } from '@/types/strategy-builder';
import { Card } from '@/components/ui/Card';
import { Layers, Activity, GitCompare, Calculator, Clock, Briefcase, ShieldAlert, LogIn, Wrench, LogOut, Bell } from 'lucide-react';

interface BlockLibraryProps {
  blocks: BlockDefinition[];
  onAddBlock: (block: BlockDefinition) => void;
}

const getIconForType = (type: NodeType) => {
  switch (type) {
    case 'market': return <Layers size={16} />;
    case 'instrument': return <Briefcase size={16} />;
    case 'indicator': return <Activity size={16} />;
    case 'comparison': return <GitCompare size={16} />;
    case 'arithmetic': return <Calculator size={16} />;
    case 'time': return <Clock size={16} />;
    case 'position': return <Briefcase size={16} />;
    case 'risk': return <ShieldAlert size={16} />;
    case 'entry': return <LogIn size={16} />;
    case 'repair': return <Wrench size={16} />;
    case 'exit': return <LogOut size={16} />;
    case 'notification': return <Bell size={16} />;
    default: return <Layers size={16} />;
  }
};

export function BlockLibrary({ blocks, onAddBlock }: BlockLibraryProps) {
  const categories = Array.from(new Set(blocks.map(b => b.category)));

  return (
    <div className="block-library-panel" style={{
      width: '280px',
      borderRight: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-surface)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto'
    }}>
      <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, backgroundColor: 'var(--color-surface)', zIndex: 2 }}>
        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>Block Library</h3>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Click to add to canvas</p>
      </div>

      <div style={{ padding: 'var(--spacing-4)' }}>
        {categories.map(cat => (
          <div key={cat} style={{ marginBottom: 'var(--spacing-6)' }}>
            <h4 style={{ 
              fontSize: 'var(--font-size-xs)', 
              fontWeight: 700, 
              color: 'var(--color-text-muted)', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--spacing-3)'
            }}>
              {cat}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {blocks.filter(b => b.category === cat).map(block => (
                <Card 
                  key={block.type}
                  onClick={() => onAddBlock(block)}
                  style={{ 
                    padding: 'var(--spacing-3)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-3)',
                    backgroundColor: 'var(--color-surface-tinted)',
                    border: '1px solid transparent'
                  }}
                >
                  <div style={{ 
                    backgroundColor: 'var(--color-background)',
                    padding: 'var(--spacing-2)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-primary)'
                  }}>
                    {getIconForType(block.type)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{block.name}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{block.description}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
