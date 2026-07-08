export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  mode?: 'standard' | 'scientific';
}

const STORAGE_KEY = 'calculator_history';
const MAX_ENTRIES = 50;

function loadFromStorage(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as HistoryEntry[];
    return [];
  } catch {
    return [];
  }
}

function persist(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore storage errors
  }
}

let entries: HistoryEntry[] = loadFromStorage();

export const historyStore = {
  addEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
    const newEntry: HistoryEntry = {
      ...entry,
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(),
      timestamp: Date.now(),
    };
    entries = [newEntry, ...entries].slice(0, MAX_ENTRIES);
    persist(entries);
  },

  getEntries(): HistoryEntry[] {
    return [...entries];
  },

  clearEntries(): void {
    entries = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  /** For testing: reset module state */
  _reset(): void {
    entries = [];
  },
};
