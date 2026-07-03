import { useEffect } from 'react';
import { CalculatorAction } from '../types';
import { keyMap } from '../utils/keyMap';

interface UseKeyboardOptions {
  onAction: (action: CalculatorAction) => void;
  setActiveKey: (key: string | null) => void;
}

export function useKeyboard({ onAction, setActiveKey }: UseKeyboardOptions): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const action = keyMap[e.key];
      if (!action) return;
      // Prevent browser default for '/' (quick find) etc.
      e.preventDefault();
      onAction(action);
      setActiveKey(e.key);
      setTimeout(() => setActiveKey(null), 150);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAction, setActiveKey]);
}
