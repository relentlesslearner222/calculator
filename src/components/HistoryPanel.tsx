import React from 'react';
import type { HistoryEntry } from '../types/calculator';
import { formatExpression } from '../utils/format';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onRestore,
  onClear,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        <button
          onClick={onToggle}
          className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1 transition-colors"
          data-testid="history-toggle"
        >
          <span>{isOpen ? '▾' : '▸'}</span>
          <span>History ({history.length})</span>
        </button>
        {isOpen && history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
            data-testid="history-clear"
          >
            Clear
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="mt-1 max-h-48 overflow-y-auto space-y-1"
          data-testid="history-list"
        >
          {history.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-2">No history yet</p>
          ) : (
            history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onRestore(entry)}
                className="w-full text-left px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
                data-testid={`history-item-${entry.id}`}
              >
                <div className="text-xs text-gray-400 font-mono truncate">
                  {formatExpression(entry.expression)}
                </div>
                <div className="text-sm text-white font-mono font-semibold">
                  = {entry.result}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
