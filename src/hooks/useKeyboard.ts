import { useEffect } from 'react';

interface KeyboardHandlers {
  onDigit: (d: string) => void;
  onOperator: (op: string) => void;
  onEvaluate: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onDecimal: () => void;
  onParen: (p: string) => void;
}

export function useKeyboard(handlers: KeyboardHandlers): void {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Ignore when focused on an input element
      if (
        document.activeElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (document.activeElement as HTMLElement).tagName
        )
      )
        return;

      const { key } = e;

      if (key >= '0' && key <= '9') {
        handlers.onDigit(key);
      } else if (key === '.') {
        handlers.onDecimal();
      } else if (key === '+') {
        handlers.onOperator('+');
      } else if (key === '-') {
        handlers.onOperator('-');
      } else if (key === '*') {
        handlers.onOperator('*');
      } else if (key === '/') {
        e.preventDefault();
        handlers.onOperator('/');
      } else if (key === '^') {
        handlers.onOperator('^');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handlers.onEvaluate();
      } else if (key === 'Escape') {
        handlers.onClear();
      } else if (key === 'Backspace') {
        handlers.onBackspace();
      } else if (key === '(') {
        handlers.onParen('(');
      } else if (key === ')') {
        handlers.onParen(')');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handlers]);
}
