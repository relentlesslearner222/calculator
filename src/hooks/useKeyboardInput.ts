import { useEffect, useCallback } from 'react';

interface KeyboardCallbacks {
  appendDigit: (d: string) => void;
  appendOperator: (op: string) => void;
  decimal: () => void;
  equals: () => void;
  backspace: () => void;
  clear: () => void;
  percent: () => void;
}

export function useKeyboardInput(
  callbacks: KeyboardCallbacks,
  enabled: boolean = true
): void {
  const { appendDigit, appendOperator, decimal, equals, backspace, clear, percent } = callbacks;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key;
      if (key >= '0' && key <= '9') appendDigit(key);
      else if (key === '.') decimal();
      else if (key === '+') appendOperator('+');
      else if (key === '-') appendOperator('-');
      else if (key === '*') appendOperator('*');
      else if (key === '/') { e.preventDefault(); appendOperator('/'); }
      else if (key === '^') appendOperator('^');
      else if (key === 'Enter' || key === '=') equals();
      else if (key === 'Backspace') backspace();
      else if (key === 'Escape') clear();
      else if (key === '%') percent();
    },
    [enabled, appendDigit, appendOperator, decimal, equals, backspace, clear, percent]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
