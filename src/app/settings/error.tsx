'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Settings Module Error:", error);
  }, [error]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
      <h2>Something went wrong in the Settings module!</h2>
      <p style={{ margin: '1rem 0' }}>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{ padding: '0.5rem 1rem', background: '#333', color: 'white', borderRadius: '4px' }}
      >
        Try again
      </button>
    </div>
  );
}
