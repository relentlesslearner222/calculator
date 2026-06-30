import React from 'react';
import { HistoryEntry } from '../types/calculator';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

export function HistoryPanel({ entries, onClear }: HistoryPanelProps) {
  return (
    <div
      className="bg-gray-800 rounded-2xl overflow-hidden flex flex-col"
      aria-label="Calculation history"
      data-testid="history-panel"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <h2 className="text-gray-300 text-sm font-semibold uppercase tracking-wide">History</h2>
        <button
          onClick={onClear}
          className="bg-red-700 hover:bg-red-600 active:bg-red-500 text-white text-xs font-mono font-medium rounded-lg px-3 py-1 transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-800"
          aria-label="Clear History"
          data-testid="btn-clear-history"
        >
          Clear History
        </button>
      </div>
      <div className="overflow-y-auto max-h-48">
        {entries.length === 0 ? (
          <p
            className="text-gray-500 text-sm text-center py-6 font-mono"
            data-testid="history-empty"
          >
            No calculations yet
          </p>
        ) : (
          <ul className="divide-y divide-gray-700" data-testid="history-list">
            {entries.map((entry, idx) => (
              <li
                key={idx}
                className="px-4 py-2 flex justify-between items-baseline gap-2"
                data-testid={`history-entry-${idx}`}
              >
                <span className="text-gray-400 font-mono text-xs truncate">{entry.expression}</span>
                <span className="text-gray-200 font-mono text-sm whitespace-nowrap">→ {entry.result}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
