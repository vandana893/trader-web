import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StrategyVersion } from '@/types/strategy-builder';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: StrategyVersion[];
  onRestore: (version: StrategyVersion) => void;
}

export function VersionHistoryModal({ isOpen, onClose, history, onRestore }: VersionHistoryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Version History"
      description="Restore a previous local version of this strategy."
      confirmLabel="Close"
      onConfirm={onClose}
    >
      <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        {history.length === 0 ? (
          <div style={{ color: 'var(--color-text-muted)' }}>No versions saved yet.</div>
        ) : (
          history.map((v, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: 'var(--spacing-3)', 
              border: '1px solid var(--color-border)', 
              borderRadius: 'var(--radius-md)' 
            }}>
              <div>
                <div style={{ fontWeight: 600 }}>Version {v.version.toFixed(1)}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  {new Date(v.createdAt).toLocaleString()} • {v.status}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  if(confirm(`Are you sure you want to restore Version ${v.version.toFixed(1)}? Unsaved changes will be lost.`)) {
                    onRestore(v);
                    onClose();
                  }
                }}
              >
                Restore
              </Button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
