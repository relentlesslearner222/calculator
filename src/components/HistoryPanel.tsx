import { useEffect, useRef } from 'react';
import { useHistory } from '../hooks/useHistory';
import { HistoryEntry } from '../lib/historyStore';
import './HistoryPanel.css';

interface HistoryPanelProps {
  onReplay: (result: string) => void;
  newEntry?: Omit<HistoryEntry, 'id' | 'timestamp'> | null;
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function HistoryPanel({ onReplay, newEntry }: HistoryPanelProps) {
  const { entries, addEntry, clearEntries, searchQuery, setSearchQuery } = useHistory();
  const prevEntryRef = useRef<typeof newEntry>(null);
  const newIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (newEntry && newEntry !== prevEntryRef.current) {
      prevEntryRef.current = newEntry;
      addEntry(newEntry);
      // Mark the newest entry id for animation
      const stored = entries;
      if (stored.length > 0) newIdRef.current = stored[0]?.id ?? null;
    }
  }, [newEntry, addEntry, entries]);

  const handleClear = () => {
    if (window.confirm('Clear all history?')) {
      clearEntries();
    }
  };

  return (
    <aside className="history-panel">
      <div className="history-panel__header">
        <h2 className="history-panel__title">History</h2>
        <button
          className="history-panel__clear-btn"
          onClick={handleClear}
          disabled={entries.length === 0 && !searchQuery}
        >
          Clear
        </button>
      </div>
      <div className="history-panel__search-wrapper">
        <input
          className="history-panel__search"
          type="search"
          placeholder="Search history…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search history"
        />
      </div>
      <ul className="history-panel__list">
        {entries.length === 0 ? (
          <li className="history-panel__empty">
            <p>No history entries</p>
          </li>
        ) : (
          entries.map((entry) => (
            <li
              key={entry.id}
              className={`history-panel__item${
                newIdRef.current === entry.id ? ' entry--new' : ''
              }`}
            >
              <button
                className="history-panel__entry-btn"
                onClick={() => onReplay(entry.result)}
                title={`Replay: ${entry.expression} = ${entry.result}`}
              >
                <span className="history-panel__expression">
                  {entry.expression} <span className="history-panel__arrow">→</span> {entry.result}
                </span>
                <span className="history-panel__timestamp">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
