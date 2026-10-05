import React from 'react';
import { ConditionGroup, StrategyNode, LogicalOperator } from '@/types/strategy-builder';
import { ConditionGroupView } from './ConditionGroupView';
import { StrategyNodeView } from './StrategyNodeView';

interface BuilderCanvasProps {
  nodes: StrategyNode[];
  conditionGroup: ConditionGroup;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onDuplicateNode: (node: StrategyNode) => void;
  onDeleteNode: (id: string) => void;
  onDeleteConditionNode: (groupId: string, nodeId: string) => void;
  onUpdateOperator: (groupId: string, operator: LogicalOperator) => void;
  onAddGroup: (parentId: string) => void;
  onRemoveGroup: (groupId: string) => void;
}

export function BuilderCanvas({
  nodes, conditionGroup, selectedNodeId, onSelectNode, onDuplicateNode, onDeleteNode,
  onDeleteConditionNode, onUpdateOperator, onAddGroup, onRemoveGroup
}: BuilderCanvasProps) {
  
  const marketNodes = nodes.filter(n => n.type === 'market' || n.type === 'instrument');
  const tradingNodes = nodes.filter(n => ['entry', 'repair', 'exit'].includes(n.type));
  const riskNodes = nodes.filter(n => n.type === 'risk' || n.type === 'notification');

  const renderSection = (title: string, sectionNodes: StrategyNode[]) => (
    <div style={{ marginBottom: 'var(--spacing-8)' }}>
      <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-2)' }}>
        {title}
      </h3>
      {sectionNodes.length === 0 ? (
        <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', fontStyle: 'italic', padding: 'var(--spacing-4)', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
          Click relevant blocks from the library to add {title.toLowerCase()}.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {sectionNodes.map(node => (
            <StrategyNodeView 
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={() => onSelectNode(node.id)}
              onDuplicate={() => onDuplicateNode(node)}
              onDelete={() => onDeleteNode(node.id)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ flex: 1, padding: 'var(--spacing-8)', overflowY: 'auto', backgroundColor: 'var(--color-background)', backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {renderSection('Market & Instrument', marketNodes)}

        <div style={{ marginBottom: 'var(--spacing-8)' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-2)' }}>
            Conditions
          </h3>
          <ConditionGroupView 
            group={conditionGroup}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            onDuplicateNode={onDuplicateNode}
            onDeleteNode={onDeleteConditionNode}
            onUpdateOperator={onUpdateOperator}
            onAddGroup={onAddGroup}
            onRemoveGroup={onRemoveGroup}
            isRoot={true}
          />
        </div>

        {renderSection('Trading Actions', tradingNodes)}
        
        {renderSection('Risk & Notifications', riskNodes)}
        
      </div>
    </div>
  );
}
