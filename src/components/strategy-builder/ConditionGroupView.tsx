import React from 'react';
import { ConditionGroup, StrategyNode, LogicalOperator } from '@/types/strategy-builder';
import { StrategyNodeView } from './StrategyNodeView';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface ConditionGroupViewProps {
  group: ConditionGroup;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onDuplicateNode: (node: StrategyNode) => void;
  onDeleteNode: (groupId: string, nodeId: string) => void;
  onUpdateOperator: (groupId: string, operator: LogicalOperator) => void;
  onAddGroup: (parentId: string) => void;
  onRemoveGroup: (groupId: string) => void;
  isRoot?: boolean;
}

export function ConditionGroupView({
  group, selectedNodeId, onSelectNode, onDuplicateNode, onDeleteNode,
  onUpdateOperator, onAddGroup, onRemoveGroup, isRoot = false
}: ConditionGroupViewProps) {
  
  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-4)',
      backgroundColor: 'var(--color-surface)',
      marginBottom: 'var(--spacing-4)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <select 
          value={group.operator} 
          onChange={(e) => onUpdateOperator(group.id, e.target.value as LogicalOperator)}
          style={{
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary-dark)',
            fontWeight: 700,
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
          <option value="NOT">NOT</option>
        </select>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
          Condition Group
        </span>
        
        {!isRoot && (
          <button 
            onClick={() => onRemoveGroup(group.id)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}
            title="Remove Group"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--spacing-4)', 
        borderLeft: '2px solid var(--color-border)', 
        paddingLeft: 'var(--spacing-4)',
        marginLeft: 'var(--spacing-2)'
      }}>
        {group.conditions.map((item, index) => {
          const isGroup = 'operator' in item;
          return (
            <div key={item.id} style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: 'calc(-1 * var(--spacing-4) - 2px)',
                top: '20px',
                width: 'var(--spacing-4)',
                borderTop: '2px solid var(--color-border)'
              }} />
              {isGroup ? (
                <ConditionGroupView
                  group={item as ConditionGroup}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={onSelectNode}
                  onDuplicateNode={onDuplicateNode}
                  onDeleteNode={onDeleteNode}
                  onUpdateOperator={onUpdateOperator}
                  onAddGroup={onAddGroup}
                  onRemoveGroup={onRemoveGroup}
                />
              ) : (
                <StrategyNodeView 
                  node={item as StrategyNode} 
                  isSelected={selectedNodeId === item.id}
                  onSelect={() => onSelectNode(item.id)}
                  onDuplicate={() => onDuplicateNode(item as StrategyNode)}
                  onDelete={() => onDeleteNode(group.id, item.id)}
                />
              )}
            </div>
          );
        })}
        
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-2)' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>
            Click blocks from library to add here, or:
          </div>
          <Button variant="outline" size="sm" onClick={() => onAddGroup(group.id)}>
            <Plus size={14} style={{ marginRight: '4px' }} /> Add Sub-Group
          </Button>
        </div>
      </div>
    </div>
  );
}
