'use client';
import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  style?: React.CSSProperties;
}

export function Select({ value, onChange, options, placeholder, style }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={containerRef} style={{ position: 'relative', minWidth: '150px', ...style }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: 'var(--spacing-3) var(--spacing-4)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--font-size-sm)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        <span>{selectedOption ? selectedOption.label : (placeholder || 'Select...')}</span>
        <svg 
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)', // Force open downwards
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 50,
          maxHeight: '250px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--spacing-1) 0'
        }}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              style={{
                padding: 'var(--spacing-2) var(--spacing-4)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-primary)',
                backgroundColor: 'transparent',
                transition: 'background-color 0.1s'
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}