'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StrategyBuilderState, StrategyNode, ConditionGroup, BlockDefinition, LogicalOperator } from '@/types/strategy-builder';
import mockConfig from '@/data/mock/strategy-builder.json';

import { BuilderHeader } from '@/components/strategy-builder/BuilderHeader';
import { BlockLibrary } from '@/components/strategy-builder/BlockLibrary';
import { BuilderCanvas } from '@/components/strategy-builder/BuilderCanvas';
import { NodeConfigPanel } from '@/components/strategy-builder/NodeConfigPanel';
import { JsonPreviewModal } from '@/components/strategy-builder/JsonPreviewModal';
import { VersionHistoryModal } from '@/components/strategy-builder/VersionHistoryModal';
import { Modal } from '@/components/ui/Modal';

function StrategyBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const strategyId = searchParams.get('strategyId');

  const [state, setState] = useState<StrategyBuilderState>({
    strategyId: strategyId || `strat-${Date.now()}`,
    name: 'New Strategy',
    version: 1.0,
    status: 'draft',
    nodes: [],
    conditionGroup: { id: 'root', operator: 'AND', conditions: [] },
    history: [],
    isDirty: false
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Modals
  const [jsonOpen, setJsonOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [validationOpen, setValidationOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const savedState = localStorage.getItem(`builder-state-${strategyId}`);
    if (savedState) {
      setState(JSON.parse(savedState));
    } else if (strategyId) {
      const globalList = JSON.parse(localStorage.getItem('my-strategies-list') || '[]');
      const existing = globalList.find((s: any) => s.id === strategyId);
      if (existing) {
        setState(prev => ({
          ...prev,
          strategyId: existing.id,
          name: existing.name,
          version: existing.version ? parseFloat(existing.version.replace('v', '')) : 1.0,
          status: 'draft'
        }));
      }
    }
  }, [strategyId]);

  const generateId = () => `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Node Actions
  const handleAddBlock = (block: BlockDefinition) => {
    const newNode: StrategyNode = {
      id: generateId(),
      type: block.type,
      name: block.name,
      config: { ...block.defaultConfig }
    };
    
    // Categorize nodes
    if (['indicator', 'comparison', 'condition'].includes(block.type)) {
      // Add to root condition group
      setState(prev => ({
        ...prev,
        isDirty: true,
        conditionGroup: {
          ...prev.conditionGroup,
          conditions: [...prev.conditionGroup.conditions, newNode]
        }
      }));
    } else {
      // Add to linear flow
      setState(prev => ({ ...prev, isDirty: true, nodes: [...prev.nodes, newNode] }));
    }
    
    setSelectedNodeId(newNode.id);
  };

  const handleUpdateNode = (id: string, config: Record<string, any>) => {
    setState(prev => {
      // Search in linear nodes
      const newNodes = prev.nodes.map(n => n.id === id ? { ...n, config } : n);
      
      // Search in condition tree
      const updateInTree = (group: ConditionGroup): ConditionGroup => {
        return {
          ...group,
          conditions: group.conditions.map(item => {
            if ('operator' in item) {
              return updateInTree(item as ConditionGroup);
            }
            if (item.id === id) {
              return { ...item, config } as StrategyNode;
            }
            return item;
          })
        };
      };

      return {
        ...prev,
        isDirty: true,
        nodes: newNodes,
        conditionGroup: updateInTree(prev.conditionGroup)
      };
    });
  };

  const handleDuplicateNode = (node: StrategyNode) => {
    const newNode = { ...node, id: generateId() };
    
    if (['indicator', 'comparison', 'condition'].includes(node.type)) {
      setState(prev => ({
        ...prev,
        isDirty: true,
        conditionGroup: {
          ...prev.conditionGroup,
          conditions: [...prev.conditionGroup.conditions, newNode]
        }
      }));
    } else {
      setState(prev => ({ ...prev, isDirty: true, nodes: [...prev.nodes, newNode] }));
    }
  };

  const handleDeleteNode = (id: string) => {
    setState(prev => ({
      ...prev,
      isDirty: true,
      nodes: prev.nodes.filter(n => n.id !== id)
    }));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const handleDeleteConditionNode = (groupId: string, nodeId: string) => {
    setState(prev => {
      const deleteInTree = (group: ConditionGroup): ConditionGroup => {
        if (group.id === groupId) {
          return {
            ...group,
            conditions: group.conditions.filter(c => c.id !== nodeId)
          };
        }
        return {
          ...group,
          conditions: group.conditions.map(c => 'operator' in c ? deleteInTree(c as ConditionGroup) : c)
        };
      };
      return { ...prev, isDirty: true, conditionGroup: deleteInTree(prev.conditionGroup) };
    });
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  const handleUpdateOperator = (groupId: string, operator: LogicalOperator) => {
    setState(prev => {
      const updateInTree = (group: ConditionGroup): ConditionGroup => {
        if (group.id === groupId) {
          return { ...group, operator };
        }
        return {
          ...group,
          conditions: group.conditions.map(c => 'operator' in c ? updateInTree(c as ConditionGroup) : c)
        };
      };
      return { ...prev, isDirty: true, conditionGroup: updateInTree(prev.conditionGroup) };
    });
  };

  const handleAddGroup = (parentId: string) => {
    setState(prev => {
      const newGroup: ConditionGroup = { id: generateId(), operator: 'AND', conditions: [] };
      const addInTree = (group: ConditionGroup): ConditionGroup => {
        if (group.id === parentId) {
          return { ...group, conditions: [...group.conditions, newGroup] };
        }
        return {
          ...group,
          conditions: group.conditions.map(c => 'operator' in c ? addInTree(c as ConditionGroup) : c)
        };
      };
      return { ...prev, isDirty: true, conditionGroup: addInTree(prev.conditionGroup) };
    });
  };

  const handleRemoveGroup = (groupId: string) => {
    if (groupId === 'root') return; // Cannot delete root
    setState(prev => {
      const removeInTree = (group: ConditionGroup): ConditionGroup => {
        return {
          ...group,
          conditions: group.conditions.filter(c => c.id !== groupId).map(c => 'operator' in c ? removeInTree(c as ConditionGroup) : c)
        };
      };
      return { ...prev, isDirty: true, conditionGroup: removeInTree(prev.conditionGroup) };
    });
  };

  // Header Actions
  const handleSaveDraft = () => {
    const newState = { ...state, isDirty: false, status: 'draft' as const };
    setState(newState);
    localStorage.setItem(`builder-state-${state.strategyId}`, JSON.stringify(newState));
    alert('Draft saved successfully.');
  };

  const handleValidate = () => {
    const errors: string[] = [];
    if (!state.name.trim()) errors.push('Strategy name is required.');
    if (state.conditionGroup.conditions.length === 0) errors.push('At least one condition must exist.');
    
    const hasEntry = state.nodes.some(n => n.type === 'entry');
    if (!hasEntry) errors.push('An Entry rule is required.');

    setValidationErrors(errors);
    if (errors.length === 0) {
      setState(prev => ({ ...prev, status: 'validated' }));
    } else {
      setState(prev => ({ ...prev, status: 'draft' }));
    }
    setValidationOpen(true);
  };

  const handleCreateVersion = () => {
    if (state.status !== 'validated') {
      alert('Please validate the strategy before creating a new version.');
      return;
    }
    setState(prev => {
      const newVersion = prev.version + 1.0;
      const snap = { ...prev };
      delete (snap as any).history;
      
      const historyEntry = {
        version: prev.version,
        createdAt: new Date().toISOString(),
        stateSnapshot: snap,
        status: 'Saved' as const
      };
      
      const newState = { 
        ...prev, 
        version: newVersion, 
        history: [historyEntry, ...prev.history],
        isDirty: false
      };
      localStorage.setItem(`builder-state-${prev.strategyId}`, JSON.stringify(newState));
      return newState;
    });
    alert('New version created.');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to the last saved state?')) {
      const savedState = localStorage.getItem(`builder-state-${state.strategyId}`);
      if (savedState) {
        setState(JSON.parse(savedState));
      } else {
        alert('No saved state found to reset to.');
      }
    }
  };

  // Find selected node config
  let selectedNode = state.nodes.find(n => n.id === selectedNodeId) || null;
  if (!selectedNode) {
    const findInTree = (group: ConditionGroup): StrategyNode | null => {
      for (const c of group.conditions) {
        if ('operator' in c) {
          const res = findInTree(c as ConditionGroup);
          if (res) return res;
        } else if (c.id === selectedNodeId) {
          return c as StrategyNode;
        }
      }
      return null;
    };
    selectedNode = findInTree(state.conditionGroup);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <BuilderHeader 
        name={state.name} 
        onChangeName={(n) => setState(prev => ({ ...prev, name: n, isDirty: true }))}
        status={state.status}
        version={state.version}
        onSaveDraft={handleSaveDraft}
        onValidate={handleValidate}
        onCreateVersion={handleCreateVersion}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenJson={() => setJsonOpen(true)}
        onReset={handleReset}
      />
      
      <div className="builder-main-area" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <BlockLibrary blocks={mockConfig.blocks as BlockDefinition[]} onAddBlock={handleAddBlock} />
        
        <BuilderCanvas 
          nodes={state.nodes}
          conditionGroup={state.conditionGroup}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          onDuplicateNode={handleDuplicateNode}
          onDeleteNode={handleDeleteNode}
          onDeleteConditionNode={handleDeleteConditionNode}
          onUpdateOperator={handleUpdateOperator}
          onAddGroup={handleAddGroup}
          onRemoveGroup={handleRemoveGroup}
        />
        
        <NodeConfigPanel 
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          onClose={() => setSelectedNodeId(null)}
        />
      </div>

      <JsonPreviewModal isOpen={jsonOpen} onClose={() => setJsonOpen(false)} state={state} />
      <VersionHistoryModal 
        isOpen={historyOpen} 
        onClose={() => setHistoryOpen(false)} 
        history={state.history} 
        onRestore={(v) => {
          setState(prev => ({
            ...v.stateSnapshot,
            history: prev.history // Keep history intact
          }));
        }} 
      />

      <Modal
        isOpen={validationOpen}
        onClose={() => setValidationOpen(false)}
        title={validationErrors.length === 0 ? "Validation Successful" : "Validation Failed"}
        description={validationErrors.length === 0 ? "Strategy configuration is valid." : `${validationErrors.length} issues found`}
        confirmLabel="Close"
        variant={validationErrors.length === 0 ? "primary" : "danger"}
        onConfirm={() => setValidationOpen(false)}
      >
        {validationErrors.length > 0 && (
          <ul style={{ marginTop: 'var(--spacing-4)', paddingLeft: 'var(--spacing-4)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
            {validationErrors.map((e, i) => <li key={i} style={{ marginBottom: 'var(--spacing-2)' }}>{e}</li>)}
          </ul>
        )}
      </Modal>
    </div>
  );
}

export default function StrategyBuilderPage() {
  return (
    <Suspense fallback={<div>Loading builder...</div>}>
      <StrategyBuilderContent />
    </Suspense>
  );
}