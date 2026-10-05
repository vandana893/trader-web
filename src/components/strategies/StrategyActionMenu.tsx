'use client';
import React, { useState, useRef, useEffect } from 'react';
import { StrategyStatus } from '@/types/strategy';

interface StrategyActionMenuProps {
  status: StrategyStatus;
  onAction: (action: string) => void;
}

export function StrategyActionMenu({ status, onAction }: StrategyActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleActionClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    onAction(action);
    setIsOpen(false);
  };

  const getActions = () => {
    switch (status) {
      case 'draft':
        return ['view', 'edit', 'duplicate'];
      case 'running':
        return ['view', 'pause', 'duplicate', 'stop'];
      case 'paused':
        return ['view', 'resume', 'duplicate', 'stop'];
      case 'stopped':
        return ['view', 'duplicate'];
      default:
        return ['view'];
    }
  };

  const actions = getActions();

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 'var(--spacing-1) var(--spacing-2)',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-xl)',
          lineHeight: 1,
          borderRadius: 'var(--radius-sm)',
        }}
        aria-label="Strategy actions"
      >
        ⋮
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 10,
          minWidth: '150px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          marginTop: 'var(--spacing-1)',
        }}>
          {actions.map((act) => {
            let textColor = 'var(--color-text-primary)';
            if (act === 'stop') textColor = 'var(--color-danger)';
            
            return (
              <button
                key={act}
                onClick={(e) => handleActionClick(e, act)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  padding: 'var(--spacing-2) var(--spacing-4)',
                  cursor: 'pointer',
                  color: textColor,
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  borderBottom: '1px solid var(--color-border)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {act}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
