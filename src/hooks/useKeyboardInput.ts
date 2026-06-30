import { useEffect } from 'react';

interface KeyboardActions {
  appendDigit: (d: string) => void;
  appendOperator: (op: string) => void;
  decimal: () => void;
  equals: () => void;
  clear: () => void;
  backspace: () => void;
  percent: () => void;
}

export function useKeyboardInput(actions: KeyboardActions): void {
  const {
    appendDigit,
    appendOperator,
    decimal,
    equals,
    clear,
    backspace,
    percent,
  } = actions;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
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
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appendDigit, appendOperator, decimal, equals, clear, backspace, percent]);
}
