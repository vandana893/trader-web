import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StrategyBuilderState } from '@/types/strategy-builder';

interface JsonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: StrategyBuilderState;
}

export function JsonPreviewModal({ isOpen, onClose, state }: JsonPreviewModalProps) {
  const jsonString = JSON.stringify(state, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      // In a real app we'd use a toast, for now alert is fine if toast isn't available, but BRD says avoid alert.
      // We will just change button text temporarily if we can, but a simple console log works for a prototype.
      console.log('JSON copied');
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Strategy JSON Preview"
      description="Backend JSON representation of this strategy."
      confirmLabel="Close"
      onConfirm={onClose}
    >
      <div style={{ position: 'relative', marginTop: 'var(--spacing-4)' }}>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy}
          style={{ position: 'absolute', top: '8px', right: '8px' }}
        >
          Copy JSON
        </Button>
        <pre style={{ 
          backgroundColor: 'var(--color-neutral-bg)', 
          padding: 'var(--spacing-4)', 
          borderRadius: 'var(--radius-md)', 
          overflowX: 'auto',
          maxHeight: '400px',
          overflowY: 'auto',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-primary)'
        }}>
          {jsonString}
        </pre>
      </div>
    </Modal>
  );
}
