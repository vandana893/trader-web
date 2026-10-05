import React from 'react';

export function Table({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table className={className} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }} {...props}>
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
      {children}
    </thead>
  );
}

export function Tbody({ children }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody>{children}</tbody>;
}

export function Tr({ children, className = '', style, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr 
      className={className} 
      style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.2s', ...style }}
      {...props}
    >
      {children}
    </tr>
  );
}

export function Th({ children, style, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)', fontWeight: 500, ...style }} {...props}>
      {children}
    </th>
  );
}

export function Td({ children, style, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', ...style }} {...props}>
      {children}
    </td>
  );
}