import { HistoryEntry } from '../types/calculator';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

export function HistoryPanel({ entries, onClear }: HistoryPanelProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-3 flex flex-col" aria-label="Calculation History">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-gray-300 text-sm font-semibold">History</h2>
        <button
          onClick={onClear}
          className="bg-red-700 hover:bg-red-600 active:bg-red-500 text-white text-xs font-mono rounded-lg px-2 py-1 transition-colors duration-100"
          aria-label="Clear History"
          data-testid="btn-clear-history"
        >
          Clear History
        </button>
      </div>
      {entries.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4" data-testid="history-empty">
          No calculations yet
        </p>
      ) : (
        <ul
          className="overflow-y-auto max-h-48 flex flex-col gap-1"
          aria-label="history list"
          data-testid="history-list"
        >
          {entries.map((entry, idx) => (
            <li
              key={idx}
              className="text-gray-300 text-sm font-mono bg-gray-700 rounded-lg px-3 py-1 flex justify-between gap-2"
              data-testid={`history-entry-${idx}`}
            >
              <span className="text-gray-400 truncate">{entry.expression}</span>
              <span className="text-white font-semibold">= {entry.result}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
