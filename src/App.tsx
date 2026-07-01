import { useState } from 'react';
import { Display } from './components/Display';
import { ButtonGrid } from './components/ButtonGrid';
import { HistoryPanel } from './components/HistoryPanel';
import { useCalculator } from './hooks/useCalculator';
import { useKeyboardInput } from './hooks/useKeyboardInput';

export default function App() {
  const { expression, display, history, dispatch } = useCalculator();
  const [showHistory, setShowHistory] = useState(false);

  useKeyboardInput(dispatch);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-white text-xl font-bold">Calculator</h1>
          <button
            className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
            onClick={() => setShowHistory((v) => !v)}
            aria-label="Toggle history"
          >
            <span>History</span>
            {history.length > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {history.length}
              </span>
            )}
          </button>
        </div>

        {showHistory ? (
          <HistoryPanel
            history={history}
            onRestore={dispatch}
            onClose={() => setShowHistory(false)}
          />
        ) : (
          <div className="bg-gray-800 rounded-2xl p-4 shadow-2xl">
            <Display expression={expression} display={display} />
            <ButtonGrid onAction={dispatch} />
          </div>
        )}
      </div>
    </div>
  );
}
