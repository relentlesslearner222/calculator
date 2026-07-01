import { HistoryEntry, CalcAction } from '../hooks/useCalculator';

type Dispatch = (action: CalcAction) => void;

interface Props {
  history: HistoryEntry[];
  onRestore: Dispatch;
  onClose: () => void;
}

export function HistoryPanel({ history, onRestore, onClose }: Props) {
  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-xl p-4" data-testid="history-panel">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-lg">History</h2>
        <div className="flex gap-2">
          {history.length > 0 && (
            <button
              className="text-xs text-red-400 hover:text-red-300"
              onClick={() => onRestore({ type: 'CLEAR_HISTORY' })}
            >
              Clear
            </button>
          )}
          <button
            className="text-gray-400 hover:text-white text-xl leading-none"
            onClick={onClose}
            aria-label="Close history"
          >
            ×
          </button>
        </div>
      </div>
      {history.length === 0 ? (
        <p className="text-gray-500 text-sm text-center mt-8">No history yet</p>
      ) : (
        <ul className="overflow-y-auto flex-1 space-y-2">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() =>
                onRestore({ type: 'RESTORE_HISTORY', expression: entry.expression, result: entry.result })
              }
            >
              <div className="text-gray-400 text-sm truncate">{entry.expression}</div>
              <div className="text-white font-mono text-lg">{entry.result}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
