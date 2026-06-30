import React, { useState, useCallback } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { useKeyboard } from '../hooks/useKeyboard';
import { useTheme } from '../hooks/useTheme';
import { Display } from './Display';
import { ButtonGrid } from './ButtonGrid';
import { HistoryPanel } from './HistoryPanel';

export const Calculator: React.FC = () => {
  const { state, actions } = useCalculator();
  const [theme, toggleTheme] = useTheme();
  const [historyOpen, setHistoryOpen] = useState(false);

  const keyHandlers = useCallback(
    () => ({
      onDigit: actions.append,
      onOperator: actions.operator,
      onEvaluate: actions.evaluate,
      onClear: actions.clear,
      onBackspace: actions.backspace,
      onDecimal: () => actions.append('.'),
      onParen: actions.append,
    }),
    [actions]
  );

  useKeyboard(keyHandlers());

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark' ? 'dark bg-gray-950' : 'bg-gray-200'
      }`}
    >
      <div
        data-testid="calculator-root"
        className="w-full max-w-sm bg-gray-800 dark:bg-gray-900 rounded-2xl shadow-2xl p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white text-sm font-semibold tracking-wide">
            Scientific Calculator
          </h1>
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="text-gray-400 hover:text-white transition-colors text-lg"
            data-testid="theme-toggle"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Display */}
        <Display
          expression={state.expression}
          result={state.result}
          error={state.error}
          memory={state.memory}
          angleMode={state.angleMode}
        />

        {/* Buttons */}
        <ButtonGrid
          angleMode={state.angleMode}
          onDigit={actions.append}
          onOperator={actions.operator}
          onFunction={actions.fn}
          onEvaluate={actions.evaluate}
          onClear={actions.clear}
          onBackspace={actions.backspace}
          onToggleSign={actions.toggleSign}
          onPercent={actions.percent}
          onToggleAngle={actions.toggleAngle}
          onMemStore={actions.memStore}
          onMemRecall={actions.memRecall}
          onMemClear={actions.memClear}
          onMemAdd={actions.memAdd}
          onMemSub={actions.memSub}
          onParen={actions.append}
        />

        {/* Backspace row */}
        <div className="mt-1.5">
          <button
            onClick={actions.backspace}
            className="w-full h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition-all active:scale-95"
            data-testid="btn-backspace"
          >
            ⌫ Backspace
          </button>
        </div>

        {/* History */}
        <HistoryPanel
          history={state.history}
          onRestore={actions.restoreHistory}
          onClear={actions.clearHistory}
          isOpen={historyOpen}
          onToggle={() => setHistoryOpen((o) => !o)}
        />
      </div>
    </div>
  );
};
