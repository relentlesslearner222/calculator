import { HistoryEntry } from '../types/calculator';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

export function HistoryPanel({ entries, onClear }: HistoryPanelProps) {
  return (
    <div className="bg-gray-800 rounded-b-2xl p-3 w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-300 text-sm font-semibold">History</span>
        <button
          onClick={onClear}
          aria-label="Clear History"
          className="bg-red-700 hover:bg-red-600 active:bg-red-500 text-white text-xs font-mono rounded-lg px-2 py-1 transition-colors duration-100"
        >
          Clear History
        </button>
      </div>
      {entries.length === 0 ? (
        <p className="text-gray-500 text-xs text-center py-2">No calculations yet</p>
      ) : (
        <ul
          className="overflow-y-auto max-h-40 space-y-1"
          aria-label="calculation history"
        >
          {entries.map((entry, index) => (
            <li
              key={index}
              className="text-gray-300 text-xs font-mono flex justify-between gap-2 border-b border-gray-700 pb-1"
            >
              <span className="text-gray-400 truncate">{entry.expression}</span>
              <span className="text-white whitespace-nowrap">= {entry.result}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
