import React from 'react';
import { StrategyNode } from '@/types/strategy-builder';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import mockConfig from '@/data/mock/strategy-builder.json';

interface NodeConfigPanelProps {
  selectedNode: StrategyNode | null;
  onUpdateNode: (id: string, config: Record<string, any>) => void;
  onClose: () => void;
}

export function NodeConfigPanel({ selectedNode, onUpdateNode, onClose }: NodeConfigPanelProps) {
  if (!selectedNode) {
    return (
      <div className="node-config-panel" style={{ width: '320px', borderLeft: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
        Select a node to configure
      </div>
    );
  }

  const handleConfigChange = (key: string, value: any) => {
    onUpdateNode(selectedNode.id, { ...selectedNode.config, [key]: value });
  };

  const renderConfigFields = () => {
    const { type, config } = selectedNode;
    
    switch (type) {
      case 'indicator':
        return (
          <>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Indicator Type</label>
              <Select 
                value={config.indicator || ''} 
                onChange={(val) => handleConfigChange('indicator', val)} 
                options={mockConfig.indicators.map(i => ({ label: i, value: i }))} 
              />
            </div>
            {config.indicator && (
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Period</label>
                <input 
                  type="number" 
                  value={config.period || 14} 
                  onChange={(e) => handleConfigChange('period', Number(e.target.value))}
                  style={{ width: '100%', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', outline: 'none' }}
                />
              </div>
            )}
          </>
        );
      
      case 'comparison':
        return (
          <>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Left Operand</label>
              <input 
                type="text" 
                value={config.left || ''} 
                onChange={(e) => handleConfigChange('left', e.target.value)}
                placeholder="e.g., RSI"
                style={{ width: '100%', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', outline: 'none' }}
              />
            </div>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Operator</label>
              <Select 
                value={config.operator || '>'} 
                onChange={(val) => handleConfigChange('operator', val)} 
                options={mockConfig.operators.map(o => ({ label: o, value: o }))} 
              />
            </div>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Right Operand</label>
              <input 
                type="text" 
                value={config.right || ''} 
                onChange={(e) => handleConfigChange('right', e.target.value)}
                placeholder="e.g., 60"
                style={{ width: '100%', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', outline: 'none' }}
              />
            </div>
          </>
        );

      case 'entry':
      case 'exit':
        return (
          <>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Order Type</label>
              <Select 
                value={config.orderType || 'Market'} 
                onChange={(val) => handleConfigChange('orderType', val)} 
                options={mockConfig.orderTypes.map(o => ({ label: o, value: o }))} 
              />
            </div>
            {config.orderType !== 'Market' && (
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Price</label>
                <input 
                  type="number" 
                  value={config.price || ''} 
                  onChange={(e) => handleConfigChange('price', Number(e.target.value))}
                  style={{ width: '100%', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', outline: 'none' }}
                />
              </div>
            )}
          </>
        );

      default:
        return (
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            No specific configuration for {type} node yet.
            <pre style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-background)', borderRadius: 'var(--radius-sm)', overflowX: 'auto' }}>
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="node-config-panel" style={{
      width: '320px',
      borderLeft: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-surface)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto'
    }}>
      <div style={{ 
        padding: 'var(--spacing-4)', 
        borderBottom: '1px solid var(--color-border)', 
        position: 'sticky', 
        top: 0, 
        backgroundColor: 'var(--color-surface)', 
        zIndex: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>Configuration</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
      </div>

      <div style={{ padding: 'var(--spacing-4)' }}>
        <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, marginBottom: 'var(--spacing-1)' }}>{selectedNode.name}</h4>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>Type: {selectedNode.type}</div>
        
        {renderConfigFields()}
      </div>
    </div>
  );
}
