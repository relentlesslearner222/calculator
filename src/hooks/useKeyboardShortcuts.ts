import { useEffect } from 'react';

export interface KeyboardShortcutHandlers {
  onUndo: () => void;
  onRedo: () => void;
  onEvaluate: () => void;
  onClear: () => void;
  onAppendToken: (token: string) => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      // Ctrl+Z → undo
      if (e.ctrlKey && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        handlers.onUndo();
        return;
      }

      // Ctrl+Y or Ctrl+Shift+Z → redo
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        handlers.onRedo();
        return;
      }

      // Digits and decimal
      if (/^[0-9.]$/.test(e.key)) {
        e.preventDefault();
        handlers.onAppendToken(e.key);
        return;
      }

      // Operators
      if (['+', '-', '*', '/'].includes(e.key)) {
        e.preventDefault();
        handlers.onAppendToken(e.key);
        return;
      }

      // Parentheses
      if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handlers.onAppendToken(e.key);
        return;
      }

      // Enter or = → evaluate
      if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handlers.onEvaluate();
        return;
      }

      // Escape or Delete → clear
      if (e.key === 'Escape' || e.key === 'Delete') {
        e.preventDefault();
        handlers.onClear();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handlers]);
}
