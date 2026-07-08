import { useState, useMemo, useCallback } from 'react';
import { historyStore, HistoryEntry } from '../lib/historyStore';

export interface UseHistoryReturn {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearEntries: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function useHistory(): UseHistoryReturn {
  const [allEntries, setAllEntries] = useState<HistoryEntry[]>(() => historyStore.getEntries());
  const [searchQuery, setSearchQuery] = useState('');

  const addEntry = useCallback((entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    historyStore.addEntry(entry);
    setAllEntries(historyStore.getEntries());
  }, []);

  const clearEntries = useCallback(() => {
    historyStore.clearEntries();
    setAllEntries(historyStore.getEntries());
  }, []);

  const entries = useMemo(() => {
    if (!searchQuery.trim()) return allEntries;
    const q = searchQuery.toLowerCase();
    return allEntries.filter(
      (e) =>
        e.expression.toLowerCase().includes(q) ||
        e.result.toLowerCase().includes(q)
    );
  }, [allEntries, searchQuery]);

  return { entries, addEntry, clearEntries, searchQuery, setSearchQuery };
}
