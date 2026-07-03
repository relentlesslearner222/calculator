import { useState, useEffect, useCallback } from 'react';
import { CalculationEntry } from '@/types';
import { HistoryEntry } from './HistoryEntry';
import { ClearHistoryConfirm } from './ClearHistoryConfirm';

interface HistoryPanelProps {
  entries: CalculationEntry[];
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClearAll: () => void;
  onEntryClick: (entry: CalculationEntry) => void;
  activeEntryId: string | null;
}

export function HistoryPanel({
  entries,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearAll,
  onEntryClick,
  activeEntryId,
}: HistoryPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const handleClearConfirm = useCallback(() => {
    onClearAll();
    setShowClearConfirm(false);
  }, [onClearAll]);

  const panelContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold text-gray-700">History</h2>
        <div className="flex gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Undo"
          >
            ↩ Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Redo"
          >
            ↪ Redo
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {entries.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">No calculations yet</p>
        ) : (
          entries.map((entry) => (
            <HistoryEntry
              key={entry.id}
              entry={entry}
              isActive={activeEntryId === entry.id}
              onClick={onEntryClick}
              now={now}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {entries.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200">
          {showClearConfirm ? (
            <ClearHistoryConfirm
              onConfirm={handleClearConfirm}
              onCancel={() => setShowClearConfirm(false)}
            />
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Clear history
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 bg-amber-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg text-lg"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle history"
      >
        {mobileOpen ? '✕' : '⏱'}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
            role="presentation"
          />
          <div className="w-72 bg-white h-full shadow-xl">{panelContent}</div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-72 bg-white border-l border-gray-200 h-full">
        {panelContent}
      </aside>
    </>
  );
}
