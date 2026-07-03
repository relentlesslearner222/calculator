import { useState, useCallback } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { useHistory } from '@/hooks/useHistory';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Display } from '@/components/Display';
import { Keypad } from '@/components/Keypad';
import { HistoryPanel } from '@/components/HistoryPanel';
import { CalculationEntry } from '@/types';

export default function App() {
  const calculator = useCalculator();
  const history = useHistory();
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  const handleEvaluate = useCallback(() => {
    const entry = calculator.evaluate();
    if (entry) {
      history.push(entry);
      setActiveEntryId(null);
    }
  }, [calculator, history]);

  const handleAppendToken = useCallback(
    (token: string) => {
      calculator.appendToken(token);
      setActiveEntryId(null);
    },
    [calculator]
  );

  const handleClear = useCallback(() => {
    calculator.clear();
    setActiveEntryId(null);
  }, [calculator]);

  const handleEntryClick = useCallback(
    (entry: CalculationEntry) => {
      calculator.restoreExpression(entry.expression);
      setActiveEntryId(entry.id);
    },
    [calculator]
  );

  useKeyboardShortcuts({
    onUndo: history.undo,
    onRedo: history.redo,
    onEvaluate: handleEvaluate,
    onClear: handleClear,
    onAppendToken: handleAppendToken,
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Calculator pane */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <Display
            expression={calculator.expression}
            displayValue={calculator.displayValue}
            isError={calculator.isError}
          />
          <Keypad
            onToken={handleAppendToken}
            onClear={handleClear}
            onEvaluate={handleEvaluate}
          />
        </div>
      </main>

      {/* History sidebar */}
      <HistoryPanel
        entries={history.entries}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={history.undo}
        onRedo={history.redo}
        onClearAll={history.clearAll}
        onEntryClick={handleEntryClick}
        activeEntryId={activeEntryId}
      />
    </div>
  );
}
