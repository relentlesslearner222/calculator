import { useState, useCallback } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { useKeyboard } from './hooks/useKeyboard';
import { Display } from './components/Display';
import { ButtonGrid } from './components/ButtonGrid';
import { CalculatorAction } from './types';

export function App() {
  const { displayValue, dispatch } = useCalculator();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleAction = useCallback(
    (action: CalculatorAction) => dispatch(action),
    [dispatch]
  );

  const handleSetActiveKey = useCallback(
    (key: string | null) => setActiveKey(key),
    []
  );

  useKeyboard({ onAction: handleAction, setActiveKey: handleSetActiveKey });

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-xs">
        <Display value={displayValue} />
        <ButtonGrid onAction={handleAction} activeKey={activeKey} />
      </div>
    </div>
  );
}
