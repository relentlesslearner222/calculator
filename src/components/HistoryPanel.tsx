import { HistoryEntry } from '../types/calculator';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

export function HistoryPanel({ entries, onClear }: HistoryPanelProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-3 flex flex-col h-full" aria-label="Calculation History">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-300 text-sm font-semibold uppercase tracking-wide">History</h2>
        <button
          onClick={onClear}
          className="bg-red-700 hover:bg-red-600 active:bg-red-500 text-white text-xs font-mono rounded-lg px-2 py-1 transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Clear History"
          data-testid="btn-clear-history"
        >
          Clear
        </button>
      </div>
      {entries.length === 0 ? (
        <p className="text-gray-500 text-sm text-center mt-4" data-testid="history-empty">
          No calculations yet
        </p>
      ) : (
        <ul
          className="overflow-y-auto flex-1 space-y-1"
          aria-label="history list"
          data-testid="history-list"
        >
          {entries.map((entry, idx) => (
            <li
              key={idx}
              className="bg-gray-700 rounded-lg px-3 py-2 text-sm font-mono"
              data-testid={`history-entry-${idx}`}
            >
              <span className="text-gray-400">{entry.expression}</span>
              <span className="text-gray-500 mx-1">→</span>
              <span className="text-white font-semibold">{entry.result}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
