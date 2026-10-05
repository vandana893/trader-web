import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft } from 'lucide-react';
import { StrategyVersion } from '@/types/strategy-builder';

interface BuilderHeaderProps {
  name: string;
  onChangeName: (name: string) => void;
  status: 'draft' | 'validated';
  version: number;
  onSaveDraft: () => void;
  onValidate: () => void;
  onCreateVersion: () => void;
  onOpenHistory: () => void;
  onOpenJson: () => void;
  onReset: () => void;
}

export function BuilderHeader({
  name, onChangeName, status, version,
  onSaveDraft, onValidate, onCreateVersion, onOpenHistory, onOpenJson, onReset
}: BuilderHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  const handleNameSave = () => {
    onChangeName(editName);
    setIsEditing(false);
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: 'var(--spacing-4) var(--spacing-6)',
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-surface)',
      position: 'sticky', top: 0, zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        <Button variant="ghost" size="sm" href="/strategies" style={{ padding: '4px' }}>
          <ChevronLeft size={20} />
        </Button>
        
        {isEditing ? (
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <input 
              type="text" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)}
              style={{
                padding: 'var(--spacing-1) var(--spacing-2)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-primary)',
                outline: 'none',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 600
              }}
              autoFocus
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
            />
          </div>
        ) : (
          <h1 
            style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setIsEditing(true)}
            title="Click to edit name"
          >
            {name || 'Untitled Strategy'}
          </h1>
        )}

        <Badge variant={status === 'validated' ? 'success' : 'warning'}>
          {status.toUpperCase()}
        </Badge>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          v{version.toFixed(1)}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
        <Button variant="ghost" size="sm" onClick={onReset}>Reset</Button>
        <Button variant="ghost" size="sm" onClick={onOpenJson}>View JSON</Button>
        <Button variant="outline" size="sm" onClick={onOpenHistory}>History</Button>
        <Button variant="outline" size="sm" onClick={onSaveDraft}>Save Draft</Button>
        <Button variant="outline" size="sm" onClick={onValidate}>Validate</Button>
        <Button variant="primary" size="sm" onClick={onCreateVersion}>Create Version</Button>
      </div>
    </div>
  );
}
