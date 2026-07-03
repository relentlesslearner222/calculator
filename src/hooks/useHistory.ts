import { useState, useEffect, useCallback } from 'react';
import { CalculationEntry, HistoryState } from '@/types';

const STORAGE_KEY = 'calc_history_state';
const MAX_ENTRIES = 20;

function deserialise(raw: string): HistoryState {
  const parsed = JSON.parse(raw) as {
    entries: Array<Omit<CalculationEntry, 'timestamp'> & { timestamp: string }>;
    undoStack: Array<Omit<CalculationEntry, 'timestamp'> & { timestamp: string }>;
    redoStack: Array<Omit<CalculationEntry, 'timestamp'> & { timestamp: string }>;
  };
  const revive = (e: Omit<CalculationEntry, 'timestamp'> & { timestamp: string }): CalculationEntry => ({
    ...e,
    timestamp: new Date(e.timestamp),
  });
  return {
    entries: parsed.entries.map(revive),
    undoStack: parsed.undoStack.map(revive),
    redoStack: parsed.redoStack.map(revive),
  };
}

function loadFromStorage(): HistoryState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return deserialise(raw);
  } catch {
    // ignore
  }
  return { entries: [], undoStack: [], redoStack: [] };
}

export interface UseHistoryReturn {
  entries: CalculationEntry[];
  canUndo: boolean;
  canRedo: boolean;
  push: (entry: CalculationEntry) => void;
  undo: () => void;
  redo: () => void;
  clearAll: () => void;
}

export function useHistory(): UseHistoryReturn {
  const [state, setState] = useState<HistoryState>(loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const push = useCallback((entry: CalculationEntry) => {
    setState((prev) => ({
      entries: [entry, ...prev.entries].slice(0, MAX_ENTRIES),
      undoStack: [],
      redoStack: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.entries.length === 0) return prev;
      const [head, ...rest] = prev.entries;
      return {
        entries: rest,
        undoStack: [head, ...prev.undoStack],
        redoStack: prev.redoStack,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.undoStack.length === 0) return prev;
      const [head, ...rest] = prev.undoStack;
      return {
        entries: [head, ...prev.entries].slice(0, MAX_ENTRIES),
        undoStack: rest,
        redoStack: prev.redoStack,
      };
    });
  }, []);

  const clearAll = useCallback(() => {
    setState({ entries: [], undoStack: [], redoStack: [] });
  }, []);

  return {
    entries: state.entries,
    canUndo: state.entries.length > 0,
    canRedo: state.undoStack.length > 0,
    push,
    undo,
    redo,
    clearAll,
  };
}
