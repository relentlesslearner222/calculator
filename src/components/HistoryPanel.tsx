import { HistoryEntry } from '../types/calculator';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

export function HistoryPanel({ entries, onClear }: HistoryPanelProps) {
  return (
    <div className="bg-gray-800 rounded-b-2xl p-3" data-testid="history-panel">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-300 text-sm font-semibold">History</span>
        <button
          onClick={onClear}
          className="bg-red-700 hover:bg-red-600 active:bg-red-500 text-white text-xs px-2 py-1 rounded-lg"
          aria-label="Clear History"
          data-testid="btn-clear-history"
        >
          Clear History
        </button>
      </div>
      <div className="overflow-y-auto max-h-64" data-testid="history-list">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-2" data-testid="history-empty">
            No history yet
          </p>
        ) : (
          entries.map((entry, index) => (
            <div
              key={index}
              className="py-1 border-b border-gray-700 last:border-0"
              data-testid={`history-entry-${index}`}
            >
              <div className="text-gray-400 text-xs font-mono truncate">{entry.expression}</div>
              <div className="text-white font-mono text-sm text-right">{entry.result}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
