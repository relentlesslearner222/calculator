import { HistoryEntry } from '../types/calculator';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

export function HistoryPanel({ entries, onClear }: HistoryPanelProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-3 mt-2 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-300 text-sm font-semibold uppercase tracking-wide">History</h2>
        <button
          onClick={onClear}
          className="bg-red-700 hover:bg-red-600 active:bg-red-500 text-white text-xs font-mono rounded-lg px-3 py-1 transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-800"
          aria-label="Clear History"
        >
          Clear History
        </button>
      </div>
      {entries.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">No calculations yet</p>
      ) : (
        <ul
          className="max-h-48 overflow-y-auto space-y-1"
          aria-label="calculation history"
        >
          {entries.map((entry, idx) => (
            <li
              key={idx}
              className="text-gray-300 font-mono text-sm flex justify-between gap-2 py-1 border-b border-gray-700 last:border-0"
            >
              <span className="truncate text-gray-400">{entry.expression}</span>
              <span className="whitespace-nowrap">&rarr; {entry.result}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
